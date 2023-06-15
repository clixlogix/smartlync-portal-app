/**
 *
 *
 * @export
 * @class TopFaultCount
 */
export class TopFaultCount {
    protected id: string;
    faultCode?: string;
    occurrences?: number;
    deviceName?: string;
    studType?: string;
    details?: { description: string; extendedDescription: string };

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.faultCode = o.faultCode;
        this.occurrences = o.occurrences;
        this.deviceName = o.deviceName;
        this.studType = o.studType;
        this.details = o.details;
    }
}

export type TopFaultCounts = TopFaultCount[];

export default TopFaultCount;
