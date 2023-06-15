import * as React from 'react';
import { render } from '@testing-library/react';

import { ReportingViewChart } from '..';

describe('<ReportingViewChart  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<ReportingViewChart />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
