import { lazyLoad } from 'utils/loadable';

export const TtrAnalysis = lazyLoad(
    () => import('./TtrAnalysis'),
    (module) => module.TtrAnalysis,
);

export default TtrAnalysis;
