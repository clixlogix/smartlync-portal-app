/**
 *
 * Asynchronously loads the component for MuiDateTime
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MuiDateTime = lazyLoad(
    () => import('./MuiDateTime'),
    (module) => module.MuiDateTime,
);

export default MuiDateTime;
