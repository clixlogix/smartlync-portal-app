import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { MaintainanceAction } from '..';

const renderComponent = () =>
    render(
        <HelmetProvider>
            <MaintainanceAction />
        </HelmetProvider>,
    );

describe('<MaintainanceAction />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
