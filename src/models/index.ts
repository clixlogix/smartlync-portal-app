/*
 *
 */
export * from './auth-model';
export * from './device-name-model';
export * from './fault-code-model';
export * from './fault-rate-model';
export * from './fault-count-model';
export * from './fault-type-model';
export * from './filter-model';
export * from './plant-model';
export * from './car-class-model';
export * from './stud-type-model';
export * from './user-model';
export * from './user-role-model';
export * from './recommended-actions-model';
export * from './fault-action-view-model';
export * from './fault-action-model';
export * from './fault-occurrence-model';
export * from './stud-id-fault-model';
export * from './system-fault-model';
export * from './route-item-model';
export * from './mtbf-model';
export * from './fault-frequency-model';
export * from './system-overview-model';
export * from './login-model';
export * from './process-log-model';
export * from './station-anomaly-model';
export * from './total-weekly-average-model';
export * from './event-desc-frequency-model';
export * from './event-count-frequency-model';
export * from './event-count-daily-frequency-model';
export * from './opportunity-analysis-model';
export * from './event-rate-cycle-count-model';
export * from './event-rate-per-event-model';
export * from './event-rate-per-device-model';
export * from './lift-model';
export * from './penetration-model';
export * from './voltage-model';
export * from './weld-time-model';
export * from './operation-item-model';
export * from './get-last-updated-model';
export * from './report-threshold-model';
export * from './top-fault-count-model';
export * from './fault-report-model';
export * from './car-body-graph-model';
export * from './car-body-table-model';
export * from './fault-duration-model';
export * from './duration-of-faults-model';
export * from './ta-analysis-table-model';
export * from './mtbf-analysis-table-model';
export * from './plant-device-by-duration-model';
export * from './settings-model';
export * from './maintainance-action-table-model';
export * from './upload-list-model';
export * from './line-model';
export * from './station-model';
export * from './car-type-model';
export * from './car-line-model';
export * from './event-model';
export * from './event-type-model';
export * from './weekly-ta-model';
export * from './ta-per-fault-frequency-model';
export * from './ta-table-model';
export * from './ta-table-spr-model';
export * from './mttr-table-model';
export * from './sa-table-model';
export * from './uptime-distribution-model';
export * from './measurement-trend-model';
export * from './fault-rate-measurement-trend-model';
export * from './wop-rate-measurement-trend-model';
export * from './welding-time-measurement-trend-model';
export * from './penetration-measurement-trend-model';
export * from './stud-projection-measurement-trend-model';
export * from './lifting-height-measurement-trend-model';
export * from './drop-time-measurement-trend-model';
export * from './cycle-gap-tempo-model';
export * from './cycle-gap-model';
export * from './carbody-risk-model';
export * from './graphic-data-model';
export * from './variance-analysis-model';
export * from './car-body-duration-widget-model';
export * from './car-body-duration-secondary-widget-model';
export * from './daily-fault-trends-model';
export * from './station-availability-trend-model';
export * from './device-area-graph-model';
export * from './probability-density-function-model';
export * from './fleet-expand-device-table-model';
export * from './cycle-gap-meta-data-model';
export * from './meta-data-panel-model';
export * from './measurements-widget-model';
export * from './program-model';
export * from './fixed-range-model';
export * from './historical-diagnostic-model';
export * from './historical-diagnostic-graph-model';
export * from './faults-per-device-histogram-model';
export * from './process-log-spr-model';
export * from './time-zone-model';
export * from './ttr-table-model';
export * from './cycle-gap-spr-model';
export * from './cycle-gap-meta-data-spr-model';
export * from './cycle-gap-event-model';
export * from './cycle-gap-spr-event-model';
export * from './duration-of-faults-spr-model';
export * from './event-desc-frequency-spr-model';
export * from './SPR/plant-cycle-averages-widget-spr-model';
export * from './SPR/plant-cycle-count-spr-model';
export * from './SPR/plant-fault-frequency-spr-model';
export * from './SPR/plant-fault-by-occurence-spr-model';
export * from './SPR/plant-fault-by-duration-spr-model';
export * from './SPR/plant-fault-by-stud-type-spr-model';
export * from './SPR/plant-fault-by-devices-spr-model';
export * from './SPR/plant-device-by-duration-spr-model';
export * from './SPR/reporting-view-bspr-model';
export * from './SPR/reporting-view-spr-model';
export * from './SPR/event-rate-cycle-count-spr-model';
export * from './SPR/event-rate-per-device-spr-model';
export * from './SPR/event-rate-cycle-count-spr-model';
export * from './SPR/reporting-view-bspr-model';
export * from './SPR/event-rate-per-event-spr-model';
export * from './mtbf-analysis-table-spr-model';
export * from './mttr-table-sor-model';
export * from './ttr-table-spr-model';
export * from './SPR/penetration-spr-model';
export * from './SPR/lift-spr-model';
export * from './SPR/voltage-spr-model';
export * from './SPR/weld-time-spr-model';
export * from './SPR/faults-per-device-histogram-spr-model';
export * from './SPR/top-fault-count-spr-model';
export * from './SPR/event-count-frequency-spr-model';
export * from './SPR/event-count-daily-frequency-spr-model';
export * from './time-zone-spr-model';
export * from './SPR/ta-analysis-table-model-spr';
export * from './measurements-spr-widget-model';

export * from './select-aggregate-column-model';
export * from './measurement-aggregate-widget-model';
export * from './measurement-aggregate-spr-widget-model';
export * from './measurement-aggregate-widget-spr-model';
export * from './user-management-widget-model';
export * from './essential-control-widgets-model';
export * from './d-report-widget-model';
// [IMPORT NEW MODELs ABOVE] < Needed for generating containers seamlessly

// extras
export interface AnObject {
    [key: string]: any;
}

export interface LoadingValue {
    [key: string]: boolean;
}

export enum SidePanelOpenState {
    Open = 'open',
    Close = 'close',
}

export enum SortOrderDirection {
    NONE = 0,
    ASC = 1,
    DESC = 2,
}

export enum HeadType {
    'Single' = '1',
    'Double' = '2',
    'ALL' = 'All',
}

export interface RiskTableHeadValue {
    studId: string;
    risk: number;
}

export type ButtonColorTypes = 'primary' | 'default' | 'inherit' | 'secondary' | undefined;

export enum ReportingViewDateFormats {
    Hourly = 'YYYYMMDDHH',
    Daily = 'YYYYMMDD',
    Weekly = 'YYYYWW',
    Monthly = 'YYYYMM',
    Yearly = 'YYYY',
}

export enum ReportingDataView {
    Hourly = 'hourly',
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = 'Yearly',
}

export enum carClassesEnum {
    All = 'All',
    EClass = 'E-Class',
    SClass = 'S-Class',
    TAClass = 'TA-Class',
}

export const ReportingIntervalViews = {
    [ReportingDataView.Hourly]: {
        groupBy: 'YYYYDDDDHH',
        format: 'HH:[00]',
        formatGeneral: 'DD/MM/YY HH:[00]',
        duration: 'hour',
    },
    [ReportingDataView.Daily]: {
        groupBy: 'YYYYDDDD',
        format: 'MMM / Do',
        formatGeneral: 'MMM Do, YYYY',
        duration: 'day',
    },
    [ReportingDataView.Weekly]: {
        groupBy: 'GGGGWWW',
        format: 'GGGG / [W]WW',
        formatGeneral: '[Week] W [of] YYYY',
        duration: 'week',
    },
    [ReportingDataView.Monthly]: {
        groupBy: 'YYYYMM',
        format: 'YYYY / MMM',
        formatGeneral: 'MMMM YYYY',
        duration: 'month',
    },
    [ReportingDataView.Yearly]: {
        groupBy: 'YYYY',
        format: 'YYYY',
        formatGeneral: 'YYYY',
        duration: 'year',
    },
};

export enum ReportingDataViewType {
    Graph = 'Graph',
    Table = 'Table',
}

export interface ThresholdType {
    faultCount?: number;
    eventCount?: number;
    cycleCount?: number;
    ratio?: number;
}

export enum PlantCycleAveragesCardName {
    TA = 'TA',
    MTTR = 'MTTR',
    MTBF = 'MTBF',
    MTTF = 'MTTF',
}

export interface IntervalViewData {
    label?: ReportingDataView;
    labelFormat?: string;
    period?: string;
    fn?: string;
    colWidth?: number;
    groupingFormat?: string;
    sortCompare?: Function;
    extendedLabelFormat?: string;
    threshold?: any;
    expandedColWidth?: number;

    customBodyRender?: Function;
    customHeadRender?: Function;
    customHeadLabelRender?: Function;
}

export enum WeldSignalGraphType {
    UNKNOWN = 'UnKnown',
    CURRENT = 'CURRENT',
    VOLTAGE = 'VOLTAGE',
    LIFT_POSITION = 'LIFT_POSITION',
}
