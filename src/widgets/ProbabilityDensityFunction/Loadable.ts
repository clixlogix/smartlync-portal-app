/**
 *
 * Asynchronously loads the component for ProbabilityDensityFunction
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProbabilityDensityFunction = lazyLoad(
    () => import('./ProbabilityDensityFunction'),
    (module) => module.ProbabilityDensityFunction,
);

export default ProbabilityDensityFunction;
