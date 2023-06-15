import * as React from 'react';
import { render } from '@testing-library/react';

import { MultiSelect } from '..';

describe('<MultiSelect  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<MultiSelect />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
