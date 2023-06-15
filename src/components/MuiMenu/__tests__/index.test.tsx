import * as React from 'react';
import { render } from '@testing-library/react';

import { MuiMenu } from '..';

describe('<MuiMenu  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<MuiMenu />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
