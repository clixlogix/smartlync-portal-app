// useQueryParam.ts

import { useState } from 'react';

/*
    Usage:
        const [search, setSearch] = useQueryParam('search', '');

*/

/**
 *
 *
 * @export
 * @returns
 */
export function getQuery(): URLSearchParams {
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
export function getQueryStringVal<T>(key: string, fromLocalStorage?: boolean): T | null {
    // @ts-ignore
    let value: T = getQuery().get(key) as T;

    if (!value && fromLocalStorage) {
        const item = window.localStorage.getItem(key);
        value = (item ? JSON.parse(item) : item) as T;
    }
    return value;
}

/**
 *
 *
 * @export
 * @template T
 * @param {string} key
 * @param {T} val
 */
export function putQueryStringVal<T>(key: string, val: T, toLocalStorage?: boolean): any {
    const query = getQuery();
    // @ts-ignore
    let v;

    if (val) {
        if (toLocalStorage) {
            window.localStorage.setItem(key, JSON.stringify(val));
        }

        if (typeof val === 'string') {
            v = val?.toString()?.trim();

            query.set(key, v);
        } else {
            Object.entries(val).forEach(([k, u]) => {
                query.set(k, u);
            });
        }
    } else {
        if (toLocalStorage) {
            localStorage.removeItem(key);
        }
        query.delete(key);
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
export function useQueryParam<T>(
    key: string,
    defaultVal: T,
    fromLocalStorage?: boolean,
): [T, (val: T, toLocalStorage?: boolean) => void] {
    const [query, setQuery] = useState<T>(getQueryStringVal(key, fromLocalStorage) || defaultVal);

    const updateUrl = (newVal: T, toLocalStorage?: boolean) => {
        setQuery(newVal);

        const q = getQuery();
        putQueryStringVal(key, newVal, toLocalStorage);

        // This check is necessary if using the hook with Gatsby
        if (typeof window !== 'undefined') {
            const { protocol, pathname, host } = window.location;
            const newUrl = `${protocol}//${host}${pathname}?${q.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    return [query, updateUrl];
}

export default useQueryParam;
