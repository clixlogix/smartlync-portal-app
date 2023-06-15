/**
 *
 * Asynchronously loads the component for Voltage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Voltage = lazyLoad(
    () => import('./Voltage'),
    (module) => module.Voltage,
);

export default Voltage;
