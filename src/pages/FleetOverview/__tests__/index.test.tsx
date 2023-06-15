import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { FleetOverview } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <FleetOverview />
        </HelmetProvider>,
    );

describe('<FleetOverview />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
