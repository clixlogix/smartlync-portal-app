import * as React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import {  } from '..';

const renderComponent = () =>
  render(
      <HelmetProvider>
        <  />
      </HelmetProvider>
  );

describe('< />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
