import { type } from "os"

export declare type NameValue = {
    [index: string]: string,
}

export declare type SidebarData = {
    id: number,
    title: string,
    type: ('driving-traffic' | 'cycling' | 'walking' | 'public-transport'),
    distance: string,
    duration: string,
    carbon: string,
}