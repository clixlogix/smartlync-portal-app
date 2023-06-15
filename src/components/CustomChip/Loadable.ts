/**
 *
 * Asynchronously loads the component for Chip
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CustomChip = lazyLoad(
    () => import('./CustomChip'),
    (module) => module.CustomChip,
);

export default CustomChip;
