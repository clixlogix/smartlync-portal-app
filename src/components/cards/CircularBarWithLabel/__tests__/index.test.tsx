import * as React from 'react';
import { render } from '@testing-library/react';

import { CircularBarWithLabel } from '..';

describe('<CircularBarWithLabel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<CircularBarWithLabel />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
