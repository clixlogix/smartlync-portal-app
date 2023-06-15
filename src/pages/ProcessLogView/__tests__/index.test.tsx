import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { ProcessLogView } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <ProcessLogView />
        </HelmetProvider>,
    );

describe('<ProcessLogView />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
