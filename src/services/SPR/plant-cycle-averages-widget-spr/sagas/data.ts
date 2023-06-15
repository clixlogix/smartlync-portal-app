import { PlantCycleAveragesCardName, TotalWeeklyAverages } from 'models';
import { getNumber } from 'utils';
import { camelCase } from 'lodash';

export const updateWeeklyAverageWithValues = (data: any) => {
    const { totalWeeklyAverages, carTypes } = data;

    let taArray: any = [];
    let mttrArray: any = [];
    let mtbfArray: any = [];

    if (!totalWeeklyAverages) {
        return [];
    }

    for (const [key, value] of Object.entries(totalWeeklyAverages)) {
        if (value) {
            for (let i = 1; i < carTypes.length; i++) {
                if (camelCase(carTypes[i].name) === key) {
                    taArray.push({
                        name: carTypes[i].name,
                        value: getNumber(value?.ta) || 'NA',
                        unit: '',
                    });
                    mttrArray.push({
                        name: carTypes[i].name,
                        value: getNumber(value?.mttr) || 'NA',
                        unit: '',
                    });
                    mtbfArray.push({
                        name: carTypes[i].name,
                        value: getNumber(value?.mtbf) || 'NA',
                        unit: '',
                    });
                }
            }
        }
    }

    const result = [
        {
            name: PlantCycleAveragesCardName.TA,
            toolTip: 'PlantOverview.TechnicalAvailability',
            value: totalWeeklyAverages?.allClasses?.ta?.toFixed(2) || 0,
            unit: '%',
            trendValueUnit: `(Rate in %)`,
            trend: Math.sign(+totalWeeklyAverages?.allClasses?.changeTa?.toFixed(2)) !== -1,
            trendValue: Math.abs(+totalWeeklyAverages?.allClasses?.changeTa?.toFixed(2)) || 0,
            bodyShops: taArray,
        },
        {
            name: PlantCycleAveragesCardName.MTTR,
            toolTip: 'PlantOverview.MeanTimeToRepair',
            value: totalWeeklyAverages?.allClasses?.mttr?.toFixed(2) || 0,
            unit: 'm',
            trendValueUnit: `(Time in m)`,
            trend: Math.sign(+totalWeeklyAverages?.allClasses?.changeMttr?.toFixed(2)) !== -1,
            trendValue: Math.abs(+totalWeeklyAverages?.allClasses?.changeMttr?.toFixed(2)) || 0,
            bodyShops: mttrArray,
        },
        {
            name: PlantCycleAveragesCardName.MTBF,
            toolTip: 'PlantOverview.MeanTimeBetweenFailure',
            value: totalWeeklyAverages?.allClasses?.mtbf?.toFixed(2) || 0,
            unit: 'h',
            trendValueUnit: `(Time in h)`,
            trend: Math.sign(+totalWeeklyAverages?.allClasses?.changeMtbf?.toFixed(2)) !== -1,
            trendValue: Math.abs(+totalWeeklyAverages?.allClasses?.changeMtbf?.toFixed(2)) || 0,
            bodyShops: mtbfArray,
        },
    ] as TotalWeeklyAverages;

    return [...result];
};

export const data: TotalWeeklyAverages = updateWeeklyAverageWithValues({ ta: 0, mttr: 0, mtbf: 0, mttf: 0 });

export default data;
