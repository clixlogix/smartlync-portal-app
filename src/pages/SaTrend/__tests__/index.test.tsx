import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { SaTrend } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <SaTrend />
        </HelmetProvider>,
    );

describe('<SaTrend />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
