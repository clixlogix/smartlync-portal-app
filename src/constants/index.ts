import UserAvatar from '../assets/images/industrial_servicices_logo.svg';
import Annotation from '../assets/images/Annotation.png';
import InspectionStation from '../assets/images/InspectionStation.png';
import Pic001 from '../assets/images/Pic001.png';
import Pic004 from '../assets/images/Pic004.png';
import Pic007 from '../assets/images/Pic007.png';
import Pic010 from '../assets/images/Pic010.png';
import ProjectImg from '../assets/images/project-img.jpg';
import Rejection from '../assets/images/Rejection.png';
import Solihull from '../assets/images/solihull.jpg';
import CloseBtnSmall from '../assets/images/CloseBtnSmall.png';
import Logo from '../assets/images/logo.png';
import IndustrialServicesLogo from '../assets/images/industrial_servicices_logo.svg';
import Pic002 from '../assets/images/Pic20.png';
import Pic005 from '../assets/images/Pic005.png';
import Pic008 from '../assets/images/Pic008.png';
import Project2Img from '../assets/images/Project2-img.png';
import Reshoot from '../assets/images/Reshoot.png';
import UserLogo from '../assets/images/user-logo.jpg';
import InspectionAnomaly from '../assets/images/InspectionAnomaly.png';
import Nitra from '../assets/images/nitra.jpg';
import Pic003 from '../assets/images/Pic003.png';
import Pic006 from '../assets/images/Pic006.png';
import Pic009 from '../assets/images/Pic009.png';
import Project3Img from '../assets/images/Project3-img.png';
import ProjectMap from '../assets/images/ProjectMap.png';
import Signature from '../assets/images/signature.png';
import Affalterbach from '../assets/images/Affalterbach.jpg';
import Berlin from '../assets/images/Berlin.jpg';
import Bremen from '../assets/images/Bremen.jpg';
import Hamburg from '../assets/images/Hamburg.jpg';
import Kamenz from '../assets/images/Kamenz.jpg';
import Kolleda from '../assets/images/Kolleda.jpg';
import Rastatt from '../assets/images/Rastatt.jpg';
import Sindelfingen from '../assets/images/Sindelfingen.jpg';
import Stuttgart from '../assets/images/Stuttgart.jpg';
import DefaultAvatar from '../assets/images/DefaultAvatar.png';
import Chart from '../assets/images/chart.svg';
import ChartYellow from '../assets/images/chart-yellow.svg';
import Hammer from '../assets/images/hammer.svg';
import HammerYellow from '../assets/images/hammer-yellow.svg';
import Upload from '../assets/images/upload.svg';
import UploadYellow from '../assets/images/upload-yellow.svg';
import CarParts from '../assets/images/car-parts.jpg';
import EluLogo from '../assets/images/Elu.svg';
import EluPDFLogo from '../assets/images/Logo_ELU_[BLACK]_web.jpg';
import Pic012 from '../assets/images/Pic012.png';
import Stanleylogo from '../assets/images/stanleyLogo.svg';
import { FilterNames } from 'models';
import { isDemoTenant } from '../utils';
import NoData from '../assets/images/noData.svg';
import Empty from '../assets/images/empty_1.svg';
import TileImage from '../assets/images/tile_image.png';
//import rivian from '../assets/images/Logos/Rivian.svg';
import jlr from '../assets/images/Logos/Jaguar.svg';
import LandRover from '../assets/images/Logos/LandRover.svg';
import daimler from '../assets/images/Logos/Daimler.svg';
import RivianLanding from '../assets/images/RivianLanding.png';
import RivianLightLogo from '../assets/images/Logos/RivianLight.svg';
import RivianDarkLogo from '../assets/images/Logos/RivianDark.svg';

/*

*/

// prod
let href = window.location.href.replace('http://', '').replace('https://', '').split('.')[0].toLocaleLowerCase();
const environment = window.location.href
    .replace('http://', '')
    .replace('https://', '')
    .split('.')[1]
    .toLocaleLowerCase();
href = href === 'demo' && environment === 'stage' ? 'demoStage' : href;

const selectBaseURI = (tenant: string): String => {
    switch (tenant) {
        case 'demo':
            //TODO: temporarily pointing todemo.stgae backend ( So that demo.qa also points to demo.stage BE )
            // return 'https://khxrtmoxri.execute-api.eu-central-1.amazonaws.com/dev';
            return 'https://du77y5svu8.execute-api.eu-central-1.amazonaws.com/staging';
        case 'jlr':
            return 'https://du77y5svu8.execute-api.eu-central-1.amazonaws.com/staging';
        case 'demoStage':
            return 'https://du77y5svu8.execute-api.eu-central-1.amazonaws.com/staging';
        case 'rivian':
            return 'https://xg9v72t9te.execute-api.eu-central-1.amazonaws.com/rivian';
        case 'magna':
            return 'https://dkf93ez2yd.execute-api.eu-central-1.amazonaws.com/magna';
        case 'tucker':
            return 'https://uik6e3skrl.execute-api.eu-central-1.amazonaws.com/tucker';
        default:
            return process.env.REACT_APP_BASE_URL as String;
    }
};

const baseUri = selectBaseURI(href);
const authToken = isDemoTenant() ? process.env.DEMO_REACT_APP_AUTH_TOKEN : process.env.REACT_APP_AUTH_TOKEN;

export const version = '0.90.5';

export const uploadAcceptedFiles = [
    'application/xlsx',
    'application/xls',
    'application/vnd.ms-excel',
    'text/xml',
    'application/xml',
    '.xls',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    '.zip',
    '.s3db',
];

export const storageKeys = {
    version: '_elu_portal__version',
    authToken: '_elu_portal__token',
    jwtToken: '_elu_portal__jwtToken',
    userDetails: '_elu_portal__userDetails',

    appPageFilter: '_elu_page_filters',
    failureRateTrendPage: '_elu_page_failure-rate-trend',
    eluPlatformAnalyticsPage: '_elu_page_platform-analytics',
    carbodyRiskAnalysisPage: '_elu_page_carbody_risk_analysis',
    cycleGapTempoPage: '_elu_page_cycle_gap_tempo',
    essentialControlChartPage: '_elu_page_essential_control_chart',
    faultCountTrendPage: '_elu_page_fault_count_trend',
    measurementTrendPage: '_elu_page_measurement_trend',
    measurementTrendPageSpr: '_elu_page_measurement_trend_spr',
    paretoAnalysisPage: '_elu_page_pareto_analysis',
    stationAvailabilityPage: '_elu_page_station_availability',
    fleetOverviewPage: '_elu_page_fleet_overview',
    fleetOverviewZoomed: '_elu_page_fleet_zoomed_devices',
    // [IMPORT NEW MODELSTORAGEKEYs ABOVE] < Needed for generating storage seamlessly

    localFilters: '_elu_filter_localFilters',
    apiFilters: '_elu_filter_apiFilters',

    viewFilter: '_elu_filter_view',
    lineFilter: '_elu_filter_line',
    faultCodeFilter: '_elu_filter_fault_code',
    deviceNameFilter: '_elu_filter_device_name',
    studTypeFilter: '_elu_filter_stud_type',
    weekFilter: '_elu_filter_week',
    eventTypeFilter: '_elu_filter_event_type',
    plantId: 'plant__id',
    systemType: 'systemType',
    commonPageFilters: 'common_page-filters',
};

export const IoTFlows = {
    username: 'oc_39488a9cf2c3659177cf43d8778748a0',
    password: '43Iq^5zvuSl[ZjG_Jc]KAyRpCte',
    data_stream_uuid: 'ds_1c3dca7e9dae3e88b4f0efe4bd6eceb4',
    data_streams_uuid: [
        'ds_1c3dca7e9dae3e88b4f0efe4bd6eceb4',
        'ds_b08beb92bce7cad3dd97de64bef76b93',
        'ds_7be7e70a37ca8d877d37d6020a362fd0',
        'ds_1ede93080e1dbe6955dd1d1dbe4850c3',
        'ds_c52c25cf8d4ac3166ca397a0e8b9f682',
    ],
    spr_data_stream_uuid: 'ds_3f3a5df94a5c305dbc400efe3116a11d',
    spr_data_streams_uuid: ['ds_3f3a5df94a5c305dbc400efe3116a11d'],
};

export const constants: any = {
    version,
    storageKeys,
    baseUri,
    baseURL: baseUri,
    authToken,
    uploadAcceptedFiles,
    IoTFlows,
    apiUri: `${baseUri}/api`,
    jwtAuthUri: `${baseUri}/api/auth/ValidateUser`,
    loginUrl: `${baseUri}/api/auth/signin`,
    profileUrl: `${baseUri}/api/auth/profile`,
    faultCodes: `${baseUri}/api/fault/code`,
    // faultRates: `${baseUri}/api/fault/updatedrateview`,
    faultRates: `${baseUri}/api/event/rateview`,
    // faultRates: `${baseUri}/api/fault/rateview`,
    faultCounts: `${baseUri}/api/event/count`,
    faultTypes: `${baseUri}/api/fault/types`,
    studIds: `${baseUri}/api/stud/studid`,
    studTypes: `${baseUri}/api/stud/studtype`,
    deviceNames: `${baseUri}/api/device`,
    recommendedActions: `${baseUri}/api/recommendedActions/actions`,
    recommendedActionsSpr: `${baseUri}/api/spr/recommendedActions/actions`,
    dashboards: `${baseUri}/api/dashboards`,
    getUploadUrl: `${baseUri}/api/file-upload/events`,
    getUploadUrlSpr: `${baseUri}/api/spr/file-upload/events`,
    recommendedActionSubmits: `${baseUri}/api/action/fault-actions`,
    recommendedActionSubmitsSpr: `${baseUri}/api/spr/action/fault-actions`,
    recommendedActionsHistorys: `${baseUri}/api/action/fault-actions`,
    recommendedActionsHistorysSpr: `${baseUri}/api/spr/action/fault-actions`,
    systemOverviews: `${baseUri}/api/system/averagetamttrperdevice`,
    mtbfs: `${baseUri}/api/system/mtbf-faultcodes`,
    faultOccurrences: `${baseUri}/api/system/faults-by-occurence`,
    studIdFaults: `${baseUri}/api/system/faults-by-studtype`,
    systemFaults: `${baseUri}/api/system/faults-by-device`,
    faultFrequencys: `${baseUri}/api/system/frequency-of-faults`,
    totalCycles: `${baseUri}/api/cycles`,
    stationAnomalys: `${baseUri}/api/stationanomalys`,
    totalWeeklyAverages: `${baseUri}/api/system/averagetamttrmtbfperplant`,
    eventDescFrequencys: `${baseUri}/api/reports/getfrequencydescriptionandeventCount`,
    eventCountFrequencyWidgets: `${baseUri}/api/reports/getEventCountPerDevice`,
    opportunityAnalysiss: `${baseUri}/api/device/opportunity-analysis`,
    eventRateCycleCounts: `${baseUri}/api/reports/getCycleCount`,
    eventRatePerEvents: `${baseUri}/api/reports/getEventRatePerEvent`,
    eventRatePerDevices: `${baseUri}/api/reports/getEventRatePerDevice`,
    lifts: `${baseUri}/api/reports/getLiftDaily`,
    penetrations: `${baseUri}/api/reports/getPenetrationDaily`,
    voltages: `${baseUri}/api/reports/getVoltageDaily`,
    weldTimes: `${baseUri}/api/reports/getWeldingTimeDaily`,
    operationItems: `${baseUri}/api/operationi-tems`,
    getLastUpdateds: `${baseUri}/api/get-last-updated`,
    reportThresholds: `${baseUri}/api/reportthresholds`,
    faultReports: `${baseUri}/api/fault/updatedrateview`,
    topFaultCounts: `${baseUri}/api/reports/getFaultPerDevice`,
    faultDurations: `${baseUri}/api/system/faults-by-duration`,
    durationOfFaultss: `${baseUri}/api/reports/event-duration`,
    carBodyGraphs: `${baseUri}/api/carbody-graph-data`,
    carBodyTables: `${baseUri}/api/carbodytables`,
    taAnalysisTables: `${baseUri}/api/get-mttr-ta-mtbf`,
    mtbfAnalysisTables: `${baseUri}/api/get-mtbf-data`,
    plantDeviceByDurations: `${baseUri}/api/system/devices-by-duration`,
    uploadListItems: `${baseUri}/api/uploadlistitems`,
    lines: `${baseUri}/api/line`,
    stations: `${baseUri}/api/station`,
    localFilters: [FilterNames.week, FilterNames.eventType], // if you want any filter to work localy, add it name here
    carTypes: `${baseUri}/api/cartypes`,
    events: `${baseUri}/api/events`,
    eventTypes: `${baseUri}/api/eventtypes`,
    taTables: `${baseUri}/api/get-ta-devicename-output`,
    mttrTables: `${baseUri}/api/get-mttr-devicename-output`,
    measurementTrends: `${baseUri}/api/measurementtrends`,
    faultRateMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    wopRateMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    weldingTimeMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    penetrationMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    studProjectionMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    liftingHeightMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    dropTimeMeasurementTrends: `${baseUri}/api/welds/aggregates`,
    saTable: `${baseUri}/api/get-station-availability-report`,
    cycleGaps: `${baseUri}/api/welds/weld-points`,
    cycleGapEvents: `${baseUri}/api/welds/events`,
    carbodyRisks: `${baseUri}/api/risk`,
    carBodyDurationWidgets: `${baseUri}/api/carbody-duration`,
    dailyFaultTrends: `${baseUri}/api/dailyfaulttrendswidgets`,
    graphicDatas: `${baseUri}/api/weld-data`,
    deviceAreaGraphs: `${baseUri}/api/deviceareagraphs`,
    probabilityDensityFunctions: `${baseUri}/api/probabilitydensityfunctions`,
    fleetExpandDeviceTables: `${baseUri}/api/fleetexpanddevicetables`,
    cycleGapMetaDatas: `${baseUri}/api/welds/weld-graph-data`,
    weldTags: `${baseUri}/api/welds/tags`,
    weldTagsSpr: `${baseUri}/api/spr/rivets/tags`,
    measurementsWidgets: `${baseUri}/api/welds/aggregates`,
    programs: `${baseUri}/api/programs`,
    historicalDiagnostics: `${baseUri}/api/welds/historical`,
    diagnosticGraph: `${baseUri}/api/welds/weld-graph-data`,
    historicalDiagnosticGraphs: `${baseUri}/api/welds/weld-graph-data`,
    faultsPerDeviceHistograms: `${baseUri}/api/reports/getFaultPerDevice`,
    historicalSPR: `${baseUri}/api/spr/rivets/historical`,
    historicalGraphSPR: `${baseUri}/api/spr/rivets/rivet-graph-data`,
    processLogSprs: `${baseUri}/api/processlogsprs`,
    timeZones: `${baseUri}/api/plant/timezone`,
    ttrTables: `${baseUri}/api/get-ttr-data`,
    cycleGapSprs: `${baseUri}/api/spr/rivets/cycle-gaps`,
    cycleGapSprEvents: `${baseUri}/api/spr/rivets/events`,
    cycleGapMetaDataSprs: `${baseUri}/api/spr/rivets/rivet-graph-data`,
    durationOfFaultsSprs: `${baseUri}/api/spr/reports/event-duration`,
    eventDescFrequencySprs: `${baseUri}/api/spr/reports/getfrequencydescriptionandeventCount`,
    plantCycleAveragesWidgetSprs: `${baseUri}/api/spr/system/averagetamttrmtbfperplant`,
    plantCycleCountSprs: `${baseUri}/api/spr/cycles`,
    plantFaultFrequencySprs: `${baseUri}/api/spr/system/frequency-of-faults`,
    plantFaultByOccurenceSprs: `${baseUri}/api/spr/system/faults-by-occurence`,
    plantFaultByDurationSprs: `${baseUri}/api/spr/system/faults-by-duration`,
    plantFaultByStudTypeSprs: `${baseUri}/api/system/faults-by-studtype`,
    plantFaultByDevicesSprs: `${baseUri}/api/spr/system/faults-by-device`,
    plantDeviceByDurationSprs: `${baseUri}/api/spr/system/devices-by-duration`,
    eventRateCycleCountSprs: `${baseUri}/api/spr/reports/getCycleCount`,
    eventRatePerDeviceSprs: `${baseUri}/api/spr/reports/getEventRatePerDevice`,
    eventRatePerEventSprs: `${baseUri}/api/spr/reports/getEventRatePerEvent`,

    reportingViewBsprs: `${baseUri}/api/spr/event/count`,
    reportingViewSprs: `${baseUri}/api/spr/event/rateview`,
    penetrationSprs: `${baseUri}/api/reports/getPenetrationDaily`,
    liftSprs: `${baseUri}/api/reports/getLiftDaily`,
    voltageSprs: `${baseUri}/api/reports/getVoltageDaily`,
    weldTimeSprs: `${baseUri}/api/reports/getWeldingTimeDaily`,
    faultsPerDeviceHistogramSprs: `${baseUri}/api/spr/reports/getFaultPerDevice`,
    topFaultCountSprs: `${baseUri}/api/spr/reports/getFaultPerDevice`,
    eventCountFrequencyWidgetSpr: `${baseUri}/api/spr/reports/getEventCountPerDevice`,
    eventCountDailyFrequencySprs: `${baseUri}api/spr/reports/getEventCountPerDevice`,
    mtbfAnalysisTableSprs: `${baseUri}/api/spr/get-mtbf-data`,
    mttrTableSprs: `${baseUri}/api/spr/get-mttr-devicename-output`,
    taAnalysisTableSprs: `${baseUri}/api/ta-analysis-table-sprs`,
    plants: `${baseUri}/api/plants`,
    timeZoneSprs: `${baseUri}/api/plant/timezone`,
    taTableSprs: `${baseUri}/api/spr/get-ta-devicename-output`,
    linesSprs: `${baseUri}/api/spr/line`,
    deviceNamesSprs: `${baseUri}/api/spr/device`,
    stationsSprs: `${baseUri}/api/spr/station`,
    faultCodesSprs: `${baseUri}/api/spr/fault/code`,
    systemOverviewSpr: `${baseUri}/api/spr/system/averagetamttrperdevice`,
    opportunityAnalysissSpr: `${baseUri}/api/spr/device/opportunity-analysis`,
    selectAggregateColumnsSpr: `${baseUri}/api/spr/rivets/measurement-list`,
    selectAggregateColumns: `${baseUri}/api/welds/measurement-list`,
    measurementAggregateWidgets: `${baseUri}/api/welds/aggregates`,
    measurementsSprWidgets: `${baseUri}/api/spr/rivets/aggregates`,
    userManagementWidgets: `${baseUri}/api/usermanagementwidgets`,
    essentialControlWidgetss: `${baseUri}/api/welds/essential-control`,
    forgetPassword: `${baseUri}/api/auth/forgotPassword`,
    resetPassword: `${baseUri}/api/auth/confirmForgotPassword`,
    dReportWidgets: `${baseUri}/api/reports/getEventRatePerEvent`,
    // [IMPORT NEW MODELAPIURLs ABOVE] < Needed for generating containers seamlessly
};

export const Images: any = {
    UserAvatar,
    // get UserAvatar() {
    //     return this._UserAvatar;
    // },
    Annotation,
    InspectionStation,
    Pic001,
    Pic004,
    Pic007,
    Pic010,
    ProjectImg,
    Rejection,
    Solihull,
    CloseBtnSmall,
    Logo,
    IndustrialServicesLogo,
    Pic002,
    Pic005,
    Pic008,
    Project2Img,
    Reshoot,
    UserLogo,
    CarParts,
    InspectionAnomaly,
    Nitra,
    Pic003,
    Pic006,
    Pic009,
    Project3Img,
    ProjectMap,
    Signature,
    Affalterbach,
    Berlin,
    Bremen,
    Hamburg,
    Kamenz,
    Kolleda,
    Rastatt,
    Sindelfingen,
    Stuttgart,
    Pic012,
    DefaultAvatar,
    Chart,
    Hammer,
    Upload,
    EluLogo,
    EluPDFLogo,
    Stanleylogo,
    UploadYellow,
    ChartYellow,
    HammerYellow,
    NoData,
    Empty,
    TileImage,
    //rivian,
    jlr,
    LandRover,
    daimler,
    RivianLanding,
    RivianLightLogo,
    RivianDarkLogo,
};

Images.profilePic = (name: string) => Images[name];
export const API_REQUEST_DATE_FORMAT = 'YYYY-MM-DD H:mm:ss';
export const CHART_DATE_TIME_DISPLAY_FORMAT = 'YYYY-MM-DD H:mm:ss';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD H:mm';
export default constants;
