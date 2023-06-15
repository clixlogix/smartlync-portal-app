/**
 *
 *
 * @export
 * @class MeasurementAggregateSprWidget
 */
export class MeasurementAggregateSprWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementAggregateSprWidgets = MeasurementAggregateSprWidget[];

export default MeasurementAggregateSprWidget;
