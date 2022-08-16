import { Switch } from "@headlessui/react";
import Map, { Layer, MapRef, Source } from 'react-map-gl';
import { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toGeoJSON } from '@mapbox/polyline';
import mapboxgl from "mapbox-gl";

export async function loader({ request }: LoaderArgs) {
    return process.env.MAPBOX_API_KEY;
}

declare type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
export const libraries:Libraries = ['places']


/**
 * The main map function with overlays.
 * TODO: All routes using different transportation options will be calculated and toggled when the user chooses them.
 * TODO: Make the url metadata change when a route is calculated so that the user can share/revisit the output
 * @returns the map and overlays
 */
export default function Maps() {
    const apiKey = useLoaderData();

    const MapboxGeocoderSDK = require('@mapbox/mapbox-sdk/services/geocoding')
    const MapboxDirectionsModule = require('@mapbox/mapbox-sdk/services/directions');
    const directionService = new MapboxDirectionsModule({
        accessToken: apiKey,
        unit: 'metric',
        profile: 'mapbox/driving',
        alternatives: false,
        geometries: 'geojson',
        controls: { instructions: false },
        flyTo: true
    })
    const geocodingClient = new MapboxGeocoderSDK({
        accessToken: apiKey
    })

    const [mapSelector, setMapSelector] = useState<string>('');
    // const [carDirections, setCarDirections] = useState<Route>();
    // const [routePolyline, setRoutePolyline] = useState<google.maps.PolylineOptions>();

    const lowerLat = 1.2;
    const upperLat = 1.48;
    const lowerLng = 103.59;
    const upperLng = 104.05;

    const mapboxMapRef = useRef<MapRef>(null);
    const [mapboxMap, setMapboxMap] = useState<mapboxgl.Map>();

    const startMarker = useRef<mapboxgl.Marker>();
    const endMarker = useRef<mapboxgl.Marker>();

    useEffect(() => {
        if (mapboxMapRef != undefined && mapboxMapRef.current != null) {
            setMapboxMap(mapboxMapRef.current.getMap())

            startMarker.current = new mapboxgl.Marker({color: "#20ba44"})
            endMarker.current = new mapboxgl.Marker({color: "#972FFE"})
        }
    }, [mapboxMapRef.current])

    const distance = useRef<string>('');
    const duration = useRef(0);

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const [startLngLat, setStartLngLat] = useState<mapboxgl.LngLat>();
    const [endLngLat, setEndLngLat] = useState<mapboxgl.LngLat>();



    const [displayRoute, setDisplayRoute] = useState<GeoJSON.Feature>({
        type: "Feature",
        geometry: {
            type: 'LineString',
            coordinates: [],
        },
        properties: null
    });

    const routesLayer: mapboxgl.LineLayer = {
        id: 'routes',
        type: 'line',
        source: 'routes-path',
        layout: {
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#f01b48',
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#20ba44',
            0.5,
            '#972FFE',
            1,
            '#f01b48',
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
            2,
            16,
            5,
            22,
            10,
          ],
        },
      }

    const calculateRoute = async () => {
        if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '' || startLngLat == null || endLngLat == null) {
            return;
        }

        const results = await directionService.getDirections({
            profile: 'driving-traffic',
            waypoints: [
              {
                coordinates: [startLngLat.lng, startLngLat.lat],
              },
              {
                coordinates: [endLngLat.lng, endLngLat.lat],
              }
            ]
          })
            .send()
            .then(response => {
                const directions = response.body;
                const geoJsonFormat = toGeoJSON(directions.routes[0].geometry);
                
                console.log(geoJsonFormat);

                setDisplayRoute({    
                    type: "Feature",
                geometry: geoJsonFormat,
                properties: null});

                console.log(mapboxMap?.getSource('routes'));
                console.log(mapboxMap?.getLayer('routes'));
                // mapboxMap?.getMap().getSource('routes').setData({
                //     type: 'FeatureCollection',
                //     features: geoJsonFormat.map((geometry) => ({
                //       type: 'Feature',
                //       properties: {},
                //       geometry,
                //     })),
                //   });
            });

        // distance.current = results.routes[0].legs[0].distance!.text;
        // setDuration(results.routes[0].legs[0].duration!.text);
    }

    const placeMarker = (latLng: mapboxgl.LngLat | null, marker: MutableRefObject<mapboxgl.Marker | undefined>) => {
        if (marker.current === undefined) {
            marker.current = new mapboxgl.Marker();
        }

        if (latLng !== null) {
            marker.current.setLngLat(latLng);
            marker.current.addTo(mapboxMap!);
        }
        console.log(marker.current)
    }

    const getFeatureFromCoordinates = (latLng: mapboxgl.LngLat | null) : Promise<MapboxGeocoder.Result> => {
        return geocodingClient.reverseGeocode({
            query: [latLng?.lng, latLng?.lat]
          })
            .send()
            .then((response) => {
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
    
    const mapClick = async (e: mapboxgl.MapLayerMouseEvent) => {
        if (startRef.current !== null && mapSelector === 'startLocation') {      
            const feature = await getFeatureFromCoordinates(e.lngLat);
            startRef.current.value = getPlaceName(feature, e.lngLat);
            setStartLngLat(e.lngLat);
            placeMarker(e.lngLat, startMarker);

            // startMarker?.setLngLat(e.lngLat);
        } else if (endRef.current !== null && mapSelector === 'endLocation') {
            const feature = await getFeatureFromCoordinates(e.lngLat);
            endRef.current.value = getPlaceName(feature, e.lngLat);
            setEndLngLat(e.lngLat);
            placeMarker(e.lngLat, endMarker);
        } 
        setMapSelector('');
    }

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
                // fitBoundsOptions={
                //   padding: BREAKPOINT()
                //     ? 120
                //     : { top: 40, bottom: window.innerHeight / 2, left: 40, right: 40 },
                // }

                style={{display: "flex absolute"}}
                mapStyle="mapbox://styles/mapbox/dark-v10"
            >
                <Source id="routes" type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={displayRoute}>
                    <Layer {...routesLayer} />
                </Source>
            </Map>
        </div>
        <Form className="z-1 flex-grow w-screen flex-col absolute px-2 shadow-lg text-xl bg-gray-200 sm:flex-row sm:w-auto sm:py-1 sm:px-3 sm:rounded-b-3xl">
            <div className="border-separate mb-1 sm:px-4 sm:flex sm:items-start sm:justify-between sm:space-x-1 md:mb-2">
                <div className="md:mr-4">
                    <label className="flex flex-row text-gray-700 text-sm font-bold sm:mb-0.5" htmlFor="origin">
                        Origin
                        <Switch
                            checked={mapSelector === 'startLocation'}
                            onChange={() => mapSelector === 'startLocation' ? setMapSelector('') : setMapSelector('startLocation')} // toggle
                            className='ml-auto mr-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`${mapSelector === 'startLocation' ? 'outline-double fill-slate-500' : ''} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
                            checked={mapSelector === 'endLocation'}
                            onChange={() => mapSelector === 'endLocation' ? setMapSelector('') : setMapSelector('endLocation')} // toggle 
                            className='ml-auto mr-2'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`${mapSelector == 'endLocation' ? 'outline-double fill-slate-500' : ''} h-5 w-5 outline-1 outline-black hover:outline-double hover:fill-slate-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Switch>
                    </label>
                        <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="End Point" type="text" placeholder="Enter end point" ref={endRef}/>
                </div>
            </div>
            <div className="flex items-center justify-between sm:flex-row">
                <span className="sm:ml-5">
                    {"distance: " + `${distance.current !== '' ? distance.current : ''}`}
                </span>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={calculateRoute}>
                    Calculate
                </button>
            </div>
        </Form>
    </div>
    );
}