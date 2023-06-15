import { PlantCycleAveragesCardName } from 'models';

/**
 *
 *
 * @export
 * @interface BodyShopAverage
 */
interface BodyShopAverage {
    name: string;
    value: number;
    unit: string;
}

/**
 *
 *
 * @export
 * @class TotalWeeklyAverage
 */
export interface TotalWeeklyAverage {
    name?: PlantCycleAveragesCardName;
    toolTip?: string;
    value?: string | number;
    unit?: string;
    trendValueUnit?: string | number;
    trend?: boolean;
    trendValue?: string | number;
    bodyShops?: Array<BodyShopAverage>;
    bs1?: string;
    bs2?: string;
    // summary values
    ta?: number;
    mttr?: number;
    mtbf?: number;
    mttf?: number;
}

export type TotalWeeklyAverages = TotalWeeklyAverage[];

export default TotalWeeklyAverage;
