import mapboxgl from "mapbox-gl";
import { Layer, Source } from "react-map-gl";
import { greatCircle, lineDistance, midpoint, destination, bearing , distance, lineArc } from "@turf/turf"
import { toWgs84, toMercator } from "@turf/projection"

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

    const routesLayer: mapboxgl.LineLayer = {
        id: props.id,
        type: 'line',
        layout: {
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#a0a0a0',
          'line-dasharray': [2, 3],
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
            5,
            16,
            13,
            22,
            25,
          ],
        },
      }

    return (
        <Source id={props.id} type="geojson" tolerance={1} buffer={0} lineMetrics={true} data={data}>
            <Layer {...routesLayer} />
        </Source>
    )
}