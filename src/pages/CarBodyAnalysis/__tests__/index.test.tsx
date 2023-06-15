import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { CarBodyAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <CarBodyAnalysis />
        </HelmetProvider>,
    );

describe('<CarBodyAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
