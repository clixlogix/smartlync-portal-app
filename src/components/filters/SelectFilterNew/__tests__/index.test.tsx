import * as React from 'react';
import { render } from '@testing-library/react';

import { SelectFilter } from '..';

describe('<SelectFilter  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<SelectFilter />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
