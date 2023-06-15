/**
 *
 *
 * @export
 * @class WopRateMeasurementTrend
 */
export class WopRateMeasurementTrend {
    private id?: string;
    public wopRate?: string;
    public dateTime?: string;
    public wopCount?: string;
    public cycleCount?: number;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.wopRate = o?.wopRate;
        this.dateTime = o?.dateTime;
        this.wopCount = o?.wopCount;
        this.cycleCount = o?.cycleCount;
    }
}

export type WopRateMeasurementTrends = WopRateMeasurementTrend[];

export default WopRateMeasurementTrend;
