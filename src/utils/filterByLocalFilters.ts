import { Filters, Lifts, Penetrations, Voltages, WeldTimes } from 'models';
import moment from 'moment';

export const filterByLocalFilters = <T>(data: T[] | undefined, filters: Filters = {}): T[] | undefined => {
    const filterKeys = Object.keys(filters);

    if (Array.isArray(data)) {
        return data.filter((item) => {
            return filterKeys.every((filter) => {
                if (!filters[filter]) {
                    return true;
                }
                return filters[filter].toString() === item[filter]?.toString();
            });
        });
    }

    return data;
};

type ControlChart = Penetrations | Voltages | WeldTimes | Lifts | undefined;

export const filterControlChartByLocalFilters = <T extends ControlChart>(data: T, filters: Filters = {}): T => {
    if (data && !Object.keys(data).length) {
        return data;
    }

    const arrOfIndexes: any = [];
    const maximum: any = [];
    const minimum: any = [];
    const actual: any = [];
    const occurredOn: any = [];

    const arrOfWeeks = data?.occurredOn?.map((item) => {
        return moment(item).isoWeek();
    });

    arrOfWeeks?.forEach((item, idx) => {
        if (item?.toString() === filters?.week?.toString()) {
            arrOfIndexes.push(idx);
        }
    });

    if (data?.maximum && data?.minimum && data?.actual && data?.occurredOn) {
        for (let i = 0; i < data.maximum.length; i++) {
            if (arrOfIndexes.length === 0) {
                return data;
            }
            if (arrOfIndexes.includes(i)) {
                data.maximum[i] && maximum.push(data.maximum[i]);
                data.minimum[i] && minimum.push(data.minimum[i]);
                data.actual[i] && actual.push(data.actual[i]);
                data.occurredOn[i] && occurredOn.push(data.occurredOn[i]);
                arrOfIndexes.splice(i, 1);
            }
        }
    }

    const availableFilters = Object.values(filters).filter((item) => item !== undefined);

    return availableFilters.length
        ? ({
              maximum,
              minimum,
              actual,
              occurredOn,
          } as T)
        : data;
};
