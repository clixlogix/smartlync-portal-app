/**
 *
 * Asynchronously loads the component for TaTableSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TaTableSpr = lazyLoad(
    () => import('./TaTableSpr'),
    (module) => module.TaTableSprWidget,
);

export default TaTableSpr;
