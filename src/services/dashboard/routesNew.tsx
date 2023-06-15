import AcUnitIcon from '@mui/icons-material/AcUnit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BackupIcon from '@mui/icons-material/Backup';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ExtensionIcon from '@mui/icons-material/Extension';
import GamesOutlinedIcon from '@mui/icons-material/GamesOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LaptopWindowsOutlinedIcon from '@mui/icons-material/LaptopWindowsOutlined';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { RouteItems } from 'models';
import { isHidden } from 'utils';

/**** new routes definition ****/

const overViewChildren = [
    {
        label: 'PlantOverview.MenuLabel',
        route: '/plantHealthOverview',
        component: 'PlantHealthOverview',
        componentSPR: 'PlantHealthOverviewSpr',
        roles: [],
        disabled: false,
        icon: <DonutLargeIcon />,
    },
    {
        label: 'SystemOverview.MenuLabel',
        route: '/systemOverview',
        component: 'FleetOverview',
        componentSPR: 'FleetOverview',
        roles: [],
        disabled: false,
        icon: <GamesOutlinedIcon />,
    },
];

const measurementsChildren = [
    {
        label: 'Measurements.PageTitle',
        route: '/measurements',
        component: 'Measurements',
        componentSPR: 'MeasurementsSpr',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'ProcessLogView.PageTitle',
        route: '/processLog',
        component: 'ProcessLogView',
        componentSPR: 'ProcessLogViewSpr',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler']),
        icon: <TimelineOutlinedIcon />,
    },
    {
        label: 'CycleGapTempo.PageTitle',
        route: '/cycleGapTempo',
        component: 'CycleGapTempo',
        componentSPR: 'CyclegapTempoSpr',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'CycleMeasurementCombo.PageTitle',
        route: '/cycleMeasurementCombo',
        component: 'CycleMeasurementCombo',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'EssentialControlChart.MenuTitle',
        route: '/essentialControlChart',
        component: 'EssentialControlChart',
        componentSPR: 'EssentialControlChartSpr',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
];

const recommendationsChildren = [
    {
        label: 'OpportunityAnalysisTool.MenuTitle',
        route: '/opportunityAnalysis',
        component: 'OpportunityAnalysisTool',
        componentSPR: 'OpportunityAnalysisTool',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'CarBodyDurationsPerStation.PageTitle',
        route: '/carBodyDurationsPerStation',
        component: 'CarBodyDurationsPerStation',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'CarBodyAnalysis.PageTitle',
        route: '/carBodyRiskAnalysis',
        component: 'CarbodyRiskAnalysis',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
];

const rootCauseChildren = [
    {
        label: 'ParetoAnalysis.MenuLabel',
        route: '/paretoAnalysis',
        component: 'ParetoAnalysis',
        componentSPR: 'ParetoAnalysisSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'FailureRateTrend.PageTitle',
        route: '/failureRateTrend',
        component: 'FailureRateTrend',
        componentSPR: 'FailureRateTrendSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'DReportPage.PageTitle',
        route: '/dReportPage',
        component: 'DReportPage',
        roles: [],
        disabled: isHidden(['jlr', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'FaultCountTrend.PageTitle',
        route: '/faultCountTrend',
        component: 'FaultCountTrend',
        componentSPR: 'FaultCountTrendSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'ReportingViewPage.PageTitle',
        route: '/reportingView',
        component: 'ReportingView',
        componentSPR: 'ReportingViewSpr',
        roles: [],
        disabled: false,
        icon: <AssessmentIcon />,
    },
    {
        label: 'ReportingViewPageB.PageTitle',
        route: '/reportingViewB',
        component: 'ReportingViewB',
        componentSPR: 'ReportingViewBspr',
        roles: [],
        disabled: false,
        icon: <TableChartOutlinedIcon />,
    },
    {
        label: 'TopXFaultCountAnalysis.PageTitle',
        route: '/topXFaultCountAnalysis',
        component: 'TopXFaultCountAnalysis',
        componentSPR: `TopXFaultCountAnalysisSpr`,
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
];

const technicalAvailabilityChildren = [
    {
        label: 'MtbfAnalysis.MenuTitle',
        route: '/mtbfAnalysis',
        component: 'MtbfAnalysis',
        componentSPR: 'MtbfAnalysisSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'MttrAnalysis.MenuTitle',
        route: '/mttrAnalysis',
        component: 'MttrAnalysis',
        componentSPR: 'MttrAnalysisSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'TtrAnalysis.PageTitle',
        route: '/ttrAnalysis',
        component: 'TtrAnalysis',
        roles: [],
        disabled: isHidden(['jlr', 'tucker', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'TaAnalysis.MenuTitle',
        route: '/taAnalysis',
        component: 'TaAnalysis',
        componentSPR: 'TaAnalysisSpr',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'TA Over Time',
        route: '/taOverTime',
        component: 'SaTrend',
        componentSPR: 'SaTrend',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
    },
];
const reliabilityChildren = [
    {
        label: 'StationAvailability.PageTitle',
        route: '/stationAvailability',
        component: 'StationAvailability',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'Menu.AvailabilityAndReliabilityTitle',
        route: '/mtbfAnalysis',
        roles: [],
        disabled: false,
        icon: <AccountTreeOutlinedIcon />,
        children: [...technicalAvailabilityChildren],
    },
];

const area51Children = [];

const integrationChildren = [
    {
        label: 'Dashboards',
        route: '/dashboards',
        component: 'DashboardPowerBi',
        roles: [],
        id: '0',
        url: [
            `https://app.powerbi.com/reportEmbed?reportId=468b3722-5c41-4c78-adf3-083b9a095681&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
            `https://app.powerbi.com/reportEmbed?reportId=a0bef869-7af8-41fa-abd1-4ba5572d2797&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
            `https://app.powerbi.com/reportEmbed?reportId=a4c6fdb9-7ddc-4eac-a45a-c1e37c5f74d9&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
        ],
        icon: <LaptopWindowsOutlinedIcon />,
        disabled: false,
        children: [],
    },
    {
        label: 'PlantLevelKpi.PageTitle',
        route: '/dashboards',
        component: 'DashboardPowerBi',
        id: '2',
        roles: [],
        url: `https://app.powerbi.com/reportEmbed?reportId=a0bef869-7af8-41fa-abd1-4ba5572d2797&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
        disabled: false,
        children: [],
        icon: <AcUnitIcon />,
    },
    {
        label: 'LabAnalysis.PageTitle',
        route: '/dashboards',
        component: 'DashboardPowerBi',
        id: '3',
        roles: [],
        url: `https://app.powerbi.com/reportEmbed?reportId=a4c6fdb9-7ddc-4eac-a45a-c1e37c5f74d9&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
        disabled: false,
        children: [],
        icon: <BubbleChartOutlinedIcon />,
    },
    {
        label: 'SummaryDashboard.PageTitle',
        route: '/dashboards',
        component: 'DashboardPowerBi',
        id: '1',
        roles: [],
        url: `https://app.powerbi.com/reportEmbed?reportId=468b3722-5c41-4c78-adf3-083b9a095681&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&filterPaneEnabled=false`,
        disabled: false,
        children: [],
        icon: <GridOnOutlinedIcon />,
    },
];

const parameterControlChildren = [
    {
        label: 'Program.PageTitle',
        route: '/program',
        component: 'Program',
        componentSPR: 'Program',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'tucker', 'demoStage', 'rivian', 'magna']),
        icon: <DonutLargeIcon />,
    },
];

const adminChildren = [
    {
        label: 'Settings',
        route: '/settings',
        component: 'Settings',
        roles: [],
        disabled: true,
        icon: <SettingsIcon />,
    },
    {
        label: 'Sidebar.EluAnalytics',
        route: '/eluPlatformAnalytics',
        component: 'EluPlatformAnalytics',
        roles: [],
        disabled: true,
        icon: <ExtensionIcon />,
    },
    {
        label: 'FileUpload.Title',
        route: '/upload',
        component: 'FileUpload',
        componentSPR: 'FileUpload',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demoStage', 'rivian']),
        icon: <BackupIcon />,
    },
    {
        label: 'Sidebar.Logout',
        route: '/',
        roles: [],
        disabled: false,
        icon: <LogoutIcon />,
    },
];

export const routes: RouteItems = [
    {
        label: 'HomePage.PageTitle',
        route: '/home',
        component: 'LandingPage',
        componentSPR: 'LandingPage',
        roles: [],
        disabled: false,
        icon: <HomeOutlinedIcon />,
    },
    {
        label: 'user management',
        route: '/user-management',
        component: 'UserManagement',
        componentSPR: 'UserManagement',
        roles: [],
        disabled: true,
        icon: <HomeOutlinedIcon />,
    },
    {
        label: 'Overview',
        route: '/plantHealthOverview',
        roles: [],
        disabled: false,
        children: [...overViewChildren],
        icon: <DonutLargeIcon />,
    },
    {
        label: 'Measurements.PageTitle',
        route: '/measurements',
        roles: [],
        disabled: false,
        children: [...measurementsChildren],
        icon: <ExtensionIcon />,
    },
    {
        label: 'Recommendations',
        route: '/opportunityAnalysis',
        roles: [],
        disabled: false,
        children: [...recommendationsChildren],
        icon: <TableChartOutlinedIcon />,
    },
    {
        label: 'Root Cause',
        route: '/paretoAnalysis',
        roles: [],
        disabled: false,
        children: [...rootCauseChildren],
        icon: <AssessmentIcon />,
    },
    {
        label: 'Reliability',
        route: '/mtbfAnalysis',
        roles: [],
        disabled: false,
        children: [...reliabilityChildren],
        icon: <TimelineOutlinedIcon />,
    },
    {
        label: 'Area 51',
        route: '/area51',
        roles: [],
        disabled: true,
        children: [...area51Children],
        icon: <AccountTreeOutlinedIcon />,
    },
    {
        label: 'Integration',
        route: '/integration',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        children: [...integrationChildren],
        icon: <InboxIcon />,
    },
    {
        label: 'Parameter Control',
        route: '/program',
        roles: [],
        disabled: isHidden(['v1daimler', 'volvo', 'daimler', 'jlr', 'demo', 'tucker', 'demoStage', 'rivian', 'magna']),
        children: [...parameterControlChildren],
        icon: <BackupIcon />,
    },
    {
        label: 'Admin',
        route: '/admin',
        roles: [],
        disabled: false,
        children: [...adminChildren],
        icon: <SettingsIcon />,
    },
    // [INSERT NEW PAGE COMPONENT ABOVE]  Needed for generating pages seamlessly
];
export default routes;
