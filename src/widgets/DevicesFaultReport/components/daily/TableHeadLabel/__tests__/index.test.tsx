import * as React from 'react';
import { render } from '@testing-library/react';

import { TableHeadLabel } from '..';

describe('<TableHeadLabel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<TableHeadLabel />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
