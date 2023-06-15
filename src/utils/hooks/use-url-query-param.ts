// useQueryParam.ts

import { Filters } from 'models';
import { useState } from 'react';

/*
    Usage:
        const [search, setSearch] = useUrlQueryParam('search', {});
*/

/**
 *
 *
 * @export
 * @returns
 */
export function getQuery() {
    if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
}

/**
 *
 *
 * @export
 * @template T
 * @param {string} key
 * @returns {(T | null)}
 */
export function getQueryStringVal<Filters>(key: string, defaultVal: Filters): Filters {
    // get values from local storage
    const svalues = { ...defaultVal, ...JSON.parse(window.localStorage.getItem(key) || '{}') };

    Array.from(getQuery().entries()).forEach(([k, v]) => {
        svalues[k] = !v || v === 'null' ? undefined : v;
    });

    window.localStorage.setItem(key, JSON.stringify(svalues));

    return svalues;
}

/**
 *
 *
 * @export
 * @template T
 * @param {string} key
 * @param {T} val
 */
export function putQueryStringVal(key: string, val: Filters): URLSearchParams {
    const query = getQuery();

    if (val) {
        const svalues = { ...JSON.parse(window.localStorage.getItem(key) || '{}'), ...val };
        const newvalues: Filters = {};

        if (typeof val === 'string') {
            return svalues;
        }

        Array.from(Object.entries(val)).forEach(([k, u]) => {
            if (u === undefined || u === null) {
                query.delete(k);
            } else {
                query.set(k, u);
                newvalues[k] = u;
            }
        });
        window.localStorage.setItem(key, JSON.stringify(newvalues));
    }

    return query;
}

/**
 *
 *
 * @export
 * @template T
 * @param {string} key
 * @param {T} defaultVal
 * @returns {[T, (val: T) => void]}
 */
export function useUrlQueryParam(key: string, defaultVal: Filters): [Filters, (val: Filters) => void] {
    const [query, setQuery] = useState<Filters>(getQueryStringVal(key, defaultVal));

    const updateUrl = (newVal: Filters) => {
        setQuery(newVal);

        const q = putQueryStringVal(key, newVal);

        // This check is necessary if using the hook with Gatsby
        if (typeof window !== 'undefined') {
            const { protocol, pathname, host } = window.location;
            const newUrl = `${protocol}//${host}${pathname}?${q.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    return [query, updateUrl];
}

/**
 *
 *
 * @export
 * @template T
 * @param {string} key
 * @param {T} defaultVal
 * @returns {[T, (val: T) => void]}
 */
/*This function is used for deep linked between pages without being saved in local storage*/
export function useQueryParam<T>(key: string, defaultVal: T): [T, (val: T) => void] {
    const [query, setQuery] = useState<T>(getQueryStringVal(key, defaultVal));

    const updateUrl = (newVal: T) => {
        // @ts-ignore
        const val = newVal.toString();

        setQuery(val);

        const query = getQuery();

        if (val.trim() !== '') {
            query.set(key, val);
        } else {
            query.delete(key);
        }
    };

    return [query, updateUrl];
}

export default useUrlQueryParam;
