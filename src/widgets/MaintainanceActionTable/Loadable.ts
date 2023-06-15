/**
 *
 * Asynchronously loads the component for MaintainanceActionTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MaintainanceActionTable = lazyLoad(
    () => import('./MaintainanceActionTable'),
    (module) => module.MaintainanceActionTableWidget,
);

export default MaintainanceActionTable;
