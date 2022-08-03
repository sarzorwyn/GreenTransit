import { Autocomplete, DirectionsRenderer, GoogleMap, Marker, useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import { ActionFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export async function loader({ request }: LoaderArgs) {
    return process.env.GOOGLEMAPS_API_KEY;
}

declare type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
export const libraries:Libraries = ['places']

export default function Maps() {
    
    const apiKey = useLoaderData();
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: libraries,
    });
    const [map, setMap] = useState<google.maps.Map>();
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult>();
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const center = { lat: 1.295972, lng: 103.851986 }

    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);
    let bounds : google.maps.LatLngBounds | undefined;
    const calcBounds = () => {
        if (map === undefined) {
            return;
        }
        const bound = map.getBounds();
        console.log(bound)
        const ne = bound!.getNorthEast(); // LatLng of the north-east corner
        const sw = bound!.getSouthWest(); // LatLng of the south-west corder
        bounds = bound;
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
    

    if (!isLoaded) {
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
                {(
                    <DirectionsRenderer directions={directionsResponse} />
                )}
            </GoogleMap>
        </div>
        {/* <div className="z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between absolute rounded-3xl shadow-lg text-2xl bg-blue-100">
            <div className="relative z-0 mb-6 w-full group">
                <Autocomplete>
                    <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                </Autocomplete>
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
            </div>
            
                <Autocomplete>
                    <input name="start" placeholder="Choose starting point" id="start" ref={startRef} className=" mx-10"/>
                </Autocomplete>
                <Autocomplete>
                    <input name="end" placeholder="Choose end point" id="end" ref={endRef} />
                </Autocomplete>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                <span>Distance: {distance}</span>
            
        </div> */}
        <form className="z-1 max-w-7xl mx-auto py-3 px-4 sm:px-6  absolute rounded-3xl shadow-lg text-xl bg-blue-100">
            <div className="lg:py-15 lg:px-8 lg:flex lg:items-start lg:justify-between lg:space-x-1">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Origin
                    </label>
                    <Autocomplete bounds={bounds}>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="Start Point" type="text" placeholder="Start Point" ref={startRef}/>
                    </Autocomplete>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Destination
                    </label>
                    <Autocomplete>
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="End Point" type="text" placeholder="End Point" ref={endRef}/>
                    </Autocomplete>
                </div>
            </div>
            <div className="flex items-center justify-between pt-12">
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                    Forgot Password?
                </a>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 mr-auto rounded focus:outline-none focus:shadow-outline" type="button" onClick={calculateRoute}>
                    Calculate
                </button>
            </div>
        </form>
    </div>
    );
}