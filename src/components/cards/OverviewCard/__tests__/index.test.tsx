import * as React from 'react';
import { render } from '@testing-library/react';

import { OverviewCard } from '..';

describe('<OverviewCard  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<OverviewCard />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
