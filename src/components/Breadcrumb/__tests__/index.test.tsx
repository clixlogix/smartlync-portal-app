import * as React from 'react';
import { render } from '@testing-library/react';

import { Breadcrumb } from '..';

describe('<Breadcrumb  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<Breadcrumb />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
