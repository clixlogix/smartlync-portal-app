import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { TaAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <TaAnalysis />
        </HelmetProvider>,
    );

describe('<TaAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
