import * as React from 'react';
import { render } from '@testing-library/react';

import { MuiDateTime } from '..';

describe('<MuiDateTime  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<MuiDateTime />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
