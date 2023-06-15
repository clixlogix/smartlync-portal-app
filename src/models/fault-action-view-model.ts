import { IFaultAction } from 'models';
import { Moment } from 'moment';

/**
 *
 *
 * @export
 * @class FaultActionView
 */
export interface FaultActionView extends IFaultAction {
    actionBy?: string;
    recommendedChecked?: boolean;
    takenChecked?: boolean;
    plantId?: string;
    dirty?: boolean;
    actionDate?: Moment;
    actionKey?: string;
    eventTypeCode?: number;
}

export type FaultActionViews = FaultActionView[];

export default FaultActionView;
