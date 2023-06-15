import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { FailureRateTrend } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <FailureRateTrend />
        </HelmetProvider>,
    );

describe('<FailureRateTrend />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
