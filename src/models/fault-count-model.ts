import moment, { Moment } from 'moment';

export class FaultCount {
    studType: string;
    deviceName: string;
    studId: string;
    time: Moment;
    eventCount: number;
    cycleCount: number;

    constructor(o?: any) {
        const { studType, deviceName, studId, time, eventCount = 0, cycleCount = 0 } = o || ({} as any);

        this.studType = studType;
        this.deviceName = deviceName;
        this.studId = studId;
        this.time = moment(time).toDate();
        this.eventCount = typeof eventCount === 'string' ? parseInt(eventCount) : eventCount;
        this.cycleCount = cycleCount;
    }

    get rate(): number {
        const d: number = this.eventCount + this.cycleCount;
        return d === 0 ? 0 : this.eventCount / d;
    }
}

export type FaultCounts = FaultCount[];

export default FaultCount;
