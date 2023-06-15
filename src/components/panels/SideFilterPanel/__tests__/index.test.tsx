import * as React from 'react';
import { render } from '@testing-library/react';

import { SideFilterPanel } from '..';

describe('<SideFilterPanel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<SideFilterPanel />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
