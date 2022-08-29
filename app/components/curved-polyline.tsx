import mapboxgl from "mapbox-gl";
import { Layer, Source } from "react-map-gl";
import { greatCircle, lineDistance, midpoint, destination, bearing , distance, lineArc } from "@turf/turf"
import { toWgs84, toMercator } from "@turf/projection"
import { dottedGrayLayer } from "~/layers/dottedGrayLayer";

type CurvedPolylineProps = {
    id: string,
    origin: mapboxgl.LngLat | undefined,
    destination: mapboxgl.LngLat | undefined,
    visible?: boolean
}

export default function CurvedPolyline(props: CurvedPolylineProps) {
    if (props.origin == undefined || props.destination == undefined) return <div/>;

    // console.log(coordinates);
    const test = greatCircle([props.origin.lng, props.origin.lat], [props.destination.lng, props.destination.lat], {properties: {name: props.id}, npoints: 100, offset: 100});

    let route: GeoJSON.LineString = {
        type: 'LineString',
        coordinates: [
            [props.origin.lng, props.origin.lat],
            [props.destination.lng, props.destination.lat]
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

    return (
        <Source id={props.id} type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={data}>
            <Layer {...dottedGrayLayer} />
        </Source>
    )
}