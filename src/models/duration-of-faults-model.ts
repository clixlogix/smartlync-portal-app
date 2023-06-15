/**
 *
 *
 * @export
 * @class DurationOfFaults
 */
export interface DurationOfFault {
    duration: string;
    faultCode: string;
    description: string;
    extendedDescription: string;
}

export type DurationOfFaults = DurationOfFault[];

export default DurationOfFault;
