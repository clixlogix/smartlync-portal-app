import styled from 'styled-components/macro';
import { Link as RouterLink } from 'react-router-dom';
import { theme } from 'styles/theme/styledTheme';

export const Link = styled(RouterLink)`
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

export default Link;
