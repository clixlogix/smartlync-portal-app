import { Device } from 'models';
import RecommendedAction, { ActionDataArray } from './recommended-actions-model';

export enum PartsOrderStatus {
    Shipped = 'Shipped',
    Required = 'Required',
}

export enum OpportunityStatus {
    Open = 'Open',
    Closed = 'Closed',
}

export enum EstimatedImpactType {
    Range = 'Range',
}

export enum OpportunityStage {
    AR = 'AR',
    AT = 'AT',
    CC = 'CC',
}

export interface OpportunityImpact {
    type?: EstimatedImpactType;
    data?: { [key: string]: any }; // range from 2min/$800 tp 5min,$2000
    from?: string;
    to?: string;
    time?: string;
    value?: string;
    valueText?: string;
}
/**
 *
 *
 * @export
 * @interface OpportunityAnalysis
 */
export interface OpportunityAnalysis {
    deviceName: string;
    eventCode: string;
    station: string;
    description: string;
    deviceHealth: string;
    mttr: number;
    alpha: number;
    beta: number;
    studType: string;
    actionData: ActionDataArray;
    device?: Device;
    latestStage: OpportunityStage;
    occurredOn: string;
}

export type OpportunityAnalysiss = OpportunityAnalysis[];

export default OpportunityAnalysis;
