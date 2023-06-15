/**
 *
 * Asynchronously loads the component for DeviceAreaGraph
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DeviceAreaGraph = lazyLoad(
    () => import('./DeviceAreaGraph'),
    (module) => module.DeviceAreaGraphWidget,
);

export default DeviceAreaGraph;
