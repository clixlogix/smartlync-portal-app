import * as React from 'react';
import { render } from '@testing-library/react';

import { EventCodeFrequency } from '..';

const renderComponent = () => render(<EventCodeFrequency />);

describe('<EventCodeFrequency />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
