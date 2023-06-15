import * as React from 'react';
import { render } from '@testing-library/react';

import {} from '..';

const renderComponent = () => render(<br />);

describe('<br />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
