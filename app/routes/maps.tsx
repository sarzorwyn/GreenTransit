import { Switch } from "@headlessui/react";
import Map, {AttributionControl} from 'react-map-gl';
import { ActionFunction, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

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
    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: apiKey,
    //     libraries: libraries,
    // });
    const [mapSelector, setMapSelector] = useState<string>('');
    // const [routePolyline, setRoutePolyline] = useState<google.maps.PolylineOptions>();
    const [center, setCenter] = useState({ lat: 1.361534, lng: 103.815990 });
    // const [searchParams, setSearchParams] = useSearchParams();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(103.815990);
    const [lat, setLat] = useState(1.361534);
    const lowerLat = 1.2;
    const upperLat = 1.48;
    const lowerLng = 103.59;
    const upperLng = 104.05;
    const [zoom, setZoom] = useState(9);

    const distance = useRef<string>('');
    const duration = useRef(0);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    // const startMarker = useRef<Marker>();
    // const directionService = useRef<google.maps.DirectionsService>();

    // const restrictions:google.maps.places.ComponentRestrictions | undefined = {country:'sg'}; // I can't afford a worldwide search for the api :(

    // const calculateRoute = async () => {
    //     if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '') {
    //         return;
    //     }
    //     if (directionService.current === undefined) {
    //         directionService.current = new google.maps.DirectionsService();
    //     }
    //     console.log(map?.getBounds());

    //     const results = await directionService.current.route({
    //         origin: startRef.current.value,
    //         destination: endRef.current.value,
    //         travelMode: google.maps.TravelMode.TRANSIT,

    //     }, (response, status) => {
    //         if (status === 'OK' && response !== null) {
    //             if (routePolyline) {
    //                 // if we have an existing routePolyline we unset it
    //                 setRoutePolyline(undefined);
    //             }
    //             setRoutePolyline({
    //                 path: response.routes[0].overview_path,
    //                 strokeColor: 'purple',
    //                 strokeOpacity: 1.0,
    //                 strokeWeight: 5,
    //                 map: map,
    //             });
    //             let bounds = new google.maps.LatLngBounds();
    //             response.routes[0].overview_path.forEach((latLng) => bounds.extend(latLng));
    //             // center = { lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng()};
    //             map!.setCenter(bounds.getCenter());
    //             map!.fitBounds(bounds, 5);
    //         }
    //     });

    //     distance.current = results.routes[0].legs[0].distance!.text;
    //     // setDuration(results.routes[0].legs[0].duration!.text);
    // }

    // const getNameFromCoordinates = (latLng: google.maps.LatLng | null) : Promise<string> => {
    //     return geocoder.geocode({ location: latLng }).then((response) => {
    //         if (response.results[0]) {
    //             return response.results[0].formatted_address;
    //         } else {
    //             return String(latLng);
    //         } 
    //     }).catch(() => String(latLng));
    // }
    
    // const dropMarker = async (e: google.maps.MapMouseEvent) => {
    //     if (startRef.current !== null && mapSelector === 'startLocation') {
    //         startRef.current.value = await getNameFromCoordinates(e.latLng);
    //     } else if (endRef.current !== null && mapSelector === 'endLocation') {
    //         endRef.current.value = await getNameFromCoordinates(e.latLng);
    //     } 
    //     setMapSelector('');
    // }

    useEffect(() => {
        if (startRef.current !== null) {

        }
    }, [startRef])

    // if (!isLoaded ) {
    //     return <div/>;
    // }

    // const geocoder = new google.maps.Geocoder();
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
                // fitBoundsOptions={
                //   padding: BREAKPOINT()
                //     ? 120
                //     : { top: 40, bottom: window.innerHeight / 2, left: 40, right: 40 },
                // }

                style={{display: "flex absolute"}}
                mapStyle="mapbox://styles/mapbox/dark-v10"
            >
                <AttributionControl compact={true} position={"top-left"} style={{display: "absolute"}}/>
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
                    
                        <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Start Point" type="text" placeholder="Enter start point" ref={startRef}/>
                    
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
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Calculate
                </button>
            </div>
        </Form>
    </div>
    );
}