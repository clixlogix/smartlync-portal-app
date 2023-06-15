/**
 *
 *
 * @export
 * @interface Program
 */

export interface ProgramDevice {
    id: number;
    name: string;
}
export interface Program {
    id: number;
    programName: string;
    outlet: number;
    schedule: string;
    feeder: number;
    tool: string;
    station: string;
    lastModifiedBy: string;
    lastUpdated: string;
    devices: ProgramDevice[];
}

export interface ProgramWeldStop {
    current: string;
    time: string;
}

export interface ProgramLimit {
    min: string;
    max: string;
}

// export interface ProgramDetail {
//     id: string;
//     wceName: string;
//     schedule: string;
//     feeder: number;
//     tool: string;
//     station: string;
//     lastUpdated: string;
//     lastModifiedBy: string;
//     name: string;
//     studyId: string;
//     archive: string;
//     startDelay: string;
//     weldStop: ProgramWeldStop;
//     airBlow: string;
//     lift: string;
//     penetration: string;
//     graphicMonitor: string;
//     studyLenghtTest: string;
//     stckout: string;
//     dropTime: string;
//     pilotLimits: ProgramLimit;
//     weldTime: string;
//     weldEnergy: ProgramLimit;
// }

export interface ProgramDetail {
    id: string;
    feeder: number;
    tool: string;
    createdAt: string;
    createdBy: string;
    optimization: string;
    weldMode: string;
    faults: string;
}

export interface ProgramParameterDetail {
    reference: null | number;
    maximum: null | number;
    minimum: null | number;
}

export interface ProgramParameter {
    id?: string;
    programId?: number;
    pilotWeldcurrentArcVoltage: ProgramParameterDetail;
    mainWeldcurrentVoltage: ProgramParameterDetail;
    weldCurrent: ProgramParameterDetail;
    weldVoltage: ProgramParameterDetail;
    weldEnergy: ProgramParameterDetail;
    liftPosition: ProgramParameterDetail;
    current: ProgramParameterDetail;
}

export interface EditedProgramParameters {
    [programId: number]: EditedProgramParameter;
}
export interface EditedProgramParameter {
    data: ProgramParameter;
    isSaved: boolean;
    editedFields: (keyof ProgramParameter)[];
}

export type ProgramSortingType = 'asc' | 'desc';

export type Programs = Program[];

export default Program;
