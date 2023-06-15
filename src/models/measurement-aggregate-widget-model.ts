/**
 *
 *
 * @export
 * @class MeasurementAggregateWidget
 */
export class MeasurementAggregateWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementAggregateWidgets = MeasurementAggregateWidget[];

export default MeasurementAggregateWidget;
