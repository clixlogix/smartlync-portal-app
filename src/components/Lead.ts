import styled from 'styled-components/macro';
import { theme } from 'styles/theme/styledTheme';

export const Lead = styled.p`
    font-size: 1.5rem;
    font-weight: 300;
    line-height: 1.5;
    color: ${theme.textSecondary};
    margin: 0 0 1.5rem 0;

    strong {
        color: ${theme.text};
    }
`;
