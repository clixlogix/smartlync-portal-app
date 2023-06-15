import axios from 'axios';
import Constants, { API_REQUEST_DATE_FORMAT } from 'constants/index';
import i18n from 'locales/i18n';
import { isMoment } from 'moment';
import { cleanEmptyKeyParams } from 'utils';
import { FilterNames } from 'models';

export class ResponseError extends Error {
    public response: Response;
    constructor(response: Response) {
        super(response.statusText);
        this.response = response;
    }
}
export interface RequestOptions extends RequestInit {
    params?: any;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function request<T>(options?: any): Promise<T | { err: ResponseError }> {
    const { url, noauth = false, ...rest } = options;
    const { language } = i18n as any;

    let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];

    if (['d39clh38jv3kjg', '127', '192', 'dev'].includes(tenant)) {
        tenant = 'daimler';
    }

    const headers = { 'Accept-Language': language, /* 'X-tenant-ID': tenant,*/ ...rest?.headers };
    let params = { ...rest?.params };
    if (params.fromTime && isMoment(params.fromTime)) {
        params = { ...params, fromTime: params.fromTime.format(API_REQUEST_DATE_FORMAT) };
    }
    if (params.toTime && isMoment(params.toTime)) {
        params = { ...params, toTime: params.toTime.format(API_REQUEST_DATE_FORMAT) };
    }
    const systemType = localStorage.getItem(Constants.storageKeys.systemType) || 'SWS';
    const plantId = localStorage.getItem(Constants.storageKeys.plantId);
    params[FilterNames.systemType] = systemType;
    params[FilterNames.plantId] = plantId;

    let jwtToken = '';

    const token = localStorage.getItem(Constants.storageKeys.authToken);

    if (token) {
        jwtToken = JSON.parse(token);
    }

    if (!noauth) {
        params = { tenant, ...params };
        cleanEmptyKeyParams(params);
        headers.Authorization = jwtToken ? `Bearer ${jwtToken}` : '';
    }

    const opts: any = {
        ...options,
        headers,
        params,
        mode: 'cors',
        credentials: 'includes',
    };

    const { data } = await axios(url, opts);

    return data as T;
}
