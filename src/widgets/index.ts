import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { Filters } from 'models';

export * from './ProcessLog';
export * from './StationAnomaly';
export * from './EventFrequency/EventCodeFrequency';
export * from './EventFrequency/EventDescFrequency';
export * from './EventCount/EventCountFrequencyWidget';
export * from './EventCount/EventCountDailyFrequency';
export * from './OpportunityAnalysis';
export * from './EventRate/EventRateCycleCount';
export * from './EventRate/EventRatePerEvent';
export * from './EventRate/EventRatePerDevice';
export * from './ControlCharts/Lift';
export * from './ControlCharts/Penetration';
export * from './ControlCharts/Voltage';
export * from './ControlCharts/WeldTime';
export * from './TopFaultCount';
export * from './FaultReport';
export * from './CarBody/CarBodyGraph';
export * from './CarBody/CarBodyTable';
export * from './PlantCycleAverages';
export * from './PlantAppNavBar';
export * from './PlantFaultByOccurence';
export * from './PlantFaultByDevices';
export * from './PlantFaultByStudType';
export * from './PlantFaultByDuration';
export * from './PlantCycleCount';
export * from './PlantFaultFrequency';
export * from './EventFrequency/DurationOfFaults';
export * from './TaAnalysisTable';
export * from './DevicesFaultReport';
export * from './PlantDeviceByDuration';
export * from './MaintainanceActionTable';
export * from './UploadStat';
export * from './UploadChart';
export * from './TaTable';
export * from './MttrTable';
export * from './MeanTimeBetweenFailureTableAnalysis';
export * from './FaultRateMeasurementTrend';
export * from './WopRateMeasurementTrend';
export * from './WeldingTimeMeasurementTrend';
export * from './PenetrationMeasurementTrend';
export * from './StudProjectionMeasurementTrend';
export * from './LiftingHeightMeasurementTrend';
export * from './DropTimeMeasurementTrend';
export * from './CycleGap';
export * from './CarbodyRiskTable';
export * from './CarBodyDurationWidget';
export * from './DailyFaultTrendsWidget';
export * from './SaTable';
export * from './UptimeDistribution';
// export * from './DeviceAreaGraph';
export * from './ProbabilityDensityFunction';
export * from './FleetExpandDeviceTable';
export * from './MeasurementsWidget';
export * from './FaultsPerDeviceHistogram';
export * from './ProcessLogSpr';
export * from './TtrTable';
export * from './CycleGapSPR';
export * from './EventFrequencySpr/DurationOfFaultsSpr';
export * from './EventFrequencySpr/EventCodeFrequencySpr';
export * from './EventFrequencySpr/EventDescFrequencySpr';
export * from './SPR/PlantCycleAveragesWidgetSPR';
export * from './SPR/PlantCycleCountSPR';
export * from './SPR/PlantAppNavBarSPR';
export * from './SPR/PlantFaultFrequencySPR';
export * from './SPR/PlantFaultByOccurenceSPR';
export * from './SPR/PlantFaultByDurationSPR';
export * from './SPR/PlantFaultByStudTypeSPR';
export * from './SPR/PlantFaultByDevicesSPR';
export * from './SPR/PlantDeviceByDurationSPR';
export * from './SPR/PenetrationSpr';
export * from './SPR/LiftSpr';
export * from './SPR/VoltageSpr';
export * from './SPR/WeldTimeSpr';
export * from './SPR/WeldTimeSpr';
export * from './FaultsPerDeviceHistogramWidgetSpr';
export * from './TopFaultCountSpr';
export * from './EventRate/EventRateCycleCountSpr';
export * from './EventRate/EventRatePerDeviceSpr';
export * from './EventRate/EventRatePerEventSpr';
export * from './EventCount/EventCountFrequencyWidgetSpr';
export * from './EventCount/EventCountDailyFrequencySpr';
export * from './MeanTimeBetweenFailureTableAnalysisSpr';
export * from './MttrTableSpr';
export * from './TaTableSpr';
export * from './measurementAggregateWidget';
export * from './MeasurementAggregateWidgetSpr';
export * from './EssentialControlWidgets';
export * from './userManagementWidget';
export * from './DReportWidget';
// [INSERT NEW WIDGET IMPORT KEY ABOVE] < Needed for generating containers language seamlessly

export interface WidgetProperty {
    defaultFilters?: DashboardFilter[];
    widgetType?: string;
    layout?: any;
}

export type Widget<P> = React.FunctionComponent<P> & {};
export type ChartWidget<P> = React.FunctionComponent<P> & {};

export interface WidgetProps {
    filters?: Filters;
    className?: string;

    isLoading?(loading: boolean);
    onFilterChange?(filter: Filters);

    // set available filters to the widget parent page so the parent page can
    // send the filters to the SideFilterPanel component
    //
    setAvailableFilters?(filters: DashboardFilter[]);
}

export interface ChartWidgetProps extends WidgetProps {
    onClick?(event);
}
