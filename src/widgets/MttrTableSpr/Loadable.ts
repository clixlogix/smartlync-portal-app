/**
 *
 * Asynchronously loads the component for MttrTableSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MttrTableSpr = lazyLoad(
    () => import('./MttrTableSpr'),
    (module) => module.MttrTableSprWidget,
);

export default MttrTableSpr;
