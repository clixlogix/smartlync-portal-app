import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { FaultCountTrend } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <FaultCountTrend />
        </HelmetProvider>,
    );

describe('<FaultCountTrend />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
