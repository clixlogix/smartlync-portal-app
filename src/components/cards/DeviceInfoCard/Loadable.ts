/**
 *
 * Asynchronously loads the component for DeviceInfoCard
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DeviceInfoCard = lazyLoad(
    () => import('./DeviceInfoCard'),
    (module) => module.DeviceInfoCard,
);

export default DeviceInfoCard;
