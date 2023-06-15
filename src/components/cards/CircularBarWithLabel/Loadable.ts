/**
 *
 * Asynchronously loads the component for CircularBarWithLabel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CircularBarWithLabel = lazyLoad(
    () => import('./CircularBarWithLabel'),
    (module) => module.CircularBarWithLabel,
);

export default CircularBarWithLabel;
