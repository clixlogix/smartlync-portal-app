import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { TopXFaultCountAnalysis } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <TopXFaultCountAnalysis />
        </HelmetProvider>,
    );

describe('<TopXFaultCountAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
