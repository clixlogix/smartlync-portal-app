/**
 *
 * Asynchronously loads the component for DurationOfFaultsSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DurationOfFaultsSpr = lazyLoad(
    () => import('./DurationOfFaultsSpr'),
    (module) => module.DurationOfFaultsSprWidget,
);

export default DurationOfFaultsSpr;
