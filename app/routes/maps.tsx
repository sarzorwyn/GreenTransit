import { Autocomplete, DirectionsRenderer, DirectionsService, GoogleMap, Marker, Polyline, useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import { ActionFunction, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { string } from "zod";

export async function loader({ request }: LoaderArgs) {
    return process.env.GOOGLEMAPS_API_KEY;
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
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: libraries,
    });
    const [map, setMap] = useState<google.maps.Map>();
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
    // const [searchParams, setSearchParams] = useSearchParams();
    const [routePolyline, setRoutePolyline] = useState<google.maps.PolylineOptions>();

    const distance = useRef(0);
    const duration = useRef(0);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    const userMarker = useRef<google.maps.Marker>();

    const directionService = useRef<google.maps.DirectionsService>();
    
    const center = { lat: 1.361534, lng: 103.815990 }

    const restrictions:google.maps.places.ComponentRestrictions | undefined = {country:'sg'}; // I can't afford a worldwide search for the api :(

    const calculateRoute = async () => {
        if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '') {
            return;
        }
        if (directionService.current === undefined) {
            directionService.current = new google.maps.DirectionsService();
        }


        const results = await directionService.current.route({
            origin: startRef.current.value,
            destination: endRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,

        }, (response, status) => {
            if (status === 'OK' && response !== null) {
                setDirectionsResponse(response);
                if (routePolyline) {
                    // if we have an existing routePolyline we unset it
                    setRoutePolyline(undefined);
                }
                setRoutePolyline({
                    path: response!.routes[0].overview_path,
                    strokeColor: 'purple',
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                    map: map,
                });
            }
        });
        
        // setDirectionsResponse(results);
        // setDistance(results.routes[0].legs[0].distance!.text);
        // setDuration(results.routes[0].legs[0].duration!.text);
    }

    const getNameFromCoordinates = (latLng: google.maps.LatLng | null) : Promise<string> => {
        return geocoder.geocode({ location: latLng }).then((response) => {
            if (response.results[0]) {
                return response.results[0].formatted_address;
            } else {
                return String(latLng);
            } 
        }).catch(() => String(latLng));
    }
    
    const dropMarker = async (e: google.maps.MapMouseEvent) => {
        if (startRef.current !== null && startRef.current.value === '') {
            startRef.current.value = await getNameFromCoordinates(e.latLng);
        } else if (endRef.current !== null && endRef.current.value === '') {
            endRef.current.value = await getNameFromCoordinates(e.latLng);
        } else {
            if (userMarker.current === undefined) {
                userMarker.current = new google.maps.Marker({
                    position: e.latLng,
                    map: map,
                    label: 'A'
                });
            }
            userMarker.current.setPosition(e.latLng);
        }
    }

    if (!isLoaded ) {
        return <div/>;
    }

    // geocoder needs to be init after map is loaded
    const geocoder = new google.maps.Geocoder();
//polylineOptions={routePolyline}
    return (
    <div className="bg-gray-400 flex h-screen justify-center">
        <div className="w-full h-full z-0">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{ width: '100%', height: '100%', zIndex: 0}}
                options={{
                clickableIcons: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
                }}
                onLoad={m => setMap(m)}
                onClick={e => dropMarker(e)}
            >
                {/* {(directionsResponse &&
                    <DirectionsRenderer directions={directionsResponse} options={{polylineOptions: routePolyline }} onDirectionsChanged={()=>console.log(re)} ref={re}/>
                )} */}
                <Polyline options={routePolyline }></Polyline>
            </GoogleMap>
        </div>
        <Form className="z-1 flex-grow w-screen flex-col absolute px-2 shadow-lg text-xl bg-gray-200 sm:flex-row sm:w-auto sm:py-1 sm:px-3 sm:rounded-b-3xl">
            <div className="border-separate mb-1 sm:px-4 sm:flex sm:items-start sm:justify-between sm:space-x-1 md:mb-2">
                <div className="md:mr-4">
                    <label className="block text-gray-700 text-sm font-bold sm:mb-0.5" htmlFor="origin">
                        Origin
                    </label>
                    <Autocomplete restrictions={restrictions}>
                        <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Start Point" type="text" placeholder="Enter start point" ref={startRef}/>
                    </Autocomplete>
                </div>
                <div className="">
                    <label className="block text-gray-700 text-sm font-bold sm:mb-0.5" htmlFor="destination">
                        Destination
                    </label>
                    <Autocomplete restrictions={restrictions}>
                        <input className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="End Point" type="text" placeholder="Enter end point" ref={endRef}/>
                    </Autocomplete>
                </div>
            </div>
            <div className="flex items-center justify-between sm:flex-row">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mb-2 ml-auto sm:mr-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={calculateRoute}>
                    Calculate
                </button>
            </div>
        </Form>
    </div>
    );
}