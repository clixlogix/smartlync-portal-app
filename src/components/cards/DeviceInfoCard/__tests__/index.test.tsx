import * as React from 'react';
import { render } from '@testing-library/react';

import { DeviceInfoCard } from '..';

describe('<DeviceInfoCard  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<DeviceInfoCard />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
