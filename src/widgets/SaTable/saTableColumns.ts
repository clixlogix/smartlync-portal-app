interface Columns {
    name: string;
    minWidth: number;
    type: string;
}

export const initialColumns: Columns[] = [
    {
        name: 'station',
        minWidth: 300,
        type: 'string',
    },
    {
        name: 'meanUptime',
        minWidth: 350,
        type: 'number',
    },
    {
        name: 'deviationUptime',
        minWidth: 400,
        type: 'number',
    },
    {
        name: 'maxUptime',
        minWidth: 350,
        type: 'number',
    },
    {
        name: 'totalUptime',
        minWidth: 350,
        type: 'number',
    },
    {
        name: 'downtime',
        minWidth: 320,
        type: 'number',
    },
    {
        name: 'TA',
        minWidth: 300,
        type: 'number',
    },
];
