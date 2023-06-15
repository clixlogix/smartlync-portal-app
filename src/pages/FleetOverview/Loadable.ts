/**
 *
 * Asynchronously loads the component for FleetOverview
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FleetOverview = lazyLoad(
    () => import('./FleetOverview'),
    (module) => module.FleetOverview,
);

export default FleetOverview;
