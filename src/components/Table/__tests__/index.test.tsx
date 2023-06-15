import * as React from 'react';
import { render } from '@testing-library/react';

import { Table } from '..';

describe('<Table  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<Table />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
