import * as React from 'react';
import { render } from '@testing-library/react';

import { GridTable } from '..';

describe('<GridTable  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<GridTable />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
