import styled from 'styled-components/macro';
import { theme } from 'styles/theme/styledTheme';

export const A = styled.a`
    color: ${theme.primary};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
        opacity: 0.8;
    }

    &:active {
        opacity: 0.4;
    }
`;
