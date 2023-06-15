import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import i18next from 'i18next';
import { ThemeProvider, Theme, StyledEngineProvider, DefaultTheme } from 'styled-components';

import { LanguageSwitch } from '..';
import { themes } from 'styles/theme/themes';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const renderLanguageSwitch = (theme?: DefaultTheme) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme || themes.light}>
                <LanguageSwitch />
            </ThemeProvider>
        </StyledEngineProvider>,
    );
describe('<LanguageSwitch />', () => {
    it('should have 2 radio buttons', () => {
        const languageSwitch = renderLanguageSwitch();
        expect(languageSwitch.queryAllByRole('radio').length).toBe(2);
    });

    it('should have translated FormLabel ', async () => {
        const t = await i18n;
        let txt: any;

        i18next.changeLanguage('en');

        let languageSwitch = renderLanguageSwitch();
        txt = t(translations.i18nFeature.selectLanguage);
        let label = languageSwitch.queryByText(txt);
        expect(label).toBeInTheDocument();

        languageSwitch.unmount();
        i18next.changeLanguage('de');

        languageSwitch = renderLanguageSwitch();
        txt = t(translations.i18nFeature.selectLanguage);
        label = languageSwitch.queryByText(txt);
        expect(label).toBeInTheDocument();
    });

    it('should change language on click', async () => {
        i18next.changeLanguage('en');
        const languageSwitch = renderLanguageSwitch();
        const radio2 = languageSwitch.queryAllByRole('radio')[1];
        fireEvent.click(radio2);
        expect(i18next.language).toEqual('de');
    });
});
