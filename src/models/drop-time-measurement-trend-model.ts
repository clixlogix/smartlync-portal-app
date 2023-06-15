/**
 *
 *
 * @export
 * @class DropTimeMeasurementTrend
 */
export class DropTimeMeasurementTrend {
    private id?: string;
    public dropTimeRate?: string;
    public dateTime?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.dropTimeRate = o?.dropTimeRate;
        this.dateTime = o?.dateTime;
    }
}

export type DropTimeMeasurementTrends = DropTimeMeasurementTrend[];

export default DropTimeMeasurementTrend;
