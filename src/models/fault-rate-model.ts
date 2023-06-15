import moment, { Moment } from 'moment';

export class FaultRate {
    studType: string;
    deviceName: string;
    studId: string;
    time: Moment;
    faultCount: number;
    cycleCount: number;

    constructor(o?: any) {
        const { studType, deviceName, studId, time, faultCount = 0, cycleCount = 0 } = o || ({} as any);

        this.studType = studType;
        this.deviceName = deviceName;
        this.studId = studId;
        this.time = moment(time);
        this.faultCount = faultCount;
        this.cycleCount = cycleCount;
    }

    get rate(): number {
        const d: number = this.faultCount + this.cycleCount;
        return d === 0 ? 0 : this.faultCount / d;
    }
}

export type FaultRates = FaultRate[];

export default FaultRate;
