import * as React from 'react';
import { render } from '@testing-library/react';

import { SelectField } from '..';

describe('<SelectField  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<SelectField />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
