/**
 *
 *
 * @export
 * @class StudProjectionMeasurementTrend
 */
export class StudProjectionMeasurementTrend {
    private id?: string;
    public boltProjectionRate?: string;
    public dateTime?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.boltProjectionRate = o?.boltProjectionRate;
        this.dateTime = o?.dateTime;
    }
}

export type StudProjectionMeasurementTrends = StudProjectionMeasurementTrend[];

export default StudProjectionMeasurementTrend;
