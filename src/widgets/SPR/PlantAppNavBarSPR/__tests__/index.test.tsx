import * as React from 'react';
import { render } from '@testing-library/react';

import { PlantAppNavBarSpr } from '..';

const renderComponent = () => render(<PlantAppNavBarSpr />);

describe('<PlantAppNavBarSpr />', () => {
    it('should match the snapshot', () => {
        const component = renderComponent();
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
