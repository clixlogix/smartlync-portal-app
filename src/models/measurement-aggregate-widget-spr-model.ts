/**
 *
 *
 * @export
 * @class MeasurementAggregateWidgetSpr
 */
export class MeasurementAggregateWidgetSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementAggregateWidgetSprs = MeasurementAggregateWidgetSpr[];

export default MeasurementAggregateWidgetSpr;
