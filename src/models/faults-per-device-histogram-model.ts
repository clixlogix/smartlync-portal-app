/**
 *
 *
 * @export
 * @class FaultsPerDeviceHistogram
 */
import { ChartData } from 'models';

export class FaultsPerDeviceHistogram {
    faultCode?: string;
    eventCode?: string;
    occurrences?: number;
    deviceName?: string;
    details?: { description: string; extendedDescription: string };
}

export type FaultsPerDeviceHistograms = ChartData[];

export default FaultsPerDeviceHistogram;
