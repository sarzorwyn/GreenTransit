import { Autocomplete, DirectionsRenderer, GoogleMap, Marker, useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import { ActionFunction, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

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
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    
    const center = { lat: 1.295972, lng: 103.851986 }

    let bounds: google.maps.LatLngBounds | undefined;
    useEffect(() => {
        if (map !== undefined) {
            bounds = map.getBounds();
            console.log(bounds)
        }
    }, [map])
    

    const calcBounds = () => {
        if (map === undefined) {
            return;
        }
        const timer = setTimeout(() => {bounds = map.getBounds();
            }, 3000)
        return () => clearTimeout(timer)
    }

    const calculateRoute = async () => {
        if (startRef.current === null || startRef.current.value === '' || endRef.current === null || endRef.current.value === '') {
            console.log('test')
            return;
        }
        console.log('ok')
        // clearRoute();
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
            origin: startRef.current.value,
            destination: endRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance!.text);
        setDuration(results.routes[0].legs[0].duration!.text);
    }

    const clearRoute = () => {
        setDirectionsResponse(undefined);
        setDistance('');
        setDuration('');
        // startRef.current!.value = '';
        // endRef.current!.value = '';
    }
    

    if (!isLoaded ) {
        return <div/>;
    }

    return (
    <div className="bg-gray-400 flex h-screen justify-center">
        <div className="w-full h-full z-0">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{ width: '100%', height: '100%', zIndex: 0}}
                options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                }}
                onLoad={m => setMap(m)}
                onBoundsChanged={calcBounds}
            >
                {(directionsResponse &&
                    <DirectionsRenderer directions={directionsResponse} />
                )}
            </GoogleMap>
        </div>
        <Form className="z-1 flex-grow w-screen flex-col absolute py-1 px-2 shadow-lg text-xl bg-gray-200 sm:flex-row sm:w-auto sm:px-3 sm:rounded-b-3xl">
            <div className="border-separate md:py-1 md:px-8 md:flex md:items-start md:justify-between md:space-x-1">
                <div className="mb-4 md:mr-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
                        Origin
                    </label>
                    <Autocomplete bounds={bounds}>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Start Point" type="text" placeholder="Start Point" ref={startRef}/>
                    </Autocomplete>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                        Destination
                    </label>
                    <Autocomplete bounds={bounds}>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="End Point" type="text" placeholder="End Point" ref={endRef}/>
                    </Autocomplete>
                </div>
            </div>
            <div className="flex items-center justify-between sm:flex-row">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mr-auto rounded focus:outline-none focus:shadow-outline" type="button" onClick={calculateRoute}>
                    Calculate
                </button>
            </div>
        </Form>
    </div>
    );
}