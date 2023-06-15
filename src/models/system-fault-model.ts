/**
 *
 *
 * @export
 * @interface SystemFault
 */
export interface SystemFault {
    description: string;
    deviceName: string;
    extendedDescription: string;
    index?: number;
    occurrences: string;
    position: string;
}

export type SystemFaults = SystemFault[];

export default SystemFault;
