/**
 *
 * Asynchronously loads the component for EluPlatformAnalytics
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EluPlatformAnalytics = lazyLoad(
    () => import('./EluPlatformAnalytics'),
    (module) => module.EluPlatformAnalytics,
);

export default EluPlatformAnalytics;
