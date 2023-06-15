import * as React from 'react';
import { render } from '@testing-library/react';

import {  } from '..';

const renderComponent = () =>
  render(
        <  />
  );

describe('< />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
