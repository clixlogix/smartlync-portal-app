/**
 *
 * Asynchronously loads the component for OverviewCard
 *
 */

import { lazyLoad } from 'utils/loadable';

export const OverviewCard = lazyLoad(
    () => import('./OverviewCard'),
    (module) => module.OverviewCard,
);
