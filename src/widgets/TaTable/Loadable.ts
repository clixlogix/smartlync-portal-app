/**
 *
 * Asynchronously loads the component for TaTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TaTable = lazyLoad(
    () => import('./TaTable'),
    (module) => module.TaTable,
);

export default TaTable;
