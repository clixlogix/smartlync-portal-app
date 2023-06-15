import * as React from 'react';
import { NotFoundPage } from '..';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from 'styled-components';
import { themes } from 'styles/theme/themes';
import { HelmetProvider } from 'react-helmet-async';
import renderer from 'react-test-renderer';
import { Link } from 'components/Link';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const renderPage = () =>
    renderer.create(
        <MemoryRouter>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes.light}>
                    <HelmetProvider>
                        <NotFoundPage />
                    </HelmetProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </MemoryRouter>,
    );

describe('<NotFoundPage />', () => {
    it('should match snapshot', () => {
        const notFoundPage = renderPage();
        expect(notFoundPage.toJSON()).toMatchSnapshot();
    });

    it('should should contain Link', () => {
        const notFoundPage = renderPage();
        expect(notFoundPage.root.findByType(Link)).toBeDefined();
    });
});
