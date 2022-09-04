import { MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";

export const locationActions = {
    updateQuery: 'updateQuery',
    updateInput: 'updateInput',
    selectInput: 'selectInput',
    updateSuggestions: 'updateSuggestions',
    updateLngLat: 'updateLngLat',
    mapClick: 'mapClick',
    createMarker: 'createMarker'
}

export type LocationState = {
    query: string;
    input: string;
    suggestions: any;
    lngLat: mapboxgl.LngLat | undefined;
    marker: mapboxgl.Marker | undefined;
};
