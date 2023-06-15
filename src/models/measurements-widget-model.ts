/**
 *
 *
 * @export
 * @class MeasurementsWidget
 */
export class MeasurementsWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MeasurementsWidgets = MeasurementsWidget[];

export default MeasurementsWidget;
