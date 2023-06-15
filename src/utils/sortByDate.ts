import moment from 'moment';

export const sortByDate = <T>(data: T[]): [T[], number] => {
    const sortedArr = data.sort((prev, next) => {
        return moment(prev).valueOf() - moment(next).valueOf();
    });
    return [sortedArr, sortedArr.length];
};
