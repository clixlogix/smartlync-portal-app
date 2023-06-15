/**
 *
 * Asynchronously loads the component for SideFilterPanel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SideFilterPanel = lazyLoad(
    () => import('./SideFilterPanel'),
    (module) => module.SideFilterPanel,
);

export default SideFilterPanel;
