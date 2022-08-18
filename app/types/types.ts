import { type } from "os"

export declare type NameValue = {
    [index: string]: number,
}

export declare type SidebarData = {
    id: number,
    title: string,
    type: ('driving-traffic' | 'cycling' | 'walking' | 'public-transport'),
    distance: number,
    duration: number,
    carbon: number,
}