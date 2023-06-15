/**
 *
 *
 * @export
 * @class StationAvailabilityTrend
 */

type StationAvailabilityTrendData = {
    x?: number;
    y?: number;
    cycleCount?: number;
    faultCount?: number;
    wopCount?: number;
    totalUptime?: number;
    downtime?: number;
    TA?: number;
};

export class StationAvailabilityTrend {
    protected id?: string;
    public data: StationAvailabilityTrendData[];
    public type?: string;
    public name?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, type = '', data = [], name = '' } = o || ({} as any);

        this.id = id;
        this.data = data;
        this.type = type;
        this.name = name;
    }
}

export type StationAvailabilityTrends = StationAvailabilityTrend[];

export default StationAvailabilityTrend;
