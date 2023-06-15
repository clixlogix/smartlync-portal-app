export interface Filter {
    name: string;
    value: any;
}

export enum FilterNames {
    id = 'id',
    faultCode = 'faultCode',
    eventCode = 'eventCode',
    studType = 'studType',
    deviceName = 'deviceName',
    systemType = 'systemType',
    studId = 'studId',
    program = 'program',
    statusB = 'statusB',
    weekDay = 'weekDay',
    weekDayNo = 'weekDayNo',
    event = 'event',
    fromTime = 'fromTime',
    dateRange = 'dateRange',
    nineWeek = 'nineWeek',
    toTime = 'toTime',
    fileType = 'fileType',
    data = 'data',
    occurredOn = 'occurredOn',
    selectedLanguage = 'selectedLanguage',
    plantId = 'plantId',
    view = 'view',
    dynamicOn = 'dynamicOn',
    grouping = 'grouping',
    tenant = 'tenant',
    faultAssignment = 'faultAssignment',
    langCode = 'langCode',
    selectedProcessEvent = 'selectedProcessEvent',
    reportThreshold = 'reportThreshold',
    deviceLine = 'subLine',
    deviceSubLine = 'line',
    stationName = 'stationName',
    week = 'week',
    eventType = 'eventType',
    eventTypeCode = 'eventTypeCode',
    anomaly = 'anomaly',
    anomalyConfidence = 'confidence',
    weekOrDay = 'weekOrDay',
    carBody = 'carBody',
    carbodyId = 'carbodyId',
    engine = 'engine',
    carModel = 'carModel',
    carTypeId = 'carType',
    carType = 'carType',
    direction = 'direction',
    limit = 'limit',
    lastUpdated = 'lastUpdated',
    bodyshop = 'bodyshop',
    weldId = 'weldId',
    projectId = 'projectId',
    station = 'station',
    disabled = 'disabled',
    singleDate = 'singleDate',
    feederNo = 'feederNo',
    outletNo = 'outletNo',
    graphData = 'graphData',
    groupBy = 'groupBy',
    weekRange = 'weekRange',
    systemFaults = 'systemFaults',
    headType = 'headType',
    aggregateType = 'aggregateType',
    aggregateWindow = 'aggregateWindow',
    aggregateColumn = 'aggregateColumn',
    aggregateNeeded = 'aggregateNeeded',
    factory = 'factory',
    field = 'field',
    fixedRangePicker = 'fixedRangePicker',
    fromWeek = 'fromWeek',
    toWeek = 'toWeek',
}

export enum ScreenNames {
    home = 'home',
    reportingView = 'reportingView',
    reportingViewB = 'reportingViewB',
    fleetOverview = 'fleetOverview',
    paretoAnalysis = 'paretoAnalysis',
    failureRateTrends = 'failureRateTrends',
    faultCountTrend = 'faultCountTrend',
    essentialControlCharts = 'essentialControlCharts',
    faultsPerDevice = 'faultsPerDevice',
    carBodyRisk = 'carBodyRisk',
    opportunityAnalysis = 'opportunityAnalysis',
    catbodyDurationPerStation = 'catbodyDurationPerStation',
    cycleMeasurementCombo = 'Cycle Measurement Combo',
    measurementTrends = 'Measurement Trends',
    measurement = 'Measurement',
    taAnalysis = 'Ta Analysis',
    mttrAnalysis = 'Mttr Analysis',
    mtbfAnalysis = 'Mtbf Analysis',
    ttrAnalysis = 'Ttr Analysis',
    maintainanceAction = 'Maintenance Action',
    stationAvailability = 'Station Availability',
    dailyFaultTrends = 'Daily Fault Trends',
    stationAvailabilityTrends = 'Station Availability Trends',
    graphicDataAnalysis = 'Graphic Data Analysis',
    cycleGap = 'Cycle Gap',
    cycleGapSPR = 'Cycle Gap SPR',
    diagnosticView = 'Diagnostic View',
    dateRange = 'DateRange',
}

export enum AggregateColumn {
    weldTime = 'weldTime',
    dropTime = 'dropTime',
    boltProjection = 'boltProjection',
    liftHeight = 'liftHeight',
    penetration = 'penetration',
}
export enum Tenant {
    Daimler = 'daimler',
}

export enum Fault_assignment {
    Active = '1',
    Maintainance = '0',
}

export enum eventType {
    Fault = 'Fault',
    Warning = 'Warning',
    ComponentExchange = 'Component Replacement',
    FirmwareUpdate = 'Firmware Update',
    Info = 'Info',
    Maintenance = 'Maintenance',
}

export enum eventTypeGerman {
    Fault = 'Störung',
    Warning = 'Warnung',
    ComponentExchange = 'Komponententausch',
    FirmwareUpdate = 'Firmware Update',
    Info = 'Info',
    Maintenance = 'Wartung',
}

export enum view {
    Weekly = 'Weekly',
    Daily = 'Daily',
    Monthly = 'Monthly',
}

export enum RouteTo {
    rca = 'reportingView',
    fleetOverview = 'systemOverview',
    reportingView = 'reportingViewB',
}

export enum AggregateType {
    count = 'count',
    min = 'min',
    max = 'max',
    median = 'median',
    stddev = 'stddev',
}
export type Filters = { [P in FilterNames]?: any };

export default Filter;
