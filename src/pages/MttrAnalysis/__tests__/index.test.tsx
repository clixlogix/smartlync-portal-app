import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { MttrAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <MttrAnalysis />
        </HelmetProvider>,
    );

describe('<MttrAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
