/**
 *
 *
 * @export
 * @class LiftingHeightMeasurementTrend
 */
export class LiftingHeightMeasurementTrend {
    private id?: string;
    public liftingHeight?: string;
    public dateTime?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.liftingHeight = o?.liftingHeight;
        this.dateTime = o?.dateTime;
    }
}

export type LiftingHeightMeasurementTrends = LiftingHeightMeasurementTrend[];

export default LiftingHeightMeasurementTrend;
