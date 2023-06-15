import { Settingss } from 'models';
import moment from 'moment';

export const data: Settingss | any[] = [
    // this is demo data... replace with real mock data for model
    {
        id: '1',
        type: 'break',
        operationName: 'My break',
        startTime: moment(),
        endTime: moment(),
        startDate: moment(),
        endDate: moment(),
    },
    {
        id: '2',
        type: 'shift',
        operationName: 'My shift',
        startTime: moment(),
        endTime: moment(),
        startDate: moment(),
        endDate: moment(),
    },
    {
        id: '3',
        type: 'shift',
        operationName: 'My second shift',
        startTime: moment(),
        endTime: moment(),
        startDate: moment(),
        endDate: moment(),
    },
];

export default data;
