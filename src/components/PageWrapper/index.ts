import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export const PageWrapper = styled.div`
    width: 960px;
    margin: 0 auto;
    padding: 0 1.5rem;
    box-sizing: content-box;
`;

export const Wrapper = styled.div`
    height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 320px;
`;
