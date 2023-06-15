import { ReportingDataView } from 'models';

export enum RcalabelFormat {
    hourly = 'h',
    daily = 'dddd',
    weekly = 'W',
}
export enum SystemType {
    SWS = 'SWS',
    SPR = 'SPR',
    SAT = 'SAT',
}

export const RCAIntervalViews = {
    [ReportingDataView.Hourly]: {
        // groupBy: 'YYYY[0]dddd[0]HH',
        hourly: 'hourly',
        duration: 'hour',
        labelFormat: `h`,
        extendedLabelFormat: '(DD-MMM)',
        period: 'hour',
        fn: 'hour',
        colWidth: 84,
        expandedColWidth: 175,
        groupingFormat: 'YYYY[0]dddd[0]HH',
        threshold: { ratio: 0.05, faultCount: 50 },
    },
    [ReportingDataView.Daily]: {
        daily: 'Daily',
        duration: 'day',
        labelFormat: `dddd`,
        extendedLabelFormat: '(DD-MMM)',
        period: 'day',
        fn: 'dayOfYear',
        colWidth: 84,
        expandedColWidth: 175,
        groupingFormat: 'YYYYMMDD',
        threshold: { ratio: 0.05, faultCount: 20 },
        formatGeneral: 'DD',
    },
    [ReportingDataView.Weekly]: {
        weekly: 'Weekly',
        duration: 'week',
        labelFormat: 'W',
        period: 'isoWeek',
        fn: 'week',
        colWidth: 42,
        expandedColWidth: 220,
        groupingFormat: 'YYYYWW',
        threshold: { ratio: 0.05, faultCount: 20 },
    },
    [ReportingDataView.Monthly]: {
        monthly: 'Monthly',
        groupBy: 'YYYYMM',
        format: 'YYYY / MMM',
        formatGeneral: 'MMM',
        duration: 'month',
    },
    [ReportingDataView.Yearly]: {
        yearly: 'Yearly',
        groupBy: 'YYYY',
        format: 'YYYY',
        formatGeneral: 'YYYY',
        duration: 'year',
    },
};

export const ReportingViewIntervalViews = {
    [ReportingDataView.Daily]: {
        labelFormat: 'D',
        period: 'day',
        fn: 'dayOfYear',
        colWidth: 25,
    },
    [ReportingDataView.Weekly]: {
        labelFormat: 'W',
        period: 'week',
        fn: 'week',
        colWidth: 42,
    },
};

export const initialValues: any = {
    default: {
        faultCode: '20002',
        eventCode: '20002',
        plantID: '1',
        faultAssignment: 2,
        dateFormat: 'YYYY-MM-DD',
        week: 'week',
        isoWeek: 'isoWeek',
    },
    rcaPage: {
        fromTimeMoment: 8,
        toTimeMoment: 2,
    },
    reportingViewPage: {
        fromTimeMoment: 27,
        toTimeMoment: 2,
    },
    plantOverview: {
        xyz: '',
    },
    systemOverview: {
        fromTimeMoment: 9,
        timeFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    failureRateTrend: {
        fromTimeMoment: 9,
        timeFormat: 'YYYY-MM-DD HH:mm:ss',
    },
};

export const threshold = {};
