import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { ParetoAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <ParetoAnalysis />
        </HelmetProvider>,
    );

describe('<ParetoAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
