export declare type StatsData = {
    id: number;
    title: string;
    type: ('driving-traffic' | 'cycling' | 'walking' | 'public-transport');
    distanceMeters: number;
    durationSeconds: number;
    carbonGrams: number;
};
