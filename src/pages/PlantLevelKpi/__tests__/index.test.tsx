import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { PlantLevelKpi } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <PlantLevelKpi />
        </HelmetProvider>,
    );

describe('<PlantLevelKpi />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
