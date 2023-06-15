import React from 'react';
import { Translation } from 'react-i18next';
import { Images } from 'constants/index';
import { RouteItems } from 'models';
import { isDemoTenant } from 'utils';
import { messages } from './messages';

export const routes: RouteItems = [
    {
        title: <Translation>{(t) => t(messages.maintenanceTitle)}</Translation>,
        subTitle: <Translation>{(t) => t(messages.maintenanceSubTitle)}</Translation>,
        route: './reportingViewB',
        icon: Images.HammerYellow,

        disabled: false,
    },
    {
        title: <Translation>{(t) => t(messages.systemTitle)}</Translation>,
        subTitle: <Translation>{(t) => t(messages.systemSubTitle)}</Translation>,
        route: './systemOverview',
        icon: Images.ChartYellow,

        disabled: false,
    },
    {
        title: <Translation>{(t) => t(messages.uploadTitle)}</Translation>,
        subTitle: <Translation>{(t) => t(messages.uploadSubTitle)}</Translation>,
        route: './upload',
        icon: Images.UploadYellow,

        disabled: isDemoTenant(),
    },
    {
        title: <Translation>{(t) => t(messages.rcaTitle)}</Translation>,
        subTitle: <Translation>{(t) => t(messages.rcaSubTitle)}</Translation>,
        route: './reportingView',
        icon: Images.HammerYellow,

        disabled: false,
    },
];

export default routes;
