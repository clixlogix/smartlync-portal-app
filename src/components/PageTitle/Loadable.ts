/**
 *
 * Asynchronously loads the component for PageTitle
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PageTitle = lazyLoad(
    () => import('./PageTitle'),
    (module) => module.PageTitle,
);

export default PageTitle;
