import * as React from 'react';
import { render } from '@testing-library/react';

import { MeanTimeBetweenFailureTableAnalysis } from '..';

const renderComponent = () => render(<MeanTimeBetweenFailureTableAnalysis />);

describe('<MeanTimeBetweenFailureTableAnalysis />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
