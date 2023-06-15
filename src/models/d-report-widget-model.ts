
/**
 *
 *
 * @export
 * @class DReportWidget
 */
export class DReportWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type DReportWidgets = DReportWidget[];

export default DReportWidget;
