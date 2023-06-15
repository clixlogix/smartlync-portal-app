import { forEach } from 'lodash/forEach';
import { useCallback, useRef } from 'react';
import util from 'util';
import moment from 'moment';
import words from 'lodash/words';
import toLower from 'lodash/toLower';
import get from 'lodash/get';
import { FilterNames, Filters } from 'models';
import {
    DashboardFilter,
    DashboardFilterData,
    DashboardFilters,
} from 'components/panels/SideFilterPanel/SideFilterPanel';
import i18n from 'locales/i18n';
import { SystemType } from 'constants/staticValues';
import { getCommonPageFlters } from './localStorage/index';

import Constants, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import { Tenants, defaultDateConfig, Pages } from 'constants/defaultDateConfig';

export * from './redux-injectors';
export * from './request';
export * from './loadable';

export * from './hooks/use-local-storage';
export * from './hooks/use-query-param';
export { default as useUrlQueryParam } from './hooks/use-url-query-param';
export * as _ from 'lodash';

export const types = util.types;

/**
 *
 *
 * @export
 * @param {string} [str='']
 * @returns {string}
 */
export const convertPropNameToLowerCamelcase = (str: string = ''): string => {
    return str ? `${str.charAt(0).toLowerCase()}${str.substr(1)}` : str;
};

/**
 *
 * @param weekDayNo
 * @returns
 */
export const getWeekDayNumber = (weekDayNo): number => {
    return weekDayNo;
};

/**
 *
 *
 * @export
 * @param {*} date
 * @returns {boolean}
 */
export const isDate = (date: any): boolean => {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
};

/**
 *
 *
 * @export
 * @param {number} [bytes=0]
 * @param {number} [decimalPoint=1]
 * @returns [{number}, {string} ]
 */
export const formatFileSize = (bytes: number = 0, decimalPoint: number = 1) => {
    if (bytes === 0) return [0, 'Bytes'];

    const k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) as number, sizes[i] as string];
};

/*!
 * Build a query string from an object of data
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Object} data The data to turn into a query string
 * @return {String}      The query string
 */
export const buildQuery = (data: any = {}, ignoreEmpty: boolean = false): string => {
    if (typeof data === 'string') {
        return data;
    }

    const query = [];

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && ignoreEmpty && data[key] !== undefined) {
            // @ts-ignore
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        }
    }
    return query.join('&');
};

/**
 *
 *
 * @param {number} [delay=0]
 * @returns
 */
export function sleep(delay = 0): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

/**
 * Debounce a function by time
 * @param {Function} func
 * @param {Number} delay
 */
export const useDebounce = (func, delay = 500) => {
    const debounce = useRef(null);

    return useCallback(
        (...args) => {
            const context = this;
            if (debounce) {
                // @ts-ignore
                clearTimeout(debounce.current);
                // @ts-ignore
                debounce.current = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            }
        },
        [func, delay],
    );
};

/**
 *
 *
 * @export buildFiltersFromData
 * @param {DashboardFilter[]} data
 * @returns {Filters}
 */
export const buildFiltersFromData = (data: DashboardFilter[]): Filters => {
    return data
        .map((i: DashboardFilter) => i.data)
        .reduce((acc: Filters, item: DashboardFilterData) => {
            const filterNames: string[] = Object.keys(FilterNames);
            acc = {
                ...acc,
                ...Object.entries(item).reduce((a: Filters, [key, value]) => {
                    if (filterNames.includes(key)) {
                        a[key] = value;
                    }
                    return a;
                }, {} as Filters),
            };
            return acc;
        }, {} as Filters);
};

/**
 *
 *
 * @export buildAvailableFiltersFromData
 * @param {any[]} data
 * @returns {DashboardFilter[]}
 */
export const buildAvailableFiltersFromData = (data: any[]): DashboardFilter[] => {
    return Array.from(
        data
            .reduce((acc: DashboardFilters, item: DashboardFilter) => {
                acc.set(item.name as FilterNames, item);
                return acc;
            }, new DashboardFilters())
            .values(),
    );
};

/**
 *
 *
 * @export isDemoTenant
 * @returns {boolean}
 */
export const isDemoTenant = (): boolean => {
    const href = window.location.href?.toLocaleLowerCase();

    return href.includes('demo') || href.includes('v1daimler');
};

/**
 *
 *
 * @export isDemoTnt
 * @returns {boolean}
 */
export const isDemoTnt = (): boolean =>
    window.location.href?.toLocaleLowerCase().includes('jlr') ||
    window.location.href?.toLocaleLowerCase().includes('demo');

/**
 *
 *
 * @export isHidden
 * @returns {boolean}
 */
export const isHidden = (tenants: string[]): boolean => {
    let href = window.location.href.replace('http://', '').replace('https://', '').split('.')[0]?.toLocaleLowerCase();
    const environment = window.location.href
        .replace('http://', '')
        .replace('https://', '')
        .split('.')[1]
        .toLocaleLowerCase();
    href = href === 'demo' && environment === 'stage' ? 'demoStage' : href;

    return tenants.includes(href);
};

/**
 *
 *
 * @export getFilterParams
 * @param {FilterNames[]} [filterNames=[]]
 * @param {Filters} [params={}]
 * @returns {Filters}
 */
export const getFilterParams = (filterNames: FilterNames[] = [], params: Filters = {}): Filters => {
    return filterNames.reduce(
        (acc: Filters = {}, name: FilterNames) => ({ ...acc, [name]: params[name] }),
        {} as Filters,
    );
};

/**
 *
 * @param arr {Array<any>}
 * @param rows {number}
 * @returns Array<Array<any>>
 */
export const splitArray = (arr: Array<any>, rows: number): any[][] => {
    const itemsPerRow = Math.ceil(arr.length / rows);

    return arr.reduce((acc, val, ind) => {
        const currentRow = Math.floor(ind / itemsPerRow);

        if (!acc[currentRow]) {
            acc[currentRow] = [val];
        } else {
            acc[currentRow].push(val);
        }

        return acc;
    }, []);
};

/**
 *
 *
 * @export
 * @param {Filters} filters
 * @returns {Filters}
 */
export const getLineFromCarclass = (filters: Filters): Filters => {
    let { carType, line = '', ...rest } = filters as any;

    const lines = new Set<string>(!line ? [] : line.split(','));

    switch (carType) {
        case '0':
            lines.add('213,223');
            break;
        case '1':
            lines.add('213');
            break;
        case '2':
            lines.add('223');
            break;
        default:
            break;
    }

    return { ...rest, line: Array.from(lines).join(',') };
};

/**
 *
 *
 * @export
 * @param {number} num
 * @param {*} [{}]
 * @returns
 */
export const cleanEmptyKeyParams = (obj: Filters): Filters => {
    for (var propName in obj) {
        if (
            obj[propName] === null ||
            obj[propName] === undefined ||
            obj[propName] === '' ||
            obj[propName] === [] ||
            obj[propName] === {}
        ) {
            delete obj[propName];
        }
    }
    return obj;
};

/**
 *
 *
 * @export
 * @param {number} num
 * @param {*} [options={}]
 * @returns
 */
export const formatNumber = (num: number, options: any = {}) =>
    new Intl.NumberFormat(i18n.language, {
        // maximumSignificantDigits: 2,
        maximumFractionDigits: 2,
        ...options,
    }).format(num);

/*
  update MOMENT to include extra functions
*/
declare module 'moment' {
    export interface Moment {
        toHours(): number;
    }
}

(moment.fn as any).toHours = function () {
    const _self = this as moment.Moment;
    return _self.unix() / 3600;
};

/**
 *
 *
 * @export
 * @param {any} value
 * @returns {Number}
 */
export const getNumber = (value: any): number => {
    if (value && Number.isFinite(value)) {
        const number = Number.isInteger(+value) ? +value : +(+value.toFixed(2));
        return number;
    }
    return 0;
};

/**
 *
 *
 * @export
 * @param {any} value
 * @returns {any}
 */
export const getYearWeek = (value: any, formatString: any = 'MM/DD/YYYY([W]WW)'): any => {
    const splitRange = value.split('-');
    const fromWeek = moment(splitRange[0], formatString).clone().format('YYYYWW');
    const toWeek = moment(splitRange[1], formatString).clone().format('YYYYWW');
    return { fromWeek, toWeek };
};

/**
 *
 *
 * @export
 * @param {any} value
 * @returns {any}
 */
export const getMultipleYearWeek = (value: any, formatString: any = 'MM/DD/YYYY([W]WW)'): any => {
    const splitWeekRange = value.split(',');
    const fromWeek: any = [];
    const toWeek: any = [];
    splitWeekRange.forEach((item) => {
        const splitRange = item.split('-');
        fromWeek.push(moment(splitRange[0], formatString).clone().format('YYYYWW'));
        toWeek.push(moment(splitRange[1], formatString).clone().format('YYYYWW'));
    });
    return { fromWeek: fromWeek.join(','), toWeek: toWeek.join(',') };
};

export const getKeyByValue = (object, value): any => {
    return Object.keys(object).find((key) => object[key] === value);
};

export const getDefaultFilterDate = (page: Pages) => {
    const href = toLower(window.location.href);
    const tenant = words(href)[1] as Tenants;
    const systemType = (localStorage.getItem(Constants.storageKeys.systemType) || SystemType.SWS) as SystemType;
    const defaultDate = get(defaultDateConfig, [tenant, page, systemType]);
    //   return defaultDate || moment().format(API_REQUEST_DATE_FORMAT);
    // use persisted date only for JLR tenant
    const commonPageFilters = getCommonPageFlters();
    const toTime = get(commonPageFilters, [FilterNames.toTime], '');
    return (
        defaultDate ||
        (toTime && tenant === Tenants.JLR
            ? moment(toTime).format(API_REQUEST_DATE_FORMAT)
            : moment().format(API_REQUEST_DATE_FORMAT))
    );
};
