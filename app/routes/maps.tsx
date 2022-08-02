import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { ActionFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { makeDomainFunction } from "remix-domains";
import { Form, formAction } from "remix-forms";
import { Schema, z } from "zod";

const schema = z.object({
    start: z.string().min(1),
    end: z.string().min(1),
})

const mutation = makeDomainFunction(schema)(async (values) => values );

export const action: ActionFunction = async ({ request }) =>
    formAction({
        request,
        schema,
        mutation,
        successPath: '/maps#'
    })

export async function loader({ request }: LoaderArgs) {
    return process.env.GOOGLEMAPS_API_KEY;
}

export default function Maps() {
    
    const apiKey = useLoaderData();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: ['places']
    })
    const [map, setMap] = useState<google.maps.Map>();
    const center = { lat: 1.295972, lng: 103.851986 } 

    if (!isLoaded) {
        return <div/>;
    }

    return (
    <div className="bg-gray-400 flex h-screen justify-center">
        <div className="z-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between absolute rounded-3xl shadow-lg text-2xl bg-blue-100">
            <div className=" box-border"></div>
            <Form schema={schema}> 
                {({ Field, Errors, Button}) => (
                    <>
                    <Field name="start" label="First name" id="floating_email" />
                    <Field name="end" label="E-mail" />
                    <em>a</em>
                    <Errors />
                    <Button />
                  </>
                )} 
            </Form>
                
        </div>
        <div className="w-full h-full">
            <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%', zIndex: -1}}
                options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                }}
                onLoad={m => setMap(m)}
            />
        </div>

    </div>
    );
}