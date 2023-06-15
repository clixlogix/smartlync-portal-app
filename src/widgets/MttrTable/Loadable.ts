/**
 *
 * Asynchronously loads the component for MttrTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MttrTable = lazyLoad(
    () => import('./MttrTable'),
    (module) => module.MttrTableWidget,
);

export default MttrTable;
