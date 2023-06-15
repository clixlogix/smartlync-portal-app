import { CycleGapMetaDatas } from 'models';

export const data: CycleGapMetaDatas | any[] = [];
// Refer OPTIMA-1832, 2803
export const convertGraphicalDataToTimerSeries = (data, dateTime) =>
    data?.dataY?.map((dataY: number, index: number) => {
        const sampleTime = data.sampleTime;
        const referenceIndex = data.referenceIndex;
        const xDataPoint = dateTime + (index - referenceIndex) * sampleTime * 0.001;
        return [xDataPoint, dataY];
    });

export default data;
