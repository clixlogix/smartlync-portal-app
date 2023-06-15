/**
 *
 * Asynchronously loads the component for Program
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Program = lazyLoad(
    () => import('./Program'),
    (module) => module.Program,
);

export default Program;
