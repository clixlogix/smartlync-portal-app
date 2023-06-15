import * as React from 'react';
import { render } from '@testing-library/react';

import { MuiDateRangePicker } from '..';

describe('<MuiDateRangePicker  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<MuiDateRangePicker />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
