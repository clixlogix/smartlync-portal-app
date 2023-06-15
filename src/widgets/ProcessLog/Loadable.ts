/**
 *
 * Asynchronously loads the component for ProcessLog
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProcessLog = lazyLoad(
    () => import('./ProcessLog'),
    (module) => module.ProcessLog,
);

export default ProcessLog;
