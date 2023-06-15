import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { EssentialControlChart } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <EssentialControlChart />
        </HelmetProvider>,
    );

describe('<EssentialControlChart />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
