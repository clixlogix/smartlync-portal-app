/**
 *
 * Asynchronously loads the component for UploadStat
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UploadStat = lazyLoad(
    () => import('./UploadStat'),
    (module) => module.UploadStatWidget,
);

export default UploadStat;
