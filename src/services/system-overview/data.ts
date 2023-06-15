import { Moment } from 'moment';
export interface HealthValue {
    value: number;
    lastChange: Moment;
}

export interface ComponentHealth {
    name: string;
    health: HealthValue;
}

export interface ComponentMaintenanceForcast {
    [item: string]: any;
}

// enum ComponentEventType {
//     repaired = 'repaired',
//     exchanged = 'exchanged',
// }

export interface ComponentEvent {
    summary: string;
    // eventType: ComponentEventType;
    eventType: string;
}

export interface ComponentHistory {
    events: ComponentEvent[];
    currentCycles: number;
}
export interface ComponentMaintenanceData {
    components: ComponentHealth[];
    history: ComponentHistory[];
    forecast: ComponentMaintenanceForcast;
}

export interface DeviceComponents {
    outlet: string;
    componentName: string;
    componentHealth: number;
    lastChange: { time: string; cycles: number };
    history: ComponentHistory;
    forecast: { cycles: number; hours: number };
}
export interface DeviceHealthInfo {
    deviceName: string;
    deviceHealth: number;
    components: DeviceComponents[];
}

const data1: DeviceHealthInfo[] = [
    {
        deviceName: 'Line1 Station1 Robot1',
        deviceHealth: 94.6,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.5,
                lastChange: { time: '2021-07-08 22:17:49.952865', cycles: 16516 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 22:17:49.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 8851,
                },
                forecast: { cycles: 43484, hours: 20872.32 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 95.8,
                lastChange: { time: '2021-06-25 20:40:37.952865', cycles: 32197 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 20:40:37.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 24159,
                },
                forecast: { cycles: 27803, hours: 13345.44 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.7,
                lastChange: { time: '2021-06-20 18:58:37.952865', cycles: 38282 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 18:58:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 37076,
                },
                forecast: { cycles: 21718, hours: 10424.64 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-09 00:07:01.952865', cycles: 16425 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 00:07:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 12036,
                },
                forecast: { cycles: 43575, hours: 20916.0 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.3,
                lastChange: { time: '2021-07-04 02:40:37.952865', cycles: 22297 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 02:40:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 20208,
                },
                forecast: { cycles: 37703, hours: 18097.44 },
            },
        ],
    },
    {
        deviceName: 'Line1 Station1 Robot2',
        deviceHealth: 93.8,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.1,
                lastChange: { time: '2021-06-26 21:04:37.952865', cycles: 30977 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 21:04:37.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 22332,
                },
                forecast: { cycles: 29023, hours: 13931.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-21 00:34:37.952865', cycles: 38002 },
                history: {
                    events: [
                        {
                            summary: '2021-06-21 00:34:37.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 30981,
                },
                forecast: { cycles: 21998, hours: 10559.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.5,
                lastChange: { time: '2021-07-07 10:09:25.952865', cycles: 18323 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 10:09:25.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 8927,
                },
                forecast: { cycles: 41677, hours: 20004.96 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.6,
                lastChange: { time: '2021-07-12 06:50:13.952865', cycles: 12489 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 06:50:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 2960,
                },
                forecast: { cycles: 47511, hours: 22805.28 },
            },
        ],
    },
    {
        deviceName: 'Line2 Station2 Robot2',
        deviceHealth: 93.7,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.4,
                lastChange: { time: '2021-06-30 19:33:25.952865', cycles: 26253 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 19:33:25.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 18114,
                },
                forecast: { cycles: 33747, hours: 16198.56 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.4,
                lastChange: { time: '2021-06-27 02:03:25.952865', cycles: 30728 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 02:03:25.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 22246,
                },
                forecast: { cycles: 29272, hours: 14050.56 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.5,
                lastChange: { time: '2021-07-07 13:53:49.952865', cycles: 18136 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 13:53:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 14376,
                },
                forecast: { cycles: 41864, hours: 20094.72 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.2,
                lastChange: { time: '2021-06-20 13:10:37.952865', cycles: 38572 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 13:10:37.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 35799,
                },
                forecast: { cycles: 21428, hours: 10285.44 },
            },
        ],
    },
    {
        deviceName: 'Line2 Station2 Robot3',
        deviceHealth: 94.2,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.3,
                lastChange: { time: '2021-07-09 12:29:49.952865', cycles: 15806 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 12:29:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 12300,
                },
                forecast: { cycles: 44194, hours: 21213.12 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.3,
                lastChange: { time: '2021-07-06 07:46:37.952865', cycles: 19642 },
                history: {
                    events: [
                        {
                            summary: '2021-07-06 07:46:37.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 16831,
                },
                forecast: { cycles: 40358, hours: 19371.84 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-30 13:57:25.952865', cycles: 26533 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 13:57:25.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 23980,
                },
                forecast: { cycles: 33467, hours: 16064.16 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.5,
                lastChange: { time: '2021-06-26 23:37:01.952865', cycles: 30850 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 23:37:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 26243,
                },
                forecast: { cycles: 29150, hours: 13992.0 },
            },
        ],
    },
    {
        deviceName: 'Line2 Station2 Robot4',
        deviceHealth: 94.3,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-11 14:35:49.952865', cycles: 13301 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 14:35:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 10472,
                },
                forecast: { cycles: 46699, hours: 22415.52 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.1,
                lastChange: { time: '2021-07-12 13:55:01.952865', cycles: 12135 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 13:55:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 4515,
                },
                forecast: { cycles: 47865, hours: 22975.2 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.6,
                lastChange: { time: '2021-06-21 19:26:13.952865', cycles: 37059 },
                history: {
                    events: [
                        {
                            summary: '2021-06-21 19:26:13.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 34177,
                },
                forecast: { cycles: 22941, hours: 11011.68 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 96.8,
                lastChange: { time: '2021-06-20 08:27:25.952865', cycles: 38808 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 08:27:25.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 37147,
                },
                forecast: { cycles: 21192, hours: 10172.16 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-03 12:19:01.952865', cycles: 23015 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 12:19:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 21947,
                },
                forecast: { cycles: 36985, hours: 17752.800000000003 },
            },
        ],
    },
    {
        deviceName: 'Line3 Station2 Robot4',
        deviceHealth: 92.7,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-14 03:57:25.952865', cycles: 10233 },
                history: {
                    events: [
                        {
                            summary: '2021-07-14 03:57:25.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 5150,
                },
                forecast: { cycles: 49767, hours: 23888.16 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.6,
                lastChange: { time: '2021-07-08 21:52:37.952865', cycles: 16537 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 21:52:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 12003,
                },
                forecast: { cycles: 43463, hours: 20862.24 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 95.8,
                lastChange: { time: '2021-06-28 03:25:01.952865', cycles: 29460 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 03:25:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 23909,
                },
                forecast: { cycles: 30540, hours: 14659.2 },
            },
        ],
    },
    {
        deviceName: 'Line3 Station3 Robot4',
        deviceHealth: 90.9,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.8,
                lastChange: { time: '2021-06-22 01:20:13.952865', cycles: 36764 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 01:20:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 30001,
                },
                forecast: { cycles: 23236, hours: 11153.28 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.7,
                lastChange: { time: '2021-07-04 23:21:25.952865', cycles: 21263 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 23:21:25.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 18436,
                },
                forecast: { cycles: 38737, hours: 18593.76 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 96.3,
                lastChange: { time: '2021-06-24 07:59:49.952865', cycles: 34031 },
                history: {
                    events: [
                        {
                            summary: '2021-06-24 07:59:49.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 26595,
                },
                forecast: { cycles: 25969, hours: 12465.12 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 95.9,
                lastChange: { time: '2021-06-30 07:11:49.952865', cycles: 26871 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 07:11:49.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 25176,
                },
                forecast: { cycles: 33129, hours: 15901.920000000002 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.6,
                lastChange: { time: '2021-06-26 15:41:49.952865', cycles: 31246 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 15:41:49.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 30829,
                },
                forecast: { cycles: 28754, hours: 13801.920000000002 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station4 Robot1',
        deviceHealth: 93.4,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.1,
                lastChange: { time: '2021-06-30 15:03:25.952865', cycles: 26478 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 15:03:25.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 17421,
                },
                forecast: { cycles: 33522, hours: 16090.56 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-01 14:51:25.952865', cycles: 25288 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 14:51:25.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 15986,
                },
                forecast: { cycles: 34712, hours: 16661.760000000002 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station4 Robot2',
        deviceHealth: 90.1,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.2,
                lastChange: { time: '2021-07-04 06:56:13.952865', cycles: 22084 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 06:56:13.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 17129,
                },
                forecast: { cycles: 37916, hours: 18199.68 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.1,
                lastChange: { time: '2021-06-27 20:23:49.952865', cycles: 29811 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 20:23:49.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 22450,
                },
                forecast: { cycles: 30189, hours: 14490.72 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station4 Robot3',
        deviceHealth: 91.2,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.9,
                lastChange: { time: '2021-07-11 06:37:01.952865', cycles: 13700 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 06:37:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 11751,
                },
                forecast: { cycles: 46300, hours: 22224.0 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.5,
                lastChange: { time: '2021-06-23 15:49:01.952865', cycles: 34840 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 15:49:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 27884,
                },
                forecast: { cycles: 25160, hours: 12076.8 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.7,
                lastChange: { time: '2021-07-08 13:11:49.952865', cycles: 16971 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 13:11:49.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 7808,
                },
                forecast: { cycles: 43029, hours: 20653.92 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.7,
                lastChange: { time: '2021-07-13 16:38:13.952865', cycles: 10799 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 16:38:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 3010,
                },
                forecast: { cycles: 49201, hours: 23616.48 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station4 Robot4',
        deviceHealth: 91.7,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.7,
                lastChange: { time: '2021-06-20 20:01:01.952865', cycles: 38230 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 20:01:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 31672,
                },
                forecast: { cycles: 21770, hours: 10449.6 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-01 22:34:37.952865', cycles: 24902 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 22:34:37.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 18813,
                },
                forecast: { cycles: 35098, hours: 16847.04 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.9,
                lastChange: { time: '2021-06-23 02:50:13.952865', cycles: 35489 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 02:50:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 32181,
                },
                forecast: { cycles: 24511, hours: 11765.28 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station5 Robot1',
        deviceHealth: 94.8,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 97.0,
                lastChange: { time: '2021-06-26 21:07:01.952865', cycles: 30975 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 21:07:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 22541,
                },
                forecast: { cycles: 29025, hours: 13932.0 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.2,
                lastChange: { time: '2021-06-24 08:05:49.952865', cycles: 34026 },
                history: {
                    events: [
                        {
                            summary: '2021-06-24 08:05:49.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 32883,
                },
                forecast: { cycles: 25974, hours: 12467.52 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station5 Robot2',
        deviceHealth: 93.0,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.5,
                lastChange: { time: '2021-07-04 23:47:49.952865', cycles: 21241 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 23:47:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 19005,
                },
                forecast: { cycles: 38759, hours: 18604.32 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station5 Robot3',
        deviceHealth: 95.0,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.5,
                lastChange: { time: '2021-06-23 20:35:49.952865', cycles: 34601 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 20:35:49.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 29413,
                },
                forecast: { cycles: 25399, hours: 12191.52 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.1,
                lastChange: { time: '2021-07-09 15:08:13.952865', cycles: 15674 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 15:08:13.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 13036,
                },
                forecast: { cycles: 44326, hours: 21276.48 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.8,
                lastChange: { time: '2021-06-27 10:49:01.952865', cycles: 30290 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 10:49:01.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 25156,
                },
                forecast: { cycles: 29710, hours: 14260.8 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station5 Robot4',
        deviceHealth: 94.4,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-11 04:44:13.952865', cycles: 13794 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 04:44:13.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 10730,
                },
                forecast: { cycles: 46206, hours: 22178.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-28 12:31:01.952865', cycles: 29005 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 12:31:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 25441,
                },
                forecast: { cycles: 30995, hours: 14877.6 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.1,
                lastChange: { time: '2021-06-20 05:41:49.952865', cycles: 38946 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 05:41:49.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 32961,
                },
                forecast: { cycles: 21054, hours: 10105.92 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station6 Robot3',
        deviceHealth: 95.0,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.5,
                lastChange: { time: '2021-07-09 14:41:49.952865', cycles: 15696 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 14:41:49.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 6299,
                },
                forecast: { cycles: 44304, hours: 21265.92 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-09 01:11:49.952865', cycles: 16371 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 01:11:49.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 8264,
                },
                forecast: { cycles: 43629, hours: 20941.92 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station6 Robot4',
        deviceHealth: 90.0,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.4,
                lastChange: { time: '2021-06-30 01:56:13.952865', cycles: 27134 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 01:56:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 19745,
                },
                forecast: { cycles: 32866, hours: 15775.68 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.4,
                lastChange: { time: '2021-06-25 09:39:25.952865', cycles: 32748 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 09:39:25.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 24012,
                },
                forecast: { cycles: 27252, hours: 13080.96 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.6,
                lastChange: { time: '2021-06-20 22:52:37.952865', cycles: 38087 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 22:52:37.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 30992,
                },
                forecast: { cycles: 21913, hours: 10518.24 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 95.8,
                lastChange: { time: '2021-07-12 08:56:13.952865', cycles: 12384 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 08:56:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 6060,
                },
                forecast: { cycles: 47616, hours: 22855.68 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station6 Robot5',
        deviceHealth: 93.8,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 97.9,
                lastChange: { time: '2021-07-03 07:29:49.952865', cycles: 23256 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 07:29:49.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 16351,
                },
                forecast: { cycles: 36744, hours: 17637.12 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.0,
                lastChange: { time: '2021-06-23 04:19:01.952865', cycles: 35415 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 04:19:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 35322,
                },
                forecast: { cycles: 24585, hours: 11800.8 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station6 Robot6',
        deviceHealth: 94.5,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.8,
                lastChange: { time: '2021-06-29 09:55:01.952865', cycles: 27935 },
                history: {
                    events: [
                        {
                            summary: '2021-06-29 09:55:01.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 25441,
                },
                forecast: { cycles: 32065, hours: 15391.2 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.5,
                lastChange: { time: '2021-06-20 18:05:49.952865', cycles: 38326 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 18:05:49.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 29501,
                },
                forecast: { cycles: 21674, hours: 10403.52 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-03 07:43:01.952865', cycles: 23245 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 07:43:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 22562,
                },
                forecast: { cycles: 36755, hours: 17642.4 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station7 Robot2',
        deviceHealth: 94.5,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.5,
                lastChange: { time: '2021-07-07 14:58:37.952865', cycles: 18082 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 14:58:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 17055,
                },
                forecast: { cycles: 41918, hours: 20120.64 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.1,
                lastChange: { time: '2021-06-27 19:14:13.952865', cycles: 29869 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 19:14:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 23270,
                },
                forecast: { cycles: 30131, hours: 14462.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.6,
                lastChange: { time: '2021-07-12 16:02:13.952865', cycles: 12029 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 16:02:13.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 8434,
                },
                forecast: { cycles: 47971, hours: 23026.08 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.7,
                lastChange: { time: '2021-07-09 19:01:01.952865', cycles: 15480 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 19:01:01.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 14296,
                },
                forecast: { cycles: 44520, hours: 21369.6 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station7 Robot3',
        deviceHealth: 93.2,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.6,
                lastChange: { time: '2021-06-21 20:04:37.952865', cycles: 37027 },
                history: {
                    events: [
                        {
                            summary: '2021-06-21 20:04:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 27503,
                },
                forecast: { cycles: 22973, hours: 11027.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 95.0,
                lastChange: { time: '2021-06-25 04:22:37.952865', cycles: 33012 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 04:22:37.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 26961,
                },
                forecast: { cycles: 26988, hours: 12954.24 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.5,
                lastChange: { time: '2021-07-07 09:44:13.952865', cycles: 18344 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 09:44:13.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 9845,
                },
                forecast: { cycles: 41656, hours: 19994.88 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.0,
                lastChange: { time: '2021-06-27 04:43:01.952865', cycles: 30595 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 04:43:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 27194,
                },
                forecast: { cycles: 29405, hours: 14114.4 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station7 Robot4',
        deviceHealth: 90.7,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.1,
                lastChange: { time: '2021-06-28 08:58:37.952865', cycles: 29182 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 08:58:37.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 19949,
                },
                forecast: { cycles: 30818, hours: 14792.64 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.5,
                lastChange: { time: '2021-07-06 10:53:49.952865', cycles: 19486 },
                history: {
                    events: [
                        {
                            summary: '2021-07-06 10:53:49.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 10396,
                },
                forecast: { cycles: 40514, hours: 19446.72 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 97.1,
                lastChange: { time: '2021-07-11 15:05:49.952865', cycles: 13276 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 15:05:49.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 6117,
                },
                forecast: { cycles: 46724, hours: 22427.52 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.9,
                lastChange: { time: '2021-07-06 03:22:37.952865', cycles: 19862 },
                history: {
                    events: [
                        {
                            summary: '2021-07-06 03:22:37.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 18459,
                },
                forecast: { cycles: 40138, hours: 19266.24 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station7 Robot5',
        deviceHealth: 92.5,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.9,
                lastChange: { time: '2021-06-25 17:01:01.952865', cycles: 32380 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 17:01:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 30436,
                },
                forecast: { cycles: 27620, hours: 13257.6 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-26 22:49:01.952865', cycles: 30890 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 22:49:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 30787,
                },
                forecast: { cycles: 29110, hours: 13972.8 },
            },
        ],
    },
    {
        deviceName: 'Line4 Station7 Robot6',
        deviceHealth: 91.6,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 95.0,
                lastChange: { time: '2021-07-13 03:14:13.952865', cycles: 11469 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 03:14:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 4927,
                },
                forecast: { cycles: 48531, hours: 23294.88 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station10 Robot2',
        deviceHealth: 91.6,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.2,
                lastChange: { time: '2021-07-07 00:44:13.952865', cycles: 18794 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 00:44:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 14308,
                },
                forecast: { cycles: 41206, hours: 19778.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.3,
                lastChange: { time: '2021-06-29 20:29:49.952865', cycles: 27406 },
                history: {
                    events: [
                        {
                            summary: '2021-06-29 20:29:49.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 26933,
                },
                forecast: { cycles: 32594, hours: 15645.12 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-11 11:32:13.952865', cycles: 13454 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 11:32:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 10854,
                },
                forecast: { cycles: 46546, hours: 22342.08 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station10 Robot3',
        deviceHealth: 90.7,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 97.0,
                lastChange: { time: '2021-07-07 02:53:49.952865', cycles: 18686 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 02:53:49.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 18525,
                },
                forecast: { cycles: 41314, hours: 19830.72 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 98.0,
                lastChange: { time: '2021-06-22 09:34:37.952865', cycles: 36352 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 09:34:37.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 35598,
                },
                forecast: { cycles: 23648, hours: 11351.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-30 08:45:25.952865', cycles: 26793 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 08:45:25.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 20743,
                },
                forecast: { cycles: 33207, hours: 15939.36 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.1,
                lastChange: { time: '2021-06-25 05:38:13.952865', cycles: 32949 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 05:38:13.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 31305,
                },
                forecast: { cycles: 27051, hours: 12984.48 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station10 Robot5',
        deviceHealth: 92.5,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-24 06:26:13.952865', cycles: 34109 },
                history: {
                    events: [
                        {
                            summary: '2021-06-24 06:26:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 24498,
                },
                forecast: { cycles: 25891, hours: 12427.68 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.8,
                lastChange: { time: '2021-06-20 13:17:49.952865', cycles: 38566 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 13:17:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 35371,
                },
                forecast: { cycles: 21434, hours: 10288.32 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 97.7,
                lastChange: { time: '2021-07-11 14:37:01.952865', cycles: 13300 },
                history: {
                    events: [
                        {
                            summary: '2021-07-11 14:37:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 10391,
                },
                forecast: { cycles: 46700, hours: 22416.0 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station5 Robot2',
        deviceHealth: 94.8,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 97.7,
                lastChange: { time: '2021-06-22 22:07:01.952865', cycles: 35725 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 22:07:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 31713,
                },
                forecast: { cycles: 24275, hours: 11652.0 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station5 Robot3',
        deviceHealth: 93.4,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 97.6,
                lastChange: { time: '2021-06-29 07:47:49.952865', cycles: 28041 },
                history: {
                    events: [
                        {
                            summary: '2021-06-29 07:47:49.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 26027,
                },
                forecast: { cycles: 31959, hours: 15340.32 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.6,
                lastChange: { time: '2021-07-05 14:08:13.952865', cycles: 20524 },
                history: {
                    events: [
                        {
                            summary: '2021-07-05 14:08:13.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 19460,
                },
                forecast: { cycles: 39476, hours: 18948.48 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.4,
                lastChange: { time: '2021-07-12 16:43:01.952865', cycles: 11995 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 16:43:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 9407,
                },
                forecast: { cycles: 48005, hours: 23042.4 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.8,
                lastChange: { time: '2021-07-04 13:50:13.952865', cycles: 21739 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 13:50:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 15389,
                },
                forecast: { cycles: 38261, hours: 18365.28 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station5 Robot5',
        deviceHealth: 94.2,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.4,
                lastChange: { time: '2021-06-21 13:45:25.952865', cycles: 37343 },
                history: {
                    events: [
                        {
                            summary: '2021-06-21 13:45:25.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 35647,
                },
                forecast: { cycles: 22657, hours: 10875.36 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.6,
                lastChange: { time: '2021-07-07 18:11:49.952865', cycles: 17921 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 18:11:49.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 16098,
                },
                forecast: { cycles: 42079, hours: 20197.92 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.7,
                lastChange: { time: '2021-06-27 20:29:49.952865', cycles: 29806 },
                history: {
                    events: [
                        {
                            summary: '2021-06-27 20:29:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 26590,
                },
                forecast: { cycles: 30194, hours: 14493.12 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station8 Robot1',
        deviceHealth: 90.5,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-03 14:11:49.952865', cycles: 22921 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 14:11:49.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 21138,
                },
                forecast: { cycles: 37079, hours: 17797.920000000002 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.5,
                lastChange: { time: '2021-07-06 22:19:01.952865', cycles: 18915 },
                history: {
                    events: [
                        {
                            summary: '2021-07-06 22:19:01.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 12342,
                },
                forecast: { cycles: 41085, hours: 19720.800000000003 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 96.1,
                lastChange: { time: '2021-07-05 03:11:49.952865', cycles: 21071 },
                history: {
                    events: [
                        {
                            summary: '2021-07-05 03:11:49.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 17771,
                },
                forecast: { cycles: 38929, hours: 18685.92 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station8 Robot4',
        deviceHealth: 91.0,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.5,
                lastChange: { time: '2021-06-20 04:44:13.952865', cycles: 38994 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 04:44:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 29880,
                },
                forecast: { cycles: 21006, hours: 10082.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.7,
                lastChange: { time: '2021-06-30 04:21:25.952865', cycles: 27013 },
                history: {
                    events: [
                        {
                            summary: '2021-06-30 04:21:25.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 20599,
                },
                forecast: { cycles: 32987, hours: 15833.76 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.2,
                lastChange: { time: '2021-06-22 05:46:37.952865', cycles: 36542 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 05:46:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 26948,
                },
                forecast: { cycles: 23458, hours: 11259.84 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 97.1,
                lastChange: { time: '2021-06-26 00:35:49.952865', cycles: 32001 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 00:35:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 27632,
                },
                forecast: { cycles: 27999, hours: 13439.52 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.6,
                lastChange: { time: '2021-07-07 07:02:13.952865', cycles: 18479 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 07:02:13.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 15153,
                },
                forecast: { cycles: 41521, hours: 19930.08 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station8 Robot5',
        deviceHealth: 91.3,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.6,
                lastChange: { time: '2021-06-20 01:57:25.952865', cycles: 39133 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 01:57:25.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 36613,
                },
                forecast: { cycles: 20867, hours: 10016.16 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-07 19:15:25.952865', cycles: 17868 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 19:15:25.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 15286,
                },
                forecast: { cycles: 42132, hours: 20223.36 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station9 Robot1',
        deviceHealth: 94.5,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 97.8,
                lastChange: { time: '2021-07-13 18:07:01.952865', cycles: 10725 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 18:07:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 1087,
                },
                forecast: { cycles: 49275, hours: 23652.0 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-07 16:51:25.952865', cycles: 17988 },
                history: {
                    events: [
                        {
                            summary: '2021-07-07 16:51:25.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 9441,
                },
                forecast: { cycles: 42012, hours: 20165.76 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-10 21:04:37.952865', cycles: 14177 },
                history: {
                    events: [
                        {
                            summary: '2021-07-10 21:04:37.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 13342,
                },
                forecast: { cycles: 45823, hours: 21995.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-19 11:44:13.952865', cycles: 39844 },
                history: {
                    events: [
                        {
                            summary: '2021-06-19 11:44:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 38020,
                },
                forecast: { cycles: 20156, hours: 9674.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-09 13:52:37.952865', cycles: 15737 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 13:52:37.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 13991,
                },
                forecast: { cycles: 44263, hours: 21246.24 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station9 Robot4',
        deviceHealth: 91.4,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.1,
                lastChange: { time: '2021-07-13 19:17:49.952865', cycles: 10666 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 19:17:49.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 3428,
                },
                forecast: { cycles: 49334, hours: 23680.32 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-28 19:39:25.952865', cycles: 28648 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 19:39:25.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 21419,
                },
                forecast: { cycles: 31352, hours: 15048.96 },
            },
        ],
    },
    {
        deviceName: 'Line5 Station9 Robot5',
        deviceHealth: 90.9,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.4,
                lastChange: { time: '2021-06-19 11:14:13.952865', cycles: 39869 },
                history: {
                    events: [
                        {
                            summary: '2021-06-19 11:14:13.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 39190,
                },
                forecast: { cycles: 20131, hours: 9662.88 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.0,
                lastChange: { time: '2021-07-02 00:10:37.952865', cycles: 24822 },
                history: {
                    events: [
                        {
                            summary: '2021-07-02 00:10:37.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 23649,
                },
                forecast: { cycles: 35178, hours: 16885.44 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.8,
                lastChange: { time: '2021-07-06 08:44:13.952865', cycles: 19594 },
                history: {
                    events: [
                        {
                            summary: '2021-07-06 08:44:13.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 13006,
                },
                forecast: { cycles: 40406, hours: 19394.88 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.5,
                lastChange: { time: '2021-06-23 11:43:01.952865', cycles: 35045 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 11:43:01.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 33239,
                },
                forecast: { cycles: 24955, hours: 11978.4 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station3 Robot1',
        deviceHealth: 90.4,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.2,
                lastChange: { time: '2021-06-20 15:01:01.952865', cycles: 38480 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 15:01:01.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 31928,
                },
                forecast: { cycles: 21520, hours: 10329.6 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 97.2,
                lastChange: { time: '2021-07-01 21:45:25.952865', cycles: 24943 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 21:45:25.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 23244,
                },
                forecast: { cycles: 35057, hours: 16827.36 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station3 Robot2',
        deviceHealth: 95.0,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.1,
                lastChange: { time: '2021-07-01 05:01:01.952865', cycles: 25780 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 05:01:01.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 19112,
                },
                forecast: { cycles: 34220, hours: 16425.6 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 97.2,
                lastChange: { time: '2021-06-21 09:55:01.952865', cycles: 37535 },
                history: {
                    events: [
                        {
                            summary: '2021-06-21 09:55:01.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 27828,
                },
                forecast: { cycles: 22465, hours: 10783.2 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.7,
                lastChange: { time: '2021-07-13 04:05:49.952865', cycles: 11426 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 04:05:49.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 3710,
                },
                forecast: { cycles: 48574, hours: 23315.52 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station3 Robot4',
        deviceHealth: 93.6,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.2,
                lastChange: { time: '2021-07-09 08:51:25.952865', cycles: 15988 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 08:51:25.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 12520,
                },
                forecast: { cycles: 44012, hours: 21125.76 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.1,
                lastChange: { time: '2021-07-12 04:31:01.952865', cycles: 12605 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 04:31:01.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 12441,
                },
                forecast: { cycles: 47395, hours: 22749.6 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.0,
                lastChange: { time: '2021-07-08 20:01:01.952865', cycles: 16630 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 20:01:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 16499,
                },
                forecast: { cycles: 43370, hours: 20817.6 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.5,
                lastChange: { time: '2021-06-28 19:02:13.952865', cycles: 28679 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 19:02:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 18990,
                },
                forecast: { cycles: 31321, hours: 15034.079999999998 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.9,
                lastChange: { time: '2021-07-08 03:15:25.952865', cycles: 17468 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 03:15:25.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 14949,
                },
                forecast: { cycles: 42532, hours: 20415.36 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station3 Robot5',
        deviceHealth: 94.5,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.6,
                lastChange: { time: '2021-06-19 08:56:13.952865', cycles: 39984 },
                history: {
                    events: [
                        {
                            summary: '2021-06-19 08:56:13.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 35065,
                },
                forecast: { cycles: 20016, hours: 9607.68 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.9,
                lastChange: { time: '2021-07-10 19:59:49.952865', cycles: 14231 },
                history: {
                    events: [
                        {
                            summary: '2021-07-10 19:59:49.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 8437,
                },
                forecast: { cycles: 45769, hours: 21969.12 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station8 Robot1',
        deviceHealth: 90.2,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.1,
                lastChange: { time: '2021-06-24 00:38:13.952865', cycles: 34399 },
                history: {
                    events: [
                        {
                            summary: '2021-06-24 00:38:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 34283,
                },
                forecast: { cycles: 25601, hours: 12288.48 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.0,
                lastChange: { time: '2021-07-02 18:33:25.952865', cycles: 23903 },
                history: {
                    events: [
                        {
                            summary: '2021-07-02 18:33:25.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 23903,
                },
                forecast: { cycles: 36097, hours: 17326.56 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.7,
                lastChange: { time: '2021-06-26 08:34:37.952865', cycles: 31602 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 08:34:37.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 24127,
                },
                forecast: { cycles: 28398, hours: 13631.04 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station8 Robot2',
        deviceHealth: 93.0,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.9,
                lastChange: { time: '2021-07-12 22:34:37.952865', cycles: 11702 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 22:34:37.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 11079,
                },
                forecast: { cycles: 48298, hours: 23183.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 95.1,
                lastChange: { time: '2021-06-24 12:52:37.952865', cycles: 33787 },
                history: {
                    events: [
                        {
                            summary: '2021-06-24 12:52:37.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 28999,
                },
                forecast: { cycles: 26213, hours: 12582.24 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station8 Robot4',
        deviceHealth: 94.6,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.6,
                lastChange: { time: '2021-06-22 13:20:13.952865', cycles: 36164 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 13:20:13.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 26678,
                },
                forecast: { cycles: 23836, hours: 11441.28 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station8 Robot5',
        deviceHealth: 93.9,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 95.5,
                lastChange: { time: '2021-07-09 11:41:49.952865', cycles: 15846 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 11:41:49.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 7759,
                },
                forecast: { cycles: 44154, hours: 21193.92 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 96.8,
                lastChange: { time: '2021-07-05 17:09:25.952865', cycles: 20373 },
                history: {
                    events: [
                        {
                            summary: '2021-07-05 17:09:25.952865 - TH 1 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 13761,
                },
                forecast: { cycles: 39627, hours: 19020.96 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.4,
                lastChange: { time: '2021-06-22 16:53:49.952865', cycles: 35986 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 16:53:49.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 31270,
                },
                forecast: { cycles: 24014, hours: 11526.72 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station9 Robot1',
        deviceHealth: 91.9,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 96.4,
                lastChange: { time: '2021-06-25 08:53:49.952865', cycles: 32786 },
                history: {
                    events: [
                        {
                            summary: '2021-06-25 08:53:49.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 27004,
                },
                forecast: { cycles: 27214, hours: 13062.72 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.4,
                lastChange: { time: '2021-07-04 10:28:37.952865', cycles: 21907 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 10:28:37.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 21039,
                },
                forecast: { cycles: 38093, hours: 18284.64 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.1,
                lastChange: { time: '2021-07-01 02:38:13.952865', cycles: 25899 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 02:38:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 23932,
                },
                forecast: { cycles: 34101, hours: 16368.48 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.1,
                lastChange: { time: '2021-07-02 13:20:13.952865', cycles: 24164 },
                history: {
                    events: [
                        {
                            summary: '2021-07-02 13:20:13.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 14398,
                },
                forecast: { cycles: 35836, hours: 17201.28 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station9 Robot2',
        deviceHealth: 94.6,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.7,
                lastChange: { time: '2021-06-23 10:27:25.952865', cycles: 35108 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 10:27:25.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 28877,
                },
                forecast: { cycles: 24892, hours: 11948.16 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.5,
                lastChange: { time: '2021-07-12 22:04:37.952865', cycles: 11727 },
                history: {
                    events: [
                        {
                            summary: '2021-07-12 22:04:37.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 3005,
                },
                forecast: { cycles: 48273, hours: 23171.04 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.0,
                lastChange: { time: '2021-07-13 08:59:49.952865', cycles: 11181 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 08:59:49.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 2235,
                },
                forecast: { cycles: 48819, hours: 23433.12 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 95.8,
                lastChange: { time: '2021-07-03 12:05:49.952865', cycles: 23026 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 12:05:49.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 15247,
                },
                forecast: { cycles: 36974, hours: 17747.52 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.8,
                lastChange: { time: '2021-06-26 22:14:13.952865', cycles: 30919 },
                history: {
                    events: [
                        {
                            summary: '2021-06-26 22:14:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 21224,
                },
                forecast: { cycles: 29081, hours: 13958.88 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station9 Robot4',
        deviceHealth: 91.5,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 97.7,
                lastChange: { time: '2021-07-13 15:46:37.952865', cycles: 10842 },
                history: {
                    events: [
                        {
                            summary: '2021-07-13 15:46:37.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 6564,
                },
                forecast: { cycles: 49158, hours: 23595.84 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 97.4,
                lastChange: { time: '2021-07-04 07:07:01.952865', cycles: 22075 },
                history: {
                    events: [
                        {
                            summary: '2021-07-04 07:07:01.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 16350,
                },
                forecast: { cycles: 37925, hours: 18204.0 },
            },
        ],
    },
    {
        deviceName: 'Line6 Station9 Robot5',
        deviceHealth: 93.4,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.6,
                lastChange: { time: '2021-07-08 20:27:25.952865', cycles: 16608 },
                history: {
                    events: [
                        {
                            summary: '2021-07-08 20:27:25.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 11597,
                },
                forecast: { cycles: 43392, hours: 20828.16 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 12',
                componentHealth: 96.7,
                lastChange: { time: '2021-07-03 09:51:25.952865', cycles: 23138 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 09:51:25.952865 - TF 12 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 21088,
                },
                forecast: { cycles: 36862, hours: 17693.760000000002 },
            },
        ],
    },
    {
        deviceName: 'Line7 Station11 Robot7',
        deviceHealth: 92.1,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 96.3,
                lastChange: { time: '2021-07-09 10:52:37.952865', cycles: 15887 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 10:52:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 14093,
                },
                forecast: { cycles: 44113, hours: 21174.24 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 96.5,
                lastChange: { time: '2021-06-20 14:02:13.952865', cycles: 38529 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 14:02:13.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 36529,
                },
                forecast: { cycles: 21471, hours: 10306.08 },
            },
        ],
    },
    {
        deviceName: 'Line7 Station5 Robot1',
        deviceHealth: 93.9,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 1',
                componentHealth: 97.0,
                lastChange: { time: '2021-06-19 20:21:25.952865', cycles: 39413 },
                history: {
                    events: [
                        {
                            summary: '2021-06-19 20:21:25.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 33321,
                },
                forecast: { cycles: 20587, hours: 9881.76 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 97.6,
                lastChange: { time: '2021-07-03 14:20:13.952865', cycles: 22914 },
                history: {
                    events: [
                        {
                            summary: '2021-07-03 14:20:13.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 14329,
                },
                forecast: { cycles: 37086, hours: 17801.28 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.7,
                lastChange: { time: '2021-07-09 11:50:13.952865', cycles: 15839 },
                history: {
                    events: [
                        {
                            summary: '2021-07-09 11:50:13.952865 - TH 510 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 14311,
                },
                forecast: { cycles: 44161, hours: 21197.28 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TF 21',
                componentHealth: 96.9,
                lastChange: { time: '2021-07-01 04:32:13.952865', cycles: 25804 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 04:32:13.952865 - TF 21 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 18841,
                },
                forecast: { cycles: 34196, hours: 16414.079999999998 },
            },
        ],
    },
    {
        deviceName: 'Line7 Station5 Robot2',
        deviceHealth: 91.4,
        components: [
            {
                outlet: 'Outlet 1',
                componentName: 'TH 510',
                componentHealth: 95.1,
                lastChange: { time: '2021-06-23 01:31:01.952865', cycles: 35555 },
                history: {
                    events: [
                        {
                            summary: '2021-06-23 01:31:01.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 25847,
                },
                forecast: { cycles: 24445, hours: 11733.6 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TH 1',
                componentHealth: 95.4,
                lastChange: { time: '2021-06-20 11:50:13.952865', cycles: 38639 },
                history: {
                    events: [
                        {
                            summary: '2021-06-20 11:50:13.952865 - TH 1 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 29708,
                },
                forecast: { cycles: 21361, hours: 10253.28 },
            },
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.2,
                lastChange: { time: '2021-06-22 02:46:37.952865', cycles: 36692 },
                history: {
                    events: [
                        {
                            summary: '2021-06-22 02:46:37.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 29469,
                },
                forecast: { cycles: 23308, hours: 11187.84 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 21',
                componentHealth: 97.6,
                lastChange: { time: '2021-06-28 09:49:01.952865', cycles: 29140 },
                history: {
                    events: [
                        {
                            summary: '2021-06-28 09:49:01.952865 - TF 21 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 25918,
                },
                forecast: { cycles: 30860, hours: 14812.8 },
            },
            {
                outlet: 'Outlet 1',
                componentName: 'TF 12',
                componentHealth: 96.4,
                lastChange: { time: '2021-07-01 00:17:49.952865', cycles: 26016 },
                history: {
                    events: [
                        {
                            summary: '2021-07-01 00:17:49.952865 - TF 12 component changed',
                            eventType: ' component changed',
                        },
                    ],
                    currentCycles: 18009,
                },
                forecast: { cycles: 33984, hours: 16312.32 },
            },
        ],
    },
    {
        deviceName: 'Line7 Station5 Robot3',
        deviceHealth: 92.0,
        components: [
            {
                outlet: 'Outlet 2',
                componentName: 'TH 510',
                componentHealth: 95.5,
                lastChange: { time: '2021-06-29 07:49:01.952865', cycles: 28040 },
                history: {
                    events: [
                        {
                            summary: '2021-06-29 07:49:01.952865 - TH 510 component repaired',
                            eventType: ' component repaired',
                        },
                    ],
                    currentCycles: 18287,
                },
                forecast: { cycles: 31960, hours: 15340.8 },
            },
        ],
    },
];

const deviceNames = [
    'Line7Station11Robot7',
    'Line7Station5Robot2',
    'Line7Station5Robot1',
    'Line4Station4Robot1',
    'Line4Station4Robot4',
    'Line4Station4Robot2',
    'Line4Station4Robot3',
    'Line4Station7Robot5',
    'Line4Station7Robot3',
    'Line4Station7Robot2',
    'Line4Station7Robot4',
    'Line4Station7Robot6',
    'Line6Station8Robot5',
    'Line6Station8Robot4',
    'Line6Station8Robot2',
    'Line6Station8Robot1',
    'Line5Station10Robot2',
    'Line5Station10Robot3',
    'Line5Station10Robot5',
    'Line2Station2Robot4',
    'Line2Station2Robot2',
    'Line2Station2Robot3',
    'Line6Station9Robot1',
    'Line4Station6Robot5',
    'Line4Station6Robot4',
    'Line4Station6Robot2',
    'Line4Station6Robot6',
    'Line4Station6Robot3',
    'Line5Station8Robot1',
    'Line5Station5Robot2',
    'Line5Station8Robot5',
    'Line5Station5Robot3',
    'Line6Station9Robot5',
    'Line6Station9Robot4',
    'Line6Station9Robot2',
    'Line6Station3Robot1',
    'Line6Station3Robot2',
    'Line6Station3Robot4',
    'Line6Station3Robot5',
    'Line7Station5Robot3',
    'Line3Station2Robot4',
    'Line1Station1Robot1',
    'Line1Station1Robot2',
    'Line5Station5Robot5',
    'Line5Station9Robot1',
    'Line5Station9Robot5',
    'Line3Station3Robot4',
    'Line5Station9Robot4',
    'Line4Station5Robot1',
    'Line4Station5Robot4',
    'Line4Station5Robot2',
    'Line4Station5Robot3',
    'Line5Station8Robot4',
    'Line8Station13Robot2',
    'Line8Station13Robot3',
    'Line8Station13Robot4',
    'Line8Station2Robot1',
    'Line8Station2Robot3',
    'Line8Station7Robot1',
    'Line8Station7Robot3',
    'Line8Station5Robot1',
    'Line8Station5Robot3',
    'Line8Station6Robot1',
    'Line8Station6Robot3',
    'Line8Station16Robot2',
    'Line8Station16Robot3',
    'Line8Station16Robot4',
    'Line8Station16Robot1',
    'Line8Station15Robot1',
    'Line8Station15Robot3',
    'Line8Station15Robot2',
];

export const data = deviceNames.reduce((acc, item, index) => {
    const { deviceName, ...rest } = data1[index % data1.length];
    acc.push(data1[index % data1.length]);
    acc.push({
        deviceName: item,
        ...rest,
    });
    return acc;
}, [] as any[]);

export const maintenanceData = data.reduce((acc: Map<string, any>, row) => {
    if (!acc) {
        acc = new Map<string, any>();
    }
    const name = row.deviceName.replace(' Robot', 'Robot');
    acc.set(name, row);

    return acc;
}, new Map<string, any>());

export default maintenanceData;
