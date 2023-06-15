import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';
import logger from 'redux-logger';

export function configureAppStore() {
    const reduxSagaMonitorOptions = {};
    const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
    const { run: runSaga } = sagaMiddleware;
    // add redux state logger for development environment
    const applyLogger = process.env.NODE_ENV === 'development' ? [logger] : [];
    // Create the store with saga middleware
    const middlewares = [sagaMiddleware, ...applyLogger];

    const enhancers = [
        createInjectorsEnhancer({
            createReducer,
            runSaga,
        }),
    ];

    const store = configureStore({
        reducer: createReducer(),
        middleware: [
            ...getDefaultMiddleware({
                serializableCheck: false,
            }),
            ...middlewares,
        ],
        devTools:
            /* istanbul ignore next line */
            process.env.NODE_ENV !== 'production' || process.env.PUBLIC_URL.length > 0,
        enhancers,
    });

    return store;
}
