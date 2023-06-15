import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { TtrAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <TtrAnalysis />
        </HelmetProvider>,
    );

describe('<TtrAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
