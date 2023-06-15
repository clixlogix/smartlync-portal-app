/**
 *
 * Asynchronously loads the component for SearchField
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SearchField = lazyLoad(
    () => import('./SearchField'),
    (module) => module.SearchField,
);

export default SearchField;
