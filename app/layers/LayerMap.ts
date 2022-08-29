import { cyclingActive, cyclingInactive } from "./cycling";
import { drivingTrafficActive, drivingTrafficInactive } from "./driving-traffic";
import { publicTransportActive, publicTransportInactive } from "./public-transport";
import { walkingActive, walkingInactive } from "./walking";

export declare type LayerMap = {
    [index: string]: {
        activeLayer: mapboxgl.LineLayer,
        inactiveLayer: mapboxgl.LineLayer,
    }
}

export const layerMap: LayerMap = {
    'driving-traffic': {
        activeLayer: drivingTrafficActive,
        inactiveLayer: drivingTrafficInactive,
    },
    'cycling': {
        activeLayer: cyclingActive,
        inactiveLayer: cyclingInactive,
    },
    'walking': {
        activeLayer: walkingActive,
        inactiveLayer: walkingInactive,
    },
    'public-transport': {
        activeLayer: publicTransportActive,
        inactiveLayer: publicTransportInactive,
    }
};