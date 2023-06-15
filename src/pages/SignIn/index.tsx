// import SignIn from './SignIn';

// export { SignIn };

// export default SignIn;

/**
 *
 * Asynchronously loads the component for SignIn
 *
 */
import * as React from 'react';
import Container from '@mui/material/Container';
import styled from 'styled-components/macro';
import { lazyLoad } from 'utils/loadable';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const fallback = (
    <LoadingWrapper className="page signin-page">
        <Container className={'sign-in-dialog'}>
            <CircularProgress />
        </Container>
    </LoadingWrapper>
);

export const SignIn = lazyLoad(
    () => import('./SignIn'),
    (module) => module.SignIn,
    {
        fallback,
    },
);
