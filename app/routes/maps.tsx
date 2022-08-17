import { Switch, Tab, Transition } from "@headlessui/react";
import Map, { Layer, MapRef, Source } from 'react-map-gl';
import { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Fragment, MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toGeoJSON } from '@mapbox/polyline';
import mapboxgl from "mapbox-gl";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export async function loader({ request }: LoaderArgs) {
    return process.env.MAPBOX_API_KEY;
}

declare type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
export const libraries:Libraries = ['places']

declare type Routes = {
    [index: string]: GeoJSON.Feature,
}

declare type NameValue = {
    [index: string]: string,
}

/**
 * The main map function with overlays.
 * TODO: All routes using different transportation options will be calculated and toggled when the user chooses them.
 * TODO: Make the url metadata change when a route is calculated so that the user can share/revisit the output
 * @returns the map and overlays
 */
export default function Maps() {
    let [isShowingTopMenu, setIsShowingTopMenu] = useState(true)

    const apiKey = useLoaderData();

    const MapboxGeocoderSDK = require('@mapbox/mapbox-sdk/services/geocoding')
    const MapboxDirectionsModule = require('@mapbox/mapbox-sdk/services/directions');
    const directionService = new MapboxDirectionsModule({
        accessToken: apiKey,
        unit: 'metric',
        alternatives: false,
        geometries: 'geojson',
        controls: { instructions: false },
        flyTo: true,
    });
    const geocodingClient = new MapboxGeocoderSDK({
        accessToken: apiKey
    });

    const travelTypes: string[] = ['driving-traffic', 'walking', 'cycling'];
    const lowerLat = 1.2;
    const upperLat = 1.48;
    const lowerLng = 103.59;
    const upperLng = 104.05;

    const mapboxMapRef = useRef<MapRef>(null);
    const [mapboxMap, setMapboxMap] = useState<mapboxgl.Map>();

    const startMarker = useRef<mapboxgl.Marker>();
    const endMarker = useRef<mapboxgl.Marker>();
    const [markerSelector, setMarkerSelector] = useState<string>('');

    // Set up map and marker after map is fully loaded
    useEffect(() => {
        if (mapboxMapRef != undefined && mapboxMapRef.current != null) {
            setMapboxMap(mapboxMapRef.current.getMap())

            startMarker.current = new mapboxgl.Marker({color: "#20ba44"})
            endMarker.current = new mapboxgl.Marker({color: "#972FFE"})
        }
    }, [mapboxMapRef.current?.loaded])

    const [displayDistance, setDisplayDistance] = useState<string>('');
    const [displayDuration, setDisplayDuration] = useState<string>('');

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const [startLngLat, setStartLngLat] = useState<mapboxgl.LngLat>();
    const [endLngLat, setEndLngLat] = useState<mapboxgl.LngLat>();

    const placeholderFeature: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: null
    }

    const [activeTravelType, setActiveTravelType] = useState<string>('driving-traffic');
    const [activeRoute, setActiveRoute] = useState<GeoJSON.Feature>();
    const [inactiveRoutes , setInactiveRoutes] = useState<GeoJSON.FeatureCollection>();
    const [availableRoutes, setAvailableRoutes] = useState<Routes>({
        'driving-traffic': placeholderFeature,
        'cycling': placeholderFeature,
        'walking': placeholderFeature,
    });
    const [availableDistances, setAvailableDistances] = useState<NameValue>({
        'driving-traffic': '',
        'cycling': '',
        'walking': '',
    });
    const [availableDuration, setAvailableDuration] = useState<NameValue>({
        'driving-traffic': '',
        'cycling': '',
        'walking': '',
    });

    const activeRoutesLayer: mapboxgl.LineLayer = {
        id: 'routes-active',
        type: 'line',
        layout: {
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#20ba44',
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#20ba44',
            1,
            '#972FFE',
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            ['boolean', ['feature-state', 'fadein'], false],
            0.07,
            0.9, // default
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            5,
            16,
            13,
            22,
            25,
          ],
        },
      }

      const inactiveRoutesLayer: mapboxgl.LineLayer = {
        id: 'routes-inactive',
        type: 'line',
        layout: {
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#a0a0a0',
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#a0a0a0',
            1,
            '#a0a0a0',
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            ['boolean', ['feature-state', 'fadein'], false],
            0.07,
            0.5, // default
          ],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            5,
            16,
            13,
            22,
            25,
          ],
        },
      }

    const parseDistance = (distance: number | undefined) : string => {
        if (distance == undefined) {
            return ''
        } else if (distance < 1000) {
            return distance.toFixed(0) + ' m';
        } else {
            return (distance / 1000).toFixed(1) + ' km'
        }
    }

    const parseDuration = (duration: number | undefined) : string => {
        if (duration == undefined) {
            return ''
        } else if (duration < 60) {
            return 1 + ' min';
        } else if (duration < 3600) {
            return (duration / 60).toFixed(0) + ' mins'
        } else {
            return (duration / 3600).toFixed(0) + ' h ' + ((duration % 3600) / 60).toFixed(0) + ' mins'
        }
    }

    const calculateRoute = async () => {
        if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '' || startLngLat == null || endLngLat == null) {
            return;
        }

        // Public transport is not included here as mapbox does not support it natively
        // TODO: add another api that calculates public transit time/ distance and display those data without directions due to TOS restrictions
        const newRoutes: Routes = {};
        const newDistances: NameValue = {};
        const newDuration: NameValue = {};

        await Promise.all(travelTypes.map((travelType) => 
            directionService.getDirections({
                profile: travelType,
                waypoints: [
                {
                    coordinates: [startLngLat.lng, startLngLat.lat],
                },
                {
                    coordinates: [endLngLat.lng, endLngLat.lat],
                }
                ],
                overview: "full",
            })
            .send()
            .then((response: any) => {
                const geoJsonFormat = toGeoJSON(response.body.routes[0].geometry);
                console.log(response.body);
                console.log(geoJsonFormat);
                
                newRoutes[travelType] = {    
                    type: "Feature",
                geometry: geoJsonFormat,
                properties: null};
                newDistances[travelType] = parseDistance(response.body.routes[0].distance);
                newDuration[travelType] = parseDuration(response.body.routes[0].duration);
            }))
        );
        
        setAvailableRoutes(newRoutes);
        setAvailableDistances(newDistances);
        setAvailableDuration(newDuration);
        console.log(newRoutes)
    }

    // Set the feature to be displayed in color
    useEffect(() => {
        const features: GeoJSON.Feature[] = [];
        travelTypes.forEach(travelType => {
            if (travelType !== activeTravelType) {
                features.push(availableRoutes[travelType]);
            }
        });

        setInactiveRoutes({
            type: "FeatureCollection",
            features: features
        });


        if (activeTravelType !== undefined) {
            setActiveRoute(availableRoutes[activeTravelType]);
            console.log(activeRoute)
        }
    }, [activeTravelType, availableRoutes]);

    // Set active distance and duration displayed
    useEffect(() => {
        setDisplayDistance(availableDistances[activeTravelType]);
        setDisplayDuration(availableDuration[activeTravelType]);
    }, [activeTravelType, availableDistances, availableDuration]);

    const placeMarker = (latLng: mapboxgl.LngLat | null, marker: MutableRefObject<mapboxgl.Marker | undefined>) => {
        if (marker.current !== undefined && latLng !== null) {
            marker.current.setLngLat(latLng);
            marker.current.addTo(mapboxMap!);
        }
    }

    const getFeatureFromCoordinates = (latLng: mapboxgl.LngLat | null) : Promise<MapboxGeocoder.Result> => {
        return geocodingClient.reverseGeocode({
            query: [latLng?.lng, latLng?.lat]
          })
            .send()
            .then((response: any) => {
                // GeoJSON document with geocoding matches
                if (response.body.features[0]) {
                    return response.body.features[0];
                } else {
                    return null;
                }
            });
    }

    const getPlaceName = (feature: MapboxGeocoder.Result, latLng: mapboxgl.LngLat) => {
        if (feature != undefined) {
            return feature.place_name;
        }
        return String(latLng?.lng + ', ' + latLng?.lat);
    }

    const setMarkers = async (lngLat: mapboxgl.LngLat) => {
        if (startRef.current !== null && markerSelector === 'startLocation') {
            const feature = await getFeatureFromCoordinates(lngLat);
            startRef.current.value = getPlaceName(feature, lngLat);
            setStartLngLat(lngLat);
            placeMarker(lngLat, startMarker);

            // startMarker?.setLngLat(e.lngLat);
        } else if (endRef.current !== null && markerSelector === 'endLocation') {
            const feature = await getFeatureFromCoordinates(lngLat);
            endRef.current.value = getPlaceName(feature, lngLat);
            setEndLngLat(lngLat);
            placeMarker(lngLat, endMarker);
        }
        setMarkerSelector('');
    }
    
    const mapClick = async (e: mapboxgl.MapLayerMouseEvent) => {
        if (markerSelector !== '') {
            await setMarkers(e.lngLat);
        } else if (e.features != undefined) {
            console.log(e.features)
        }
    }

    let [categories, setCategories] = useState({
        Fastest: [
          {
            id: 1,
            title: 'Driving',
            distance: '',
            duration: '',
            shareCount: 2,
          },
          {
            id: 2,
            title: 'Cycling',
            distance: '',
            duration: '',
            shareCount: 2,
          },
          {
            id: 3,
            title: 'Walking',
            distance: '',
            duration: '',
            shareCount: 2,
          },
        ],
        Popular: [
          {
            id: 1,
            title: 'Is tech making coffee better or worse?',
            distance: 'Jan 7',
            duration: 29,
            shareCount: 16,
          },
          {
            id: 2,
            title: 'The most innovative things happening in coffee',
            distance: 'Mar 19',
            duration: 24,
            shareCount: 12,
          },
        ],
        Trending: [
          {
            id: 1,
            title: 'Ask Me Anything: 10 answers to your questions about coffee',
            distance: '2d ago',
            duration: 9,
            shareCount: 5,
          },
          {
            id: 2,
            title: "The worst advice we've ever heard about coffee",
            distance: '4d ago',
            duration: 1,
            shareCount: 2,
          },
        ],
      })

    useEffect(() => {
        setCategories((prevState) => {
            const update = {
                ...prevState,
            };
            update.Fastest[0].distance = availableDistances['driving-traffic'];
            update.Fastest[1].distance = availableDistances['cycling'];
            update.Fastest[2].distance = availableDistances['walking'];

            update.Fastest[0].duration = availableDuration['driving-traffic'];
            update.Fastest[1].duration = availableDuration['cycling'];
            update.Fastest[2].duration = availableDuration['walking'];

            console.log(update);
            return update;
        })
    }, [availableDistances, availableDuration]);

    return (
    <div className="bg-gray-400 flex h-screen justify-center">
        <div className="w-full h-full z-0">
            <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css' rel='stylesheet' />

            <Map
                initialViewState={{
                    bounds: [lowerLng, lowerLat, upperLng, upperLat],
                    zoom: 14
                }}
                mapboxAccessToken={apiKey}
                renderWorldCopies={false}
                boxZoom={false}
                minZoom={8}
                logoPosition={'bottom-left'}
                attributionControl={false}
                pitchWithRotate={false}
                dragRotate={true}
                touchPitch={false}
                onClick={mapClick}
                ref={mapboxMapRef}
                reuseMaps={true}

                style={{display: "flex absolute"}}
                mapStyle="mapbox://styles/mapbox/dark-v10"
            >
                <Source id="inactive-route" type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={inactiveRoutes}>
                    <Layer {...inactiveRoutesLayer} />
                </Source>
                <Source id="active-route" type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={activeRoute}>
                    <Layer  {...activeRoutesLayer} />
                </Source>
            </Map>
        </div>
        <Transition
            appear={true}
            as={Fragment}
            show={isShowingTopMenu}
            enter="transform duration-200 transition ease-in-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0 scale-95 "
        >
            <Form className="z-1 flex-grow w-screen flex-col absolute px-2 shadow-lg text-xl bg-gray-200 sm:flex-row sm:w-auto sm:py-1 sm:px-3 sm:rounded-b-3xl">
                <div className="border-separate mb-1 sm:px-4 sm:flex sm:items-start sm:justify-between sm:space-x-1 md:mb-2">
                    <div className="md:mr-4">
                        <label className="flex flex-row text-gray-700 text-sm font-bold sm:mb-0.5" htmlFor="origin">
                            Origin
                            <Switch
                                checked={markerSelector === 'startLocation'}
                                onChange={() => markerSelector === 'startLocation' ? setMarkerSelector('') : setMarkerSelector('startLocation')} // toggle
                                className='ml-auto mr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`${markerSelector === 'startLocation' ? 'outline-double fill-slate-500' : ''} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Switch>
                            
                        </label>
                            <input autoComplete="street-address" className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Start Point" type="text" placeholder="Enter start point" ref={startRef}/>
                    </div>
                    <div className="">
                        <label className="flex flex-row text-gray-700 text-sm font-bold sm:mb-0.5" htmlFor="destination">
                            Destination
                            <Switch
                                checked={markerSelector === 'endLocation'}
                                onChange={() => markerSelector === 'endLocation' ? setMarkerSelector('') : setMarkerSelector('endLocation')} // toggle 
                                className='ml-auto mr-2'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`${markerSelector == 'endLocation' ? 'outline-double fill-slate-500' : ''} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Switch>
                        </label>
                            <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="End Point" 
                                type="text" 
                                placeholder="Enter end point" 
                                ref={endRef}
                            />
                    </div>
                </div>
                <div className="flex items-center justify-between sm:flex-row">
                    <span className="sm:ml-5">
                        {"distance: " + `${displayDistance !== '' ? displayDistance : ''}`}
                    </span>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline" 
                        type="button" 
                        onClick={calculateRoute}>
                        Calculate
                    </button>
                </div>
            </Form>
        </Transition>
        <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
            {Object.values(categories).map((posts, idx) => (
                <Tab.Panel
                key={idx}
                className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
                >
                <ul>
                    {posts.map((post) => (
                    <li
                        key={post.id}
                        className="relative rounded-md p-3 hover:bg-gray-100"
                    >
                        <h3 className="text-sm font-medium leading-5">
                        {post.title}
                        </h3>

                        <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                        <li>{post.distance}</li>
                        <li>&middot;</li>
                        <li>{post.duration}</li>
                        <li>&middot;</li>
                        {/* <li>{post.shareCount}</li> */}
                        </ul>

                        <a
                        href="#"
                        className={classNames(
                            'absolute inset-0 rounded-md',
                            'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                        )}
                        />
                    </li>
                    ))}
                </ul>
                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
    </div>
    </div>
    );
}