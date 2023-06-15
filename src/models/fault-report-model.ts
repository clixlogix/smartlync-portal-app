import { Moment } from 'moment';
export interface IFaultReportItem {
    deviceName: string;
    studId: string;
    studType: string;
    time: Moment | string;

    [key: string]: any;
}
/**
 *
 *
 * @export
 * @class FaultReport
 */
export class FaultReportItem implements IFaultReportItem {
    protected id: string;
    deviceName: string;
    studId: string;
    studType: string;
    time: Moment | string;

    // view model properties
    hidden?: boolean;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;

        this.deviceName = o.deviceName;
        this.studId = o.studId;
        this.studType = o.studType;
        this.time = o.time;
    }
}

export type FaultReports = FaultReportItem[];

export default FaultReportItem;
