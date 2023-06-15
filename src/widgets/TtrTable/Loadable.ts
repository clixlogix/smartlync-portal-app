/**
 *
 * Asynchronously loads the component for TtrTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TtrTable = lazyLoad(
    () => import('./TtrTable'),
    (module) => module.TtrTableWidget,
);

export default TtrTable;
