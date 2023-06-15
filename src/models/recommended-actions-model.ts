import { FaultActionType } from 'models';

export interface RecommendedData {
    actionId?: string | undefined;
    actionDetail?: string;
    recommendedChecked?: boolean;
    takenChecked?: boolean;
    actionType: FaultActionType;
}

export interface FaultActionPayload {
    checked: { recommendedChecked?: boolean; takenChecked?: boolean };
    actionId?: string;
    actionType: FaultActionType;
}

export interface RecommendedAction {
    fault_Code?: string;
    description?: string;
    extendedDescription?: string;
    recommendedAction?: RecommendedData[];
    checked?: boolean;
}

export type RecommendedActions = RecommendedAction[];

export interface ActionData {
    studType?: string;
    actionDate?: string;
    actionId?: string;
    actionType?: string;
    comment?: string;
    occurredOn?: string;
    recommendedAction?: string;
    userName?: string;
}

export type ActionDataArray = ActionData[];

export default RecommendedAction;
