import * as React from 'react';
import { render } from '@testing-library/react';

import { PageTitle } from '..';

describe('<PageTitle  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<PageTitle />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
