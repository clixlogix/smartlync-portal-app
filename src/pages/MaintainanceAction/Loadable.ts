/**
 *
 * Asynchronously loads the component for MaintainanceAction
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MaintainanceAction = lazyLoad(
    () => import('./MaintainanceAction'),
    (module) => module.MaintainanceAction,
);

export default MaintainanceAction;
