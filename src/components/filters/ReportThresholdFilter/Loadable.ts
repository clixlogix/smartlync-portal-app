/**
 *
 * Asynchronously loads the component for SelectStudIdFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectStudIdFilter = lazyLoad(
    () => import('./ReportThresholdFilter'),
    (module) => module.ReportThresholdFilter,
);

export default SelectStudIdFilter;
