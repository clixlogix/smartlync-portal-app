import moment, { Moment } from 'moment';

export const formatDate = (startTime: Moment, endTime: Moment, startDate: Moment, endDate: Moment) => {
    const startHour = moment(startTime).hours();
    const startMinute = moment(startTime).minutes();
    const endHour = moment(endTime).hours();
    const endMinute = moment(endTime).minutes();
    const start = moment(startDate).set({ hour: startHour, minute: startMinute, second: 0 });
    const end = moment(endDate).set({ hour: endHour, minute: endMinute, second: 0 });

    return [start, end];
};
