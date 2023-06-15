/**
 *
 * Asynchronously loads the component for SelectAggregateColumn
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectAggregateColumn = lazyLoad(
    () => import('./SelectAggregateColumn'),
    (module) => module.SelectAggregateColumn,
);

export default SelectAggregateColumn;
