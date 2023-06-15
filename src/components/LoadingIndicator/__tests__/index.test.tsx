import * as React from 'react';
import { render } from '@testing-library/react';

import CircularProgress from '@mui/material/CircularProgress';
import { Theme, themes } from 'styles/theme/themes';
import { DefaultTheme } from 'styled-components';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const renderWithTheme = (props: Parameters<typeof CircularProgress>[number] = {}, theme?: DefaultTheme) =>
    render(<CircularProgress {...props} />);

describe('<LoadingIndicator />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = renderWithTheme();
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when props changed', () => {
        const loadingIndicator = renderWithTheme({ small: true });
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });

    it('should have theme', () => {
        const loadingIndicator = renderWithTheme();
        expect(loadingIndicator.container.querySelector('circle')).toHaveStyle(`stroke: ${themes.light.primary}`);
    });
});
