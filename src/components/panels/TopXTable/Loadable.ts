/**
 *
 * Asynchronously loads the component for TopXTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopXTable = lazyLoad(
    () => import('./TopXTable'),
    (module) => module.TopXTablePanel,
);

export default TopXTable;
