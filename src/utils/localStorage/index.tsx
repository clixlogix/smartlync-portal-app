import { storageKeys } from 'constants/index';
import { Filters } from 'models';

export const setCommonPageFlters = (filters: Filters): void => {
    filters && localStorage.setItem(storageKeys.commonPageFilters, JSON.stringify(filters));
};

export const getCommonPageFlters = (): Filters => {
    const storedFilters = localStorage.getItem(storageKeys.commonPageFilters);
    return JSON.parse(storedFilters || '{}');
};
