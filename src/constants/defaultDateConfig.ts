import { SystemType } from 'constants/staticValues';

export enum Pages {
    PlantHealthOverview,
    FleetOverview,
    Measurements,
    DiagnosticLog,
    CycleGapTempo,
    EssentialControls,
    OpportunityAnalysis,
    Pareto,
    FailureRateTrend,
    FaultCountTrend,
    FailureModeAnalysis,
    Reporting,
    FaultsPerDevice,
    MTBF,
    MTTR,
    TA,
    TTR,
    CarBodyDuration,
    StationAvailability,
    MeasurementTrend,
    MaintainanceAction,
    CycleMeasurementCombo,
    PlatformAnalytics,
    LandingPage,
    DReport,
}

export enum Tenants {
    DEMO = 'demo',
    JLR = 'jlr',
    RIVIAN = 'rivian',
    V1DAIMLER = 'v1daimler',
    MAGNA = 'magna',
    TUCKER = 'tucker',
}

export type DefaultDateConfig = {
    [key in Tenants]?: {
        [key in Pages]?: {
            [key in SystemType]?: string;
        };
    };
};

export const DEMO_DASHBORAD_FILTER_TO_DATE = '2022-01-20 00:00:00';
export const DEMO_DASHBORAD_FILTER_TO_DATE_SPR = '2020-09-14 00:00:00';
export const JLR_DASHBORAD_FILTER_TO_DATE_SPR = '2021-02-22 00:00:00';
export const JLR_DASHBORAD_FILTER_TO_DATE_SWS = '2022-01-14 00:00:00';
export const RIVIAN_DASHBORAD_FILTER_TO_DATE = '2022-07-15 00:00:00';
export const MAGNA_DASHBORAD_FILTER_TO_DATE_SPR = '2022-09-22 00:00:00';

export const defaultDateConfig: DefaultDateConfig = {
    [Tenants.DEMO]: {
        [Pages.PlantHealthOverview]: {
            [SystemType.SWS]: '2022-08-07 00:00:00',
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FleetOverview]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Measurements]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DiagnosticLog]: {
            [SystemType.SWS]: '2022-01-10 10:00:00',
            [SystemType.SPR]: '2021-02-19 10:00:00',
        },
        [Pages.CycleGapTempo]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: '2021-02-19 00:00:00',
        },
        [Pages.EssentialControls]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.OpportunityAnalysis]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Pareto]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureRateTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultCountTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureModeAnalysis]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Reporting]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultsPerDevice]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MTBF]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.MTTR]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TA]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TTR]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CarBodyDuration]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.StationAvailability]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MeasurementTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CycleMeasurementCombo]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.PlatformAnalytics]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.LandingPage]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.DReport]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
    },

    [Tenants.JLR]: {
        [Pages.PlantHealthOverview]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FleetOverview]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Measurements]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DiagnosticLog]: {
            [SystemType.SWS]: '2022-01-14 09:00:00',
            [SystemType.SPR]: '2021-02-19 10:00:00',
        },
        [Pages.CycleGapTempo]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2021-02-19 00:00:00',
        },
        [Pages.EssentialControls]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.OpportunityAnalysis]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Pareto]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureRateTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultCountTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureModeAnalysis]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Reporting]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultsPerDevice]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MTBF]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.MTTR]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TA]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TTR]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CarBodyDuration]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.StationAvailability]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MeasurementTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.CycleMeasurementCombo]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.PlatformAnalytics]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.LandingPage]: {
            [SystemType.SWS]: '2022-01-07 00:00:00',
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DReport]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
    },
    [Tenants.RIVIAN]: {
        [Pages.PlantHealthOverview]: {
            [SystemType.SWS]: '2022-08-07 00:00:00',
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.FleetOverview]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.Measurements]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.DiagnosticLog]: {
            [SystemType.SWS]: '2022-01-10 10:00:00',
            [SystemType.SPR]: '2021-02-19 10:00:00',
        },
        [Pages.CycleGapTempo]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: '2021-02-19 00:00:00',
        },
        [Pages.EssentialControls]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.OpportunityAnalysis]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.Pareto]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.FailureRateTrend]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.FaultCountTrend]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.FailureModeAnalysis]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.Reporting]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.FaultsPerDevice]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.MTBF]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.MTTR]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TA]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TTR]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CarBodyDuration]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.StationAvailability]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MeasurementTrend]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CycleMeasurementCombo]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.PlatformAnalytics]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.LandingPage]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.DReport]: {
            [SystemType.SWS]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: RIVIAN_DASHBORAD_FILTER_TO_DATE,
        },
    },
    [Tenants.MAGNA]: {
        [Pages.PlantHealthOverview]: {
            [SystemType.SWS]: '2022-08-07 00:00:00',
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FleetOverview]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Measurements]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DiagnosticLog]: {
            [SystemType.SWS]: '2022-01-10 10:00:00',
            [SystemType.SPR]: '2021-02-19 10:00:00',
        },
        [Pages.CycleGapTempo]: {
            [SystemType.SWS]: '2022-01-10 00:00:00',
            [SystemType.SPR]: '2021-02-19 00:00:00',
        },
        [Pages.EssentialControls]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.OpportunityAnalysis]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Pareto]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureRateTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultCountTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureModeAnalysis]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Reporting]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultsPerDevice]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MTBF]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.MTTR]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TA]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TTR]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CarBodyDuration]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.StationAvailability]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: MAGNA_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MeasurementTrend]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CycleMeasurementCombo]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.PlatformAnalytics]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.LandingPage]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.DReport]: {
            [SystemType.SWS]: DEMO_DASHBORAD_FILTER_TO_DATE,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
    },
    [Tenants.TUCKER]: {
        [Pages.PlantHealthOverview]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FleetOverview]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Measurements]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DiagnosticLog]: {
            [SystemType.SWS]: '2022-01-14 09:00:00',
            [SystemType.SPR]: '2021-02-19 10:00:00',
        },
        [Pages.CycleGapTempo]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2021-02-19 00:00:00',
        },
        [Pages.EssentialControls]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.OpportunityAnalysis]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Pareto]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureRateTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultCountTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FailureModeAnalysis]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.Reporting]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.FaultsPerDevice]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MTBF]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.MTTR]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TA]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: '2020-11-16 00:00:00',
        },
        [Pages.TTR]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.CarBodyDuration]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: DEMO_DASHBORAD_FILTER_TO_DATE,
        },
        [Pages.StationAvailability]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.MeasurementTrend]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.CycleMeasurementCombo]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.PlatformAnalytics]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.LandingPage]: {
            [SystemType.SWS]: '2022-01-07 00:00:00',
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
        [Pages.DReport]: {
            [SystemType.SWS]: JLR_DASHBORAD_FILTER_TO_DATE_SWS,
            [SystemType.SPR]: JLR_DASHBORAD_FILTER_TO_DATE_SPR,
        },
    },
};
