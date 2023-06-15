export interface CycleGapEventTag {
    deviceName: string;
    feederNo: string;
    outletNo: string;
    studId: string;
}
export type CycleGapEventValue = [string, string, string, string, string, string];
/*
0: "time"
1: "eventType"
2: "active"
3: "eventCode"
4: "reason"
5: "description"
*/
export interface CycleGapEvent {
    name: string;
    tags: CycleGapEventTag;
    values: CycleGapEventValue[];
}

export type CycleGapEvents = CycleGapEvent[];

export default CycleGapEvent;
