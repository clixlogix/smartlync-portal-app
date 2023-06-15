/**
 *
 *
 * @export
 * @class FaultRateMeasurementTrend
 */
export class FaultRateMeasurementTrend {
    protected id?: string;
    public faultRate?: string;
    public dateTime?: string;
    public faultCount?: string;
    public cycleCount?: number;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.faultRate = o?.faultRate;
        this.dateTime = o?.dateTime;
        this.faultCount = o?.faultCount;
        this.cycleCount = o?.cycleCount;
    }
}

export type FaultRateMeasurementTrends = FaultRateMeasurementTrend[];

export default FaultRateMeasurementTrend;
