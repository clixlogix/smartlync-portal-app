/**
 *
 *
 * @export
 * @class WeldingTimeMeasurementTrend
 */
export class WeldingTimeMeasurementTrend {
    private id?: string;
    public weldingRate?: string;
    public dateTime?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.weldingRate = o?.weldingRate;
        this.dateTime = o?.dateTime;
    }
}

export type WeldingTimeMeasurementTrends = WeldingTimeMeasurementTrend[];

export default WeldingTimeMeasurementTrend;
