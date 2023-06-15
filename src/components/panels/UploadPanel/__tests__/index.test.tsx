import * as React from 'react';
import { render } from '@testing-library/react';

import { UploadPanel } from '..';

describe('<UploadPanel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<UploadPanel />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
