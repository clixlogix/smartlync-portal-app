/**
 *
 *
 * @export
 * @class MeasurementsSprWidget
 */
export class MeasurementsSprWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementsSprWidgets = MeasurementsSprWidget[];

export default MeasurementsSprWidget;
