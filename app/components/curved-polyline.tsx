import mapboxgl from "mapbox-gl";
import { greatCircle, lineDistance, midpoint, destination, bearing , distance, lineArc } from "@turf/turf"
import { toWgs84, toMercator } from "@turf/projection"

export default function CurvedPolyline(origin: mapboxgl.LngLat | undefined, dest: mapboxgl.LngLat | undefined): GeoJSON.Feature {
    if (origin == undefined || dest == undefined) {
        console.log(origin)
        console.log(dest)
        return {
            type: "Feature",
            geometry: {
                type: 'LineString',
                coordinates: [],
            },
            properties: null
        }
    }

    // console.log(coordinates);
    const test = greatCircle([origin.lng, origin.lat], [dest.lng, dest.lat], {npoints: 100, offset: 100});

    let route: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [
            [origin.lng, origin.lat],
            [dest.lng, dest.lat]
        ]
    };

    route = toWgs84(route);
    const lineDist = lineDistance(route, {units: 'kilometers'});
    const midPoint = midpoint(route.coordinates[0], route.coordinates[1]);
    const center = destination(
        midPoint,
        lineDist,
        bearing(route.coordinates[0], route.coordinates[1]) + 90
    );

    const linearc = lineArc(
        center,
        distance(center, route.coordinates[0]),
        bearing(center, route.coordinates[0]),
        bearing(center, route.coordinates[1]),
        {steps: 500}
    );

    const data: GeoJSON.Feature = toMercator(linearc);

    return data;
}