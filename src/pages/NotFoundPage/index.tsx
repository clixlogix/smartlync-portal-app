/**
 * Asynchronously loads the component for NotFoundPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import CircularProgress from '@mui/material/CircularProgress';

export const NotFoundPage = lazyLoad(
    () => import('./NotFoundPage'),
    (module) => module.NotFoundPage,
    {
        fallback: <CircularProgress />,
    },
);
