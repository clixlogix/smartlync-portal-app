/**
 *
 *
 * @export
 * @class FaultsPerDeviceHistogramSpr
 */
import { ChartData } from 'models';

export interface FaultsPerDeviceHistogramSpr {
    faultCode?: string;
    eventCode?: string;
    occurrences?: number;
    deviceName?: string;
    details?: { description: string; extendedDescription: string };
}

export type FaultsPerDeviceHistogramSprs = ChartData[];

export default FaultsPerDeviceHistogramSpr;
