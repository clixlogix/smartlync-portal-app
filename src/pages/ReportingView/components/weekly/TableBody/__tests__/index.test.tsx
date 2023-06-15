import * as React from 'react';
import { render } from '@testing-library/react';

import { TableBody } from '..';

describe('<TableBody  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<TableBody />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
