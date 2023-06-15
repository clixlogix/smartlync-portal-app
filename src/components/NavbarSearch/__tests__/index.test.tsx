import * as React from 'react';
import { render } from '@testing-library/react';

import { NavbarSearch } from '..';

describe('<NavbarSearch  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<NavbarSearch />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
