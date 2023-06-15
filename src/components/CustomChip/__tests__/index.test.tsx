import * as React from 'react';
import { render } from '@testing-library/react';

import { Chip } from '..';

describe('<Chip  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<Chip />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
