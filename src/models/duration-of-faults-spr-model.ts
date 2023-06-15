/**
 *
 *
 * @export
 * @class DurationOfFaultsSpr
 */
export interface DurationOfFaultsSpr {
    duration: string;
    faultCode: string;
    description: string;
    extendedDescription: string;
}

export type DurationOfFaultsSprs = DurationOfFaultsSpr[];

export default DurationOfFaultsSpr;
