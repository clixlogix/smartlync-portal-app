import { Programs as ProgramsType, ProgramDetail, ProgramParameter } from 'models';

function createData(
    id: number,
    programName: string,
    schedule: string,
    outlet: number,
    feeder: number,
    tool: string,
    station: string,
    lastModifiedBy: string,
    lastUpdated: string,
) {
    return {
        id,
        programName,
        schedule,
        outlet,
        feeder,
        tool,
        station,
        lastModifiedBy,
        lastUpdated,
        devices: [
            {
                id: 1,
                name: 'Line3Station8Robot1',
            },
            {
                id: 2,
                name: 'Line3Station8Robot2',
            },
            {
                id: 3,
                name: 'Line3Station8Robot3',
            },
            {
                id: 4,
                name: 'Line3Station8Robot4',
            },
        ],
    };
}

// export const programDetail: ProgramDetail = {
//     id: '123',
//     wceName: 'AD320_R01_B05_W1',
//     schedule: 'Schedule 1',
//     feeder: 1,
//     tool: 'TH 510',
//     station: 'Station 12',
//     lastUpdated: '12 March 2022 06:22',
//     lastModifiedBy: 'Ethel Walker',
//     name: 'My Web Schedule',
//     studyId: 'SDN123',
//     archive: 'Yes',
//     startDelay: '200ms',
//     weldStop: {
//         current: '750a',
//         time: '28ms',
//     },
//     airBlow: 'Yes',
//     lift: '1.2mm',
//     penetration: '1.2mm',
//     graphicMonitor: 'Yes',
//     studyLenghtTest: 'Outlet Test',
//     stckout: '00mm',
//     dropTime: 'Auto',
//     pilotLimits: { min: '15MVV', max: '33V' },
//     weldTime: '6ms',
//     weldEnergy: { min: '0J', max: '0J' },
// };

export const programDetail: ProgramDetail = {
    id: '2',
    feeder: 1,
    tool: 'TH 510',
    createdAt: '08 March 2022 19:42',
    createdBy: 'Marco Smith',
    optimization: 'NO',
    weldMode: 'Normal',
    faults: 'none',
};

export const programParameter: ProgramParameter = {
    id: '2',
    pilotWeldcurrentArcVoltage: { reference: null, maximum: null, minimum: null },
    mainWeldcurrentVoltage: { reference: null, maximum: null, minimum: null },
    weldCurrent: { reference: 2, maximum: 2, minimum: 2 },
    weldVoltage: { reference: null, maximum: null, minimum: null },
    weldEnergy: { reference: 2, maximum: 2, minimum: 2 },
    liftPosition: { reference: 2, maximum: 2, minimum: 2 },
    current: { reference: 2, maximum: 2, minimum: 2 },
};

export const programs: ProgramsType | any[] = [
    createData(1, 'Program A', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(2, 'Program B', 'Schedule 2', 1, 1, 'TH 500', 'Station 12', 'Priscilla Lyons', '12 March 2022 06:22'),
    createData(3, 'Program C', 'Schedule 3', 1, 1, 'TH 500', 'Station 12', 'Brenda Meyer', '12 March 2022 06:22'),
    createData(4, 'Program D', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ruby Baker', '12 March 2022 06:22'),
    createData(5, 'Program E', 'Schedule 4', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(6, 'Program F', 'Schedule 2', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(7, 'Program G', 'Schedule 6', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(8, 'Program H', 'Schedule 6', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(9, 'Program I', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(10, 'Program J', 'Schedule 4', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(11, 'Program K', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(12, 'Program L', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(13, 'Program M', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
    createData(14, 'Program N', 'Schedule 1', 1, 1, 'TH 500', 'Station 12', 'Ethel Walker', '12 March 2022 06:22'),
];
