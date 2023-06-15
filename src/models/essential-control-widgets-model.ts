/**
 *
 *
 * @export
 * @class EssentialControlWidgets
 */
export interface EssentialControlWidgets {
    deviceName: string;
    feederNo: string;
    outletNo: string;
    studId: string;
}

export type EssentialControlValue = [string, string, string, string, string, string];

export interface EssentialControlEvent {
    name: string;
    tags: EssentialControlWidgets;
    values: EssentialControlValue[];
}
export type EssentialControlWidgetss = EssentialControlWidgets[];

export default EssentialControlWidgets;
