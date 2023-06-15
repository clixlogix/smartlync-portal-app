import * as React from 'react';
import { render } from '@testing-library/react';

import { NavCard } from '..';

describe('<AppNavBar  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<NavCard />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
