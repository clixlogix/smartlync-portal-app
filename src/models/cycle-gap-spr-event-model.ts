export interface CycleGapSprEventTag {
    deviceName: string;
    outletNo: string;
    program: string;
}
export type CycleGapSprEventValue = [string, string, string, string];
/*
0: "time"
1: "faultGroup"
2: "faultDescription"
3: "faultId"
*/
export interface CycleGapSprEvent {
    name: string;
    tags: CycleGapSprEventTag;
    values: CycleGapSprEventValue[];
}

export type CycleGapSprEvents = CycleGapSprEvent[];

export default CycleGapSprEvent;
