/**
 *
 * Asynchronously loads the component for EssentialControlWidgets
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EssentialControlWidgets = lazyLoad(
    () => import('./EssentialControlWidgets'),
    (module) => module.EssentialControlWidgetsWidget,
);

export default EssentialControlWidgets;
