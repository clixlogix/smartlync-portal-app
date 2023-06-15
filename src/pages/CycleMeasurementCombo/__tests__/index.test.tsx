import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { CycleMeasurementCombo } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <CycleMeasurementCombo />
        </HelmetProvider>,
    );

describe('<CycleMeasurementCombo />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
