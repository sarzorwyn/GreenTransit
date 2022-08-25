import { TransitTypes } from "./TransitTypes";

export declare type StatsData = {
    id: number;
    title: string;
    type: TransitTypes;
    distanceMeters: number;
    durationSeconds: number;
    carbonGrams: number;
    // Ranks indicate the relative position of that metric compared to other types of transportation
    distanceRank?: number;
    durationRank?: number;
    carbonRank?: number;
};
