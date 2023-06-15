/**
 *
 * Asynchronously loads the component for LandingPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LandingPage = lazyLoad(
    () => import('./LandingPage'),
    (module) => module.LandingPageDefault,
);
