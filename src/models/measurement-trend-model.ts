/**
 *
 *
 * @export
 * @class MeasurementTrend
 */
export class MeasurementTrend {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementTrends = MeasurementTrend[];

export default MeasurementTrend;
