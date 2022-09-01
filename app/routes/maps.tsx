import { Combobox, Switch, Transition } from "@headlessui/react";
import Map, { Layer, MapRef, Source } from 'react-map-gl';
import { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { toGeoJSON } from '@mapbox/polyline';
import mapboxgl from "mapbox-gl";
import { StatsData } from "~/types/StatsData";
import { NameValue } from "~/types/NameValue";
import StatsWindow from "~/components/stats-window";
import { TransitTypes } from "~/types/TransitTypes";
import { useLoadScript } from "@react-google-maps/api";
import CurvedPolyline from "~/components/curved-polyline";
import { layerMap } from "~/layers/LayerMap";
import { MapiResponse } from "@mapbox/mapbox-sdk/lib/classes/mapi-response";
import { GeocodeService } from "@mapbox/mapbox-sdk/services/geocoding";
import { DirectionsService } from "@mapbox/mapbox-sdk/services/directions";

export async function loader({ request }: LoaderArgs) {
    return [process.env.MAPBOX_API_KEY, process.env.MAPS_API_KEY];
}

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css', as:"fetch"}];
};


type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
export const libraries:Libraries = ['places']

type Routes = {
    [index: string]: GeoJSON.Feature,
}

type CarbonMultipliers = {
    'driving-traffic': number,
    'cycling': number,
    'walking': number,
    'public-transport': number,
    'bus': number,
    'train': number,
}

/**
 * The main map function with overlays.
 * TODO: All routes using different transportation options will be calculated and toggled when the user chooses them.
 * TODO: Make the url metadata change when a route is calculated so that the user can share/revisit the output
 * @returns the map and overlays
 */
export default function Maps() {
    let [isShowingTopMenu, setIsShowingTopMenu] = useState(true);

    const [originQuery, setQuery] = useState('');
    const [originInput, setOriginInput] = useState('');


    const apiKey = useLoaderData();

    const MapboxGeocoderSDK = require('@mapbox/mapbox-sdk/services/geocoding')
    const MapboxDirectionsModule = require('@mapbox/mapbox-sdk/services/directions');
    const directionService: DirectionsService = new MapboxDirectionsModule({
        accessToken: apiKey[0],
        unit: 'metric',
        alternatives: false,
        geometries: 'geojson',
        controls: { instructions: false },
        flyTo: true,
    });
    const geocodingClient: GeocodeService = new MapboxGeocoderSDK({
        accessToken: apiKey[0],
    });

    const travelTypes: TransitTypes[] = ['driving-traffic', 'walking', 'cycling'];
    const carbonMultipliers: CarbonMultipliers = {
        'driving-traffic': 271, // whole car (to check again)
        'cycling': 5, // manufacturing emissions
        'walking': 0.0005, // manufacturing shoes + disposal 0.3kgCO2, 600km lifespan
        'public-transport': 118, // Fall back if unidentified 
        'bus': 73, // per pax https://www.eco-business.com/news/singapores-mrt-lines-be-graded-green-ness/
        'train': 13.2,
    }
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
            setMapboxMap(mapboxMapRef.current.getMap());

            startMarker.current = new mapboxgl.Marker({color: "#20ba44"});
            endMarker.current = new mapboxgl.Marker({color: "#972FFE"});
        }
    }, [mapboxMapRef.current?.loaded]);

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const [startLngLat, setStartLngLat] = useState<mapboxgl.LngLat>();
    const [endLngLat, setEndLngLat] = useState<mapboxgl.LngLat>();

    const noFeature: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: null
    }

    const [activeTravelType, setActiveTravelType] = useState<string>('driving-traffic');
    const [availableRoutes, setAvailableRoutes] = useState<Routes>({
        'driving-traffic': noFeature,
        'cycling': noFeature,
        'walking': noFeature,
        'public-transport': noFeature,
    });
    
    const [activeRoute, setActiveRoute] = useState<GeoJSON.Feature>();
    const [inactiveRoutes , setInactiveRoutes] = useState<Routes>(availableRoutes);
    const [routesDistances, setRoutesDistances] = useState<NameValue>({
        'driving-traffic': 0,
        'cycling': 0,
        'walking': 0,
        'public-transport': 0,
    });
    const [routesDuration, setRoutesDuration] = useState<NameValue>({
        'driving-traffic': 0,
        'cycling': 0,
        'walking': 0,
        'public-transport': 0,
    });
    const [routesCarbon, setRoutesCarbon] = useState<NameValue>({
        'driving-traffic': 0,
        'cycling': 0,
        'walking': 0,
        'public-transport': 0,
    });

    
    const [sidebarData, setSidebarData] = useState<StatsData[]>([
        {
            id: 1,
            title: 'Driving',
            type: 'driving-traffic',
            distanceMeters: 0,
            durationSeconds: 0,
            carbonGrams: 0,
        },
        {
            id: 2,
            title: 'Cycling',
            type: 'cycling',
            distanceMeters: 0,
            durationSeconds: 0,
            carbonGrams: 0,
        },
        {
            id: 3,
            title: 'Walking',
            type: 'walking',
            distanceMeters: 0,
            durationSeconds: 0,
            carbonGrams: 0,
        },
        {
            id: 4,
            title: 'Public Transit',
            type: 'public-transport',
            distanceMeters: 0,
            durationSeconds: 0,
            carbonGrams: 0,
        }
    ]);

    const [originSuggestions, setOriginSuggestions] = useState<string[]>(['']);

    useEffect(() => {
        setSidebarData((prevState: StatsData[]): StatsData[] => { 
            const update: StatsData[] = [
                ...prevState,
            ];

            const sortedDistance = Object.keys(routesDistances).sort((a, b) => {
                return routesDistances[a] - routesDistances[b];
            });

            const sortedDuration = Object.keys(routesDuration).sort((a, b) => {
                return routesDuration[a] - routesDuration[b];
            });

            const sortedCarbon = Object.keys(routesCarbon).sort((a, b) => {
                return routesCarbon[a] - routesCarbon[b];
            });

            update.map((value) => {
                value.distanceMeters = routesDistances[value.type];
                value.durationSeconds = routesDuration[value.type];
                value.carbonGrams = routesCarbon[value.type];
                value.distanceRank = sortedDistance.indexOf(value.type);
                value.durationRank = sortedDuration.indexOf(value.type);
                value.carbonRank = sortedCarbon.indexOf(value.type);
            })
            return update;
        })
    }, [routesDistances, routesDuration]);

    // Set the feature to be displayed in color
    useEffect(() => {
        let features: Routes = {};
        travelTypes.forEach(travelType => {
            if (travelType !== activeTravelType) {
                features[travelType] = availableRoutes[travelType];
            }
        });

        setInactiveRoutes(features);


        if (activeTravelType !== undefined) {
            setActiveRoute(availableRoutes[activeTravelType]);
        }
    }, [activeTravelType, availableRoutes]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey[1],
        libraries: libraries,
    });

    
    useEffect(() => {
        if (originQuery === '') {
            setOriginSuggestions(['a']);
        } else {
            const asyncCallback = async () => {
                setOriginSuggestions(await geocode(originQuery));
            }
            asyncCallback();
        }
    },[originQuery]);


    // All hooks have to be before the Load check
    if (!isLoaded ) {
        return <div/>;
    }

    const transitService = new google.maps.DirectionsService();

    const calculateRoute = async () => {
        if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '' || startLngLat == null || endLngLat == null) {
            return;
        }

        const newRoutes: Routes = {};
        const newDistances: NameValue = {};
        const newDuration: NameValue = {};
        const newCarbon: NameValue = {};

        await Promise.all(travelTypes.map((travelType: TransitTypes) => {
            if (travelType === 'public-transport') return;

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
                // @ts-ignore: ferry should be always avoided as it is out of scope
                exclude: "ferry"
            })
            .send()
            .then((response: MapiResponse) => {
                const geometry = toGeoJSON(response.body.routes[0].geometry);
                
                newRoutes[travelType] = {    
                    type: "Feature",
                    geometry: geometry,
                    properties: null
                };
                newDistances[travelType] = response.body.routes[0].distance;
                newDuration[travelType] = response.body.routes[0].duration;
                newCarbon[travelType] = (response.body.routes[0].distance  / 1000) * carbonMultipliers[travelType]; // TODO: refine the carbon calculation
            }).catch(() => {
                newRoutes[travelType] = noFeature;

                newDistances[travelType] = 0;
                newDuration[travelType] = 0;
                newCarbon[travelType] = 0;
            })})
        );

        await transitService.route({
            origin: startLngLat.lat + ', ' + startLngLat.lng,
            destination: endLngLat.lat + ', ' + endLngLat.lng,
            travelMode: google.maps.TravelMode.TRANSIT,
            avoidFerries: true
        }).then((response: any) => {

            // Separate train, bus and walking distances for CO2 calc
            let trainDist = 0;
            let busDist = 0;
            let walkDist = 0;
            let miscDist = 0;

            response.routes[0].legs[0].steps.map((step: any) => {
                if (step.travel_mode === "WALKING") {
                    walkDist += step.distance.value;
                } else if (step.travel_mode === "TRANSIT" && step.transit.line.vehicle.type === "SUBWAY") {
                    trainDist += step.distance.value;
                } else if (step.travel_mode === "TRANSIT" && step.transit.line.vehicle.type === "BUS") {
                    busDist += step.distance.value;
                } else {
                    miscDist += step.distance.value;
                }
            })
            newRoutes['public-transport'] = CurvedPolyline(startLngLat, endLngLat);

            const totalCarbon = walkDist * carbonMultipliers['walking'] + trainDist * carbonMultipliers['train'] + busDist * carbonMultipliers['bus'] + miscDist * carbonMultipliers['public-transport'];
            
            newDistances['public-transport'] = response.routes[0].legs[0].distance.value;
            newDuration['public-transport'] = response.routes[0].legs[0].duration.value;
            newCarbon['public-transport'] = (totalCarbon  / 1000); // Divide by 1000 because distance used was meters but multiplier is per km. 
        }).catch(() => {
            newRoutes['public-transport'] = noFeature;

            newDistances['public-transport'] = 0;
            newDuration['public-transport'] = 0;
            newCarbon['public-transport'] = 0;
        });


        setAvailableRoutes(newRoutes);
        setRoutesDistances(newDistances);
        setRoutesDuration(newDuration);
        setRoutesCarbon(newCarbon);
    }

    const geocode = async (query: string): Promise<string[]> => {
        return await geocodingClient.forwardGeocode({
            query: query,
            proximity: mapboxMap != undefined ? [mapboxMap.getCenter().lat, mapboxMap.getCenter().lng] : undefined
        })
            .send()
            .then((response: MapiResponse) => {
                console.log(response)

                return response.body.features.flatMap((feature: any): string[] => {
                    return feature.matching_place_name;
                })
            }).catch(() => {
                return [];
            });
    }


    const placeMarker = (latLng: mapboxgl.LngLat | null, marker: MutableRefObject<mapboxgl.Marker | undefined>) => {
        if (marker.current !== undefined && latLng !== null) {
            marker.current.setLngLat(latLng);
            marker.current.addTo(mapboxMap!);
        }
    }

    const getFeatureFromCoordinates = (latLng: mapboxgl.LngLat | null) : Promise<MapboxGeocoder.Result> => {
        return geocodingClient.reverseGeocode({
            query: [latLng!.lng, latLng!.lat]
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

    return (
        <div className="bg-gray-400 flex h-screen justify-center">
            <div className="w-full h-full z-0">

                <Map
                    initialViewState={{
                        bounds: [lowerLng, lowerLat, upperLng, upperLat],
                        zoom: 14
                    }}
                    mapboxAccessToken={apiKey[0]}
                    renderWorldCopies={false}
                    boxZoom={false}
                    // minZoom={8}
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
                    {/* TODO: reorder source elements to show active one on top always */}
                    <Source id='driving-traffic' type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={availableRoutes['driving-traffic']}>
                        <Layer {...(activeTravelType === 'driving-traffic' ? layerMap['driving-traffic'].activeLayer : layerMap['driving-traffic'].inactiveLayer)}/>
                    </Source>
                    <Source id='cycling' type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={availableRoutes['cycling']}>
                        <Layer {...(activeTravelType === 'cycling' ? layerMap['cycling'].activeLayer : layerMap['cycling'].inactiveLayer)}/>
                    </Source>
                    <Source id='walking' type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={availableRoutes['walking']}>
                        <Layer {...(activeTravelType === 'walking' ? layerMap['walking'].activeLayer : layerMap['walking'].inactiveLayer)}/>
                    </Source>
                    <Source id='public-transport' type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={availableRoutes['public-transport']}>
                        <Layer {...(activeTravelType === 'public-transport' ? layerMap['public-transport'].activeLayer : layerMap['public-transport'].inactiveLayer)}/>
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
                <Form className="z-1 flex-grow w-screen flex-col absolute px-2 shadow-lg text-xl bg-gray-200 sm:w-auto sm:py-1 sm:px-3 sm:rounded-b-3xl sm:left-1 md:flex-row md:left-5 lg:left-1/4 xl:left-auto">
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
                            <Combobox value={originInput} onChange={setOriginInput}>
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input 
                                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                                onChange={(event) => setQuery(event.target.value)} />
                            <Combobox.Options>
                            {originSuggestions.map((place) => (
                            <Combobox.Option 
                                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-600 bg-slate-700 leading-tight focus:outline-none focus:shadow-outline"   
                                key={place} 
                                value={place}>
                            {place}
                            </Combobox.Option>
                            ))}
                            </Combobox.Options>
                            </div>
                            </Combobox>
                                {/* <input autoComplete="street-address" 
                                    className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="Start Point" 
                                    type="text" 
                                    placeholder="Enter start point" 
                                    ref={startRef}
                                    // TODO: add dropdown menu here
                                /> */}
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
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline" 
                            type="button" 
                            onClick={calculateRoute}>
                            Calculate
                        </button>
                    </div>
                </Form>
            </Transition>
            <div>
                <div id="desktop-sidebar" className="absolute z-10 right-1 top-28 hidden sm:block w-auto px-2 sm:px-0">
                    <StatsWindow sidebarData={sidebarData} activeTravelType={activeTravelType} setActiveTravelType={setActiveTravelType}/> 
                </div>

                {/* <div id="mobile-sidebar" className="md:hidden w-auto max-w-md px-2 py-16 sm:px-0">
                    <StatsWindow sidebarData={sidebarData}/> 
                </div> */}
            </div>
        </div>
    );
}
