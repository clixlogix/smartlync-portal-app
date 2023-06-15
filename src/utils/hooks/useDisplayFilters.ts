import { DashboardFilter, FilterType } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { useMemo } from 'react';

export const useDisplayFilters = (availableFilters, values) => {
    return useMemo(() => {
        if (!values) {
            return availableFilters?.filter((filter: DashboardFilter) => !filter.hidden);
        }

        return availableFilters?.reduce((acc: DashboardFilter[], filter: DashboardFilter) => {
            if (!filter.hidden) {
                if (!!values[filter.name]) {
                    switch (filter.type) {
                        case FilterType.Select:
                            const options: string[] = Array.from(values[filter.name]);
                            if (options.length > 0) {
                                filter.data = { ...filter.data, options };
                            }
                            break;
                        default:
                            break;
                    }
                }
                acc.push(filter);
            }
            return acc;
        }, [] as DashboardFilter[]);
    }, [availableFilters, values]);
};
