import * as React from 'react';
import { render } from '@testing-library/react';

import { DashboardFilterPanel } from '..';

describe('<DashboardFilterPanel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<DashboardFilterPanel />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
