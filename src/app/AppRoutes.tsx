import { RouteItem, RouteItems } from 'models';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { selectDashboards } from 'services/dashboard/dashboard-selectors';

import { PrivateRoute } from 'components/auth/PrivateRoute';
import { SignIn } from 'pages/SignIn';
import { ReportingView } from 'pages/ReportingView/Loadable';
import { ReportingViewSpr } from 'pages/ReportingViewSpr/Loadable';
import { ReportingViewB } from 'pages/ReportingViewB/Loadable';
import { ReportingViewBspr } from 'pages/ReportingViewBspr/Loadable';
import { FileUpload } from 'pages/FileUpload/Loadable';
import { PlantLevelKpi } from 'pages/PlantLevelKpi/Loadable';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { FilterNames } from 'models';
import { CarBodyDurationsPerStation } from 'pages/CarBodyDurationsPerStation/Loadable';
import { CarbodyRiskAnalysis } from 'pages/CarbodyRiskAnalysis/Loadable';
import { CycleGapTempo } from 'pages/CycleGapTempo/Loadable';
import { CyclegapTempoSpr } from 'pages/CyclegapTempoSpr/Loadable';
import { CycleMeasurementCombo } from 'pages/CycleMeasurementCombo/Loadable';
import { DailyFaultTrends } from 'pages/DailyFaultTrends/Loadable';
import { DashboardPowerBi } from 'pages/DashboardPowerBi/Loadable';
import { EluPlatformAnalytics } from 'pages/EluPlatformAnalytics/Loadable';
import { EssentialControlChart } from 'pages/EssentialControlChart/Loadable';
import { EssentialControlChartSpr } from 'pages/EssentialControlChartSpr/Loadable';
import { FailureRateTrend } from 'pages/FailureRateTrend/Loadable';
import { FailureRateTrendSpr } from 'pages/FailureRateTrendSpr/Loadable';
import { FaultCountTrend } from 'pages/FaultCountTrend/Loadable';
import { FaultCountTrendSpr } from 'pages/FaultCountTrendSpr/Loadable';
import { FleetOverview } from 'pages/FleetOverview/Loadable';
import { GraphDataAnalysis } from 'pages/GraphDataAnalysis';
import { LandingPage } from 'pages/LandingPage/Loadable';
import { MaintainanceAction } from 'pages/MaintainanceAction/Loadable';
import { Measurements } from 'pages/Measurements/Loadable';
import { MeasurementTrend } from 'pages/MeasurementTrend/Loadable';
import { MtbfAnalysis } from 'pages/MtbfAnalysis/Loadable';
import { MtbfAnalysisSpr } from 'pages/MtbfAnalysisSpr/Loadable';
import { MttrAnalysis } from 'pages/MttrAnalysis/Loadable';
import { MttrAnalysisSpr } from 'pages/MttrAnalysisSpr';
import { OpportunityAnalysisTool } from 'pages/OpportunityAnalysisTool/Loadable';
import { ParetoAnalysis } from 'pages/ParetoAnalysis/Loadable';
import { ParetoAnalysisSpr } from 'pages/ParetoAnalysisSpr/Loadable';
import { PlantHealthOverview } from 'pages/PlantHealthOverview/Loadable';
import { PlantHealthOverviewSpr } from 'pages/PlantHealthOverviewSpr/Loadable';
import { ProcessLogView } from 'pages/ProcessLogView/Loadable';
import { ProcessLogViewSpr } from 'pages/ProcessLogViewSpr/Loadable';
import { Program } from 'pages/Program/Loadable';
import { SaTrend } from 'pages/SaTrend/Loadable';
import { Settings } from 'pages/Settings/Loadable';
import { StationAvailability } from 'pages/StationAvailability/Loadable';
import { TaAnalysis } from 'pages/TaAnalysis/Loadable';
import { TopXFaultCountAnalysis } from 'pages/TopXFaultCountAnalysis/Loadable';
import { TopXFaultCountAnalysisSpr } from 'pages/TopXFaultCountAnalysisSpr/Loadable';
import { TtrAnalysis } from 'pages/TtrAnalysis/Loadable';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { TaAnalysisSpr } from 'pages/TaAnalysisSpr/Loadable';
import { MeasurementsSpr } from 'pages/MeasurementsSpr/Loadable';
import ForgetPass from 'pages/forgetPassword/forgetPassword';
import UserManagement from 'pages/UserManagement';
import { DReportPage } from 'pages/DReportPage/Loadable';
// [INSERT NEW PAGE IMPORT ABOVE]  Needed for generating pages seamlessly

interface AppRoutesProps { }

interface Components {
    [key: string]: any;
}

const ComponentList: Components = {
    LandingPage,
    SignIn,
    ReportingView,
    ReportingViewB,
    FileUpload,
    PlantLevelKpi,
    DashboardPowerBi,
    ProcessLogView,
    ParetoAnalysis,
    FailureRateTrend,
    FaultCountTrend,
    FaultCountTrendSpr,
    EssentialControlChart,
    MtbfAnalysis,
    MttrAnalysis,
    MaintainanceAction,
    TaAnalysis,
    TopXFaultCountAnalysis,
    TopXFaultCountAnalysisSpr,
    CarbodyRiskAnalysis,
    PlantHealthOverview,
    Settings,
    EluPlatformAnalytics,
    MeasurementTrend,
    CycleGapTempo,
    CarBodyDurationsPerStation,
    DailyFaultTrends,
    StationAvailability,
    FleetOverview,
    SaTrend,
    GraphDataAnalysis,
    OpportunityAnalysisTool,
    CycleMeasurementCombo,
    Measurements,
    Program,
    ProcessLogViewSpr,
    TtrAnalysis,
    CyclegapTempoSpr,
    ParetoAnalysisSpr,
    PlantHealthOverviewSpr,
    FailureRateTrendSpr,
    ReportingViewBspr,
    ReportingViewSpr,
    EssentialControlChartSpr,
    MtbfAnalysisSpr,
    MttrAnalysisSpr,
    TaAnalysisSpr,
    MeasurementsSpr,
    ForgetPass,
    UserManagement,
    DReportPage,
    // [INSERT NEW PAGE COMPONENT ABOVE]  Needed for generating pages seamlessly
};

function getRoutes(routes: RouteItems = []): any[] {
    return routes.reduce((acc = [], child: RouteItem) => {
        const { children = [] } = child;

        if (!child.route) {
            return acc;
        }

        return [...acc, ...(!children?.length ? [child] : getRoutes(children))];
    }, [] as any[]);
}

const AppRoutes: React.FC<AppRoutesProps> = (props: AppRoutesProps) => {
    const routes: RouteItems = getRoutes(useSelector(selectDashboards));
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);
    return (
        <PageLayout>
            <>
                {routes?.length &&
                    routes.map((route: RouteItem, index: number) => {
                        const cmpName: string =
                            (breadCrumbsDataType[FilterNames.systemType] === 'SPR'
                                ? route['componentSPR']
                                : route['component']) || '';
                        const cmp: any = route.roles?.length ? (
                            <PrivateRoute>{ComponentList[cmpName]}</PrivateRoute>
                        ) : (
                            ComponentList[cmpName]
                        );
                        /* check if the component exists for each route */
                        return typeof ComponentList[cmpName] !== 'undefined' ? (
                            <Route exact key={index} path={route.route} component={cmp} />
                        ) : (
                            <React.Fragment />
                        );
                    })}
            </>
        </PageLayout>
    );
};

export default AppRoutes;
