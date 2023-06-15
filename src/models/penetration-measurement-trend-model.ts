/**
 *
 *
 * @export
 * @class PenetrationMeasurementTrend
 */
export class PenetrationMeasurementTrend {
    private id?: string;
    public penetrationRate?: string;
    public dateTime?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.penetrationRate = o?.penetrationRate;
        this.dateTime = o?.dateTime;
    }
}

export type PenetrationMeasurementTrends = PenetrationMeasurementTrend[];

export default PenetrationMeasurementTrend;
