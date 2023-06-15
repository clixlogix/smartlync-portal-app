import * as React from 'react';
import { render } from '@testing-library/react';

import { ReadLabelValue } from '..';

describe('<ReadLabelValue  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<ReadLabelValue />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
