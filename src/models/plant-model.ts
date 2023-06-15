import { CarClass } from './car-class-model';

export interface Plant {
    id?: string;
    name: string;
    location?: string;
    thumbnail?: string;
    route?: string;
    active?: boolean;
    risk?: string;
    lastUpdated?: string;
    faultTrend?: string;
    technicalAvailability?: string;
    target?: string;
    carClasses?: CarClass[];
    cycleCount?: string | number;
    eventCount?: string | number;
    eventRate?: string | number;
    changeEventRate?: string | number;
    tenant?: string;
}

export type Plants = Plant[];
