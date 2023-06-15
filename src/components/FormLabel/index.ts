import styled from 'styled-components/macro';
import { theme } from 'styles/theme/styledTheme';

export const FormLabel = styled.label`
    text-transform: uppercase;
    font-weight: normal;
    margin: 0;
    padding: 0;
    color: ${theme.textSecondary};
    font-size: 0.75rem;
`;
