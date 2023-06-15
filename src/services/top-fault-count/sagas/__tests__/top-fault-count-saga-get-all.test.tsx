import * as React from 'react';
import { render } from '@testing-library/react';
import { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { configureAppStore } from 'store/configureStore';
import { TopFaultCount } from '..';

const renderComponent = (store: Store) =>
    render(
        <Provider store={store}>
            <TopFaultCount />
        </Provider>,
    );

describe('<TopFaultCount />', () => {
    let store: ReturnType<typeof configureAppStore>;

    beforeEach(() => {
        store = configureAppStore();
    });
    it('should match the snapshot', () => {
        const component = renderComponent(store);
        expect(component.container.firstChild).toMatchSnapshot();
    });
});
