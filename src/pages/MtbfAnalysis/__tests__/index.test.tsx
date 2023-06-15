import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { MtbfAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <MtbfAnalysis />
        </HelmetProvider>,
    );

describe('<MtbfAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
