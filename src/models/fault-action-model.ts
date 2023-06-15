import { Moment } from 'moment';
/**
 *
 *
 * @export
 * @enum {number}
 */
export enum FaultActionType {
    All = 'All',
    RecommendedAction = '1',
    UserAction = '2',
    Comment = '3',
    None = '-1',
}

/**
 *
 *
 * @export
 * @interface IFaultAction
 */
export interface IFaultAction {
    faultCode?: string;
    studType?: string;
    deviceName?: string;
    occurredOn?: string;
    actionDetail?: string;
    actionId?: string | undefined;
    actionType: FaultActionType;
    actionBy?: string;
    plantId?: string;
    actionDate?: Moment;
    id?: string;
    actionComment?: string;
    eventCode?: string;
    eventType?: string | number;
}

/**
 *
 *
 * @export
 * @class FaultAction
 * @implements {IFaultAction}
 */
export class FaultAction implements IFaultAction {
    faultCode?: string;
    studType?: string;
    deviceName?: string;
    occurredOn?: string;
    actionDetail?: string;
    actionId?: string | undefined;
    actionType: FaultActionType;
    actionBy?: string;
    plantId?: string;
    actionDate?: Moment;
    actionKey?: string;
    id?: string;
    actionComment?: string;
    eventCode?: string;
    eventType?: string | number;

    constructor(o: any = {}) {
        const {
            id = `1-${Math.random()}`,
            faultCode = '',
            studType = '',
            deviceName = '',
            occurredOn = '',
            actionDetail = '',
            actionId = '',
            actionType = FaultActionType.None,
            actionBy = '',
            plantId = '',
            actionDate = '',
            actionKey = '',
            actionComment = '',
        } = o || ({} as any);

        this.id = id;
        this.faultCode = faultCode;
        this.studType = studType;
        this.deviceName = deviceName;
        this.occurredOn = occurredOn;
        this.actionDetail = actionDetail;
        this.actionId = actionId;
        this.actionType = actionType;
        this.actionBy = actionBy;
        this.plantId = plantId;
        this.actionDate = actionDate;
        this.actionKey = actionKey;
        this.actionComment = actionComment;
    }
}

export type FaultActions = FaultAction[];

export default FaultAction;
