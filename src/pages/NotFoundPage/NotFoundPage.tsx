import * as React from 'react';
import styled from 'styled-components/macro';
import { P } from 'components/P';
import { Link } from 'components/Link';
import { Helmet } from 'react-helmet-async';
import { StyleConstants } from 'styles/StyleConstants';
// import { PageHeader } from 'components/PageHeader';
import { theme } from 'styles/theme/styledTheme';

import './NotFoundPage.scss';

export function NotFoundPage() {
    return (
        <>
            <Helmet>
                <title>404 Page Not Found</title>
                <meta name="description" content="Page not found" />
            </Helmet>

            {/* <PageHeader /> */}
            <Wrapper>
                <Title>
                    4
                    <span role="img" aria-label="Crying Face">
                        😢
                    </span>
                    4
                </Title>
                <P>Page not found.</P>
                <Link to={process.env.PUBLIC_URL + '/'}>Return to Home Page</Link>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
    height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 320px;
`;

const Title = styled.div`
    margin-top: -8vh;
    font-weight: bold;
    color: ${theme.text};
    font-size: 3.375rem;

    span {
        font-size: 3.125rem;
    }
`;
