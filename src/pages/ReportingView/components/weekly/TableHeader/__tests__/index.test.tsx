import * as React from 'react';
import { render } from '@testing-library/react';

import { TableHeader } from '..';

describe('<TableHeader  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<TableHeader />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
