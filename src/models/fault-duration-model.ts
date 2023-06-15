/**
 *
 *
 * @export
 * @class FaultDuration
 */
export class FaultDuration {
    faultCode?: string;
    duration?: string;
    index?: number;
    position?: string;

    constructor(o?: any) {
        this.faultCode = o.faultCode;
        this.duration = o.duration;
        this.index = o.index;
        this.position = o.position;
    }
}

export type FaultDurations = FaultDuration[];

export default FaultDuration;
