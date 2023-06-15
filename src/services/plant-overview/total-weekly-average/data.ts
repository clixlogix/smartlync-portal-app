import { PlantCycleAveragesCardName } from 'models';
// import { getNumber } from 'utils';

export const data: any = [
    {
        name: PlantCycleAveragesCardName.TA,
        toolTip: 'PlantOverview.TechnicalAvailability',
        value: 'NA',
        unit: '',
        trendValueUnit: '',
        trend: true,
        trendValue: 'NA',
        bs1: '99.81',
        bs2: '99.33',
        bodyShops: [
            { name: 'E', value: 'NA', unit: '' },
            { name: 'S', value: 'NA', unit: '' },
        ],
    },
    {
        name: PlantCycleAveragesCardName.MTTR,
        toolTip: 'PlantOverview.MeanTimeToRepair',
        value: 'NA',
        unit: '',
        trendValueUnit: `(Time in min)`,
        trend: false,
        trendValue: 'NA',
        bodyShops: [
            { name: 'E', value: 'NA', unit: '' },
            { name: 'S', value: 'NA', unit: '' },
        ],
    },
    {
        name: PlantCycleAveragesCardName.MTBF,
        toolTip: 'PlantOverview.MeanTimeBetweenFailure',
        value: 'NA',
        unit: '',
        trendValueUnit: `(Time in hr)`,
        trend: false,
        trendValue: 'NA',
        bs1: '0.83',
        bs2: '0.89',
        bodyShops: [
            { name: 'E', value: 'NA', unit: '' },
            { name: 'S', value: 'NA', unit: '' },
        ],
    },
];

// export const data: TotalWeeklyAverages = updateWeeklyAverageWithValues({ ta: 0, mttr: 0, mtbf: 0, mttf: 0 });

export default data;
