import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export async function loader({ request }: LoaderArgs) {
    return process.env.GOOGLEMAPS_API_KEY
}

export default function Maps() {
    
    const apiKey = useLoaderData();
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: ['places']
    })
    const [map, setMap] = useState<google.maps.Map>();
    const center = { lat: 48.8584, lng: 2.2945 }

    if (!isLoaded) {
        return <div/>;
    }

    if (loadError) {
        return <span>Error accessing Google Maps API!</span>
    }

    return (
    <div className="bg-gray-50 flex h-screen">
        <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            }}
            onLoad={m => setMap(m)}
        />
        {/* <div className=" align-top  absolute">
            test
        </div> */}
    </div>
    );
}