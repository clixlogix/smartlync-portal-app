import * as React from 'react';
import { render } from '@testing-library/react';

import { NavProfile } from '..';

describe('<NavProfile  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<NavProfile />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
