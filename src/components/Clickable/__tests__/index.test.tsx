import * as React from 'react';
import { render } from '@testing-library/react';

import { Clickable } from '..';

describe('<Clickable  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<Clickable />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
