/**
 * Page Generator
 */

import { Actions, PlopGeneratorConfig } from 'node-plop';
import path from 'path';

import { camelCaseToDash, widgetExists, serviceExists } from '../utils';

export enum PageProptNames {
    'ComponentName' = 'ComponentName',
    'ServiceName' = 'ServiceName',
    'wantMemo' = 'wantMemo',
    'wantFilters' = 'wantFilters',
    'wantStyledComponents' = 'wantStyledComponents',
    'wantTranslations' = 'wantTranslations',
    'wantLoadable' = 'wantLoadable',
    'wantModel' = 'wantModel',
    'ModelName' = 'ModelName',
    'wantSlice' = 'wantSlice',
    'wantSaga' = 'wantSaga',
    'allCrudSaga' = 'allCrudSaga',
    'wantCrud' = 'wantCrud',
    'wantCreate' = 'wantCreate',
    'wantReadAll' = 'wantReadAll',
    'wantReadByID' = 'wantReadByID',
    'wantUpdate' = 'wantUpdate',
    'wantDelete' = 'wantDelete',
    'wantTests' = 'wantTests',
    'sagas' = 'sagas',
}

const servicesPath = path.join(__dirname, '../../../src/services');
const widgetsPath = path.join(__dirname, '../../../src/widgets');
const rootStatePath = path.join(__dirname, '../../../src/types/RootState.ts');
const enLocalePath = path.join(__dirname, '../../../src/locales/en/translation.ts');

const modelsPath = path.join(__dirname, '../../../src/models');

export const widgetGenerator: PlopGeneratorConfig = {
    description: 'Add a widget component',
    prompts: [
        {
            type: 'input',
            name: PageProptNames.ComponentName,
            message: 'What should the widget be called?',
            default: 'MyWidget',
            validate: (value) => {
                if (/.+/.test(value)) {
                    return widgetExists(value) ? `A widget with this name (${value}) already exists ` : true;
                }

                return 'The name is required';
            },
        },
        {
            type: 'confirm',
            name: PageProptNames.wantMemo,
            default: true,
            message: 'Do you want to wrap your widget in React.memo?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantFilters,
            default: true,
            message: 'Do you want filters?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantSlice,
            default: true,
            message: 'Do you want a redux service for this widget?',
        },
        /* ** *** */

        {
            type: 'input',
            name: PageProptNames.ServiceName,
            message: 'What should the Service be called?',
            default: (data) => data.ComponentName || 'MyService',
            when: (data) => data.wantSlice,
            validate: (value) => {
                const serviceName = camelCaseToDash(value);

                if (/.+/.test(value)) {
                    return serviceExists(serviceName) ? `A service with this name (${value}) already exists ` : true;
                }

                return 'A unique service name is required';
            },
        },
        {
            type: 'confirm',
            name: PageProptNames.wantModel,
            default: true,
            message: (data) => `Do you want a model for the service ${data.ServiceName} ?`,
        },
        {
            type: 'input',
            name: PageProptNames.ModelName,
            message: 'What should the Model be called?',
            default: (data) => data.ServiceName || 'MyModel',
            when: (data) => data.wantModel,
        },
        {
            type: 'confirm',
            name: PageProptNames.wantSlice,
            default: true,
            when: (data) => data.wantSlice,
            message: 'Do you want a redux slice(actions/selectors/reducer) for this service?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantSaga,
            default: true,
            when: (data) => data.wantSlice,
            message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
        },
        {
            type: 'checkbox',
            name: PageProptNames.sagas,
            choices: [
                {
                    name: PageProptNames.allCrudSaga,
                },
                {
                    name: PageProptNames.wantCreate,
                },
                {
                    name: PageProptNames.wantReadAll,
                    checked: true,
                },
                {
                    name: PageProptNames.wantReadByID,
                },
                {
                    name: PageProptNames.wantUpdate,
                },
                {
                    name: PageProptNames.wantDelete,
                },
            ],
            when: (data) => data[PageProptNames.wantSaga],
            default: [PageProptNames.wantReadAll],
            filter: (data = []) =>
                data.includes(PageProptNames.allCrudSaga)
                    ? [
                          PageProptNames.allCrudSaga,
                          PageProptNames.wantCreate,
                          PageProptNames.wantReadAll,
                          PageProptNames.wantReadByID,
                          PageProptNames.wantUpdate,
                          PageProptNames.wantDelete,
                      ]
                    : data,
            message: 'Select the sagas for asynchronous flows? ',
        },

        /* ** *** */
        {
            type: 'confirm',
            name: PageProptNames.wantSaga,
            default: true,
            message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantStyledComponents,
            default: true,
            message: 'Do you want to use styled-components?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantTranslations,
            default: true,
            message: 'Do you want i18n translations (i.e. will this widget use text)?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantLoadable,
            default: true,
            message: (data) => `Do you want to load the widget ${data.ComponentName} asynchronously ?`,
        },
        {
            type: 'confirm',
            name: PageProptNames.wantTests,
            default: true,
            message: 'Do you want to have tests?',
        },
    ],
    // @ts-ignore
    actions: (data: { [P in PageProptNames]: string }) => {
        const prettyPaths: string[] = [];
        const serviceName = camelCaseToDash(data.ServiceName);
        const svcPath = `${servicesPath}/${serviceName}`;
        const servicePath = `${svcPath}/${serviceName}`;
        const serviceSagaPath = `${svcPath}/sagas`;
        const widgetName = `{{properCase ${PageProptNames.ComponentName}}}`;
        const widgetPath = `${widgetsPath}/${data[PageProptNames.ComponentName]}`;

        /* ** *** */

        const actions: Actions = [
            {
                type: 'add',
                path: `${widgetPath}/index.ts`,
                templateFile: './widget/index.tsx.hbs',
                abortOnFail: true,
            },
            {
                type: 'add',
                path: `${widgetPath}/${widgetName}.tsx`,
                templateFile: './widget/widget-index.tsx.hbs',
                abortOnFail: true,
            },
            {
                type: 'add',
                path: `${widgetPath}/${widgetName}.scss`,
                templateFile: './widget/index.scss.hbs',
                abortOnFail: true,
            },
            {
                type: 'modify',
                path: `${widgetsPath}/widgets.ts`,
                pattern: new RegExp(/.*\/\/.*\[INSERT NEW WIDGET KEY ABOVE\].+\n/),
                templateFile: './widget/appendWidgetList.hbs',
                abortOnFail: true,
                data,
            },
            {
                type: 'modify',
                path: `${widgetsPath}/index.ts`,
                pattern: new RegExp(/.*\/\/.*\[INSERT NEW WIDGET IMPORT KEY ABOVE\].+\n/),
                templateFile: './widget/appendWidgetIndex.hbs',
                abortOnFail: true,
                data,
            },
        ];

        // @ts-ignore
        const sagas: string[] = data.sagas || [];
        [...sagas].forEach((saga: string) => {
            data[saga] = true;
        });

        if (data.wantSlice) {
            actions.push({
                type: 'add',
                path: `${servicePath}-reducer.ts`,
                templateFile: './service/slice.ts.hbs',
                abortOnFail: true,
                data,
            });
            actions.push({
                type: 'add',
                path: `${servicePath}-selectors.ts`,
                templateFile: './service/selectors.ts.hbs',
                abortOnFail: true,
                data,
            });
            actions.push({
                type: 'add',
                path: `${servicesPath}/${serviceName}/index.ts`,
                templateFile: './service/types.ts.hbs',
                abortOnFail: true,
                data,
            });
            actions.push({
                type: 'modify',
                path: `${rootStatePath}`,
                pattern: new RegExp(/.*\/\/.*\[IMPORT NEW CONTAINERSTATE ABOVE\].+\n/),
                templateFile: './service/importContainerState.hbs',
                abortOnFail: true,
                data,
            });
            actions.push({
                type: 'modify',
                path: `${rootStatePath}`,
                pattern: new RegExp(/.*\/\/.*\[INSERT NEW REDUCER KEY ABOVE\].+\n/),
                templateFile: './service/appendRootState.hbs',
                abortOnFail: true,
                data,
            });
            actions.push({
                type: 'add',
                path: `${servicesPath}/${serviceName}/sagas/data.ts`,
                templateFile: './service/sagas/data.ts.hbs',
                abortOnFail: false,
                data,
            });

            prettyPaths.push(svcPath);
            prettyPaths.push(rootStatePath);
        }

        if (data.wantModel) {
            actions.push({
                type: 'add',
                path: `${servicesPath}/../models/{{dashCase ModelName}}-model.ts`,
                templateFile: './service/model.ts.hbs',
                abortOnFail: false,
                data,
            });

            actions.push({
                type: 'modify',
                path: `${modelsPath}/index.ts`,
                pattern: new RegExp(/.*\/\/.*\[IMPORT NEW MODELs ABOVE\].+\n/),
                templateFile: './service/appendModelIndex.hbs',
                abortOnFail: false,
                data,
            });

            if (data.wantTests) {
                actions.push({
                    type: 'add',
                    path: `${servicesPath}/../models/__tests__/{{dashCase ModelName}}-model.test.tsx`,
                    templateFile: './service/index.test.tsx.hbs',
                    abortOnFail: true,
                });
                prettyPaths.push(
                    `${servicesPath}/../models/__tests__/${camelCaseToDash(data.ModelName)}-model.test.tsx`,
                );
            }

            prettyPaths.push(`${servicesPath}/../models/${camelCaseToDash(data.ModelName)}-model.ts`);
            prettyPaths.push(`${modelsPath}/index.ts`);
        }

        if (data.wantSaga) {
            actions.push({
                type: 'add',
                path: `${serviceSagaPath}/index.ts`,
                templateFile: './service/sagas/index-saga.ts.hbs',
                abortOnFail: false,
                data,
            });

            if (data.wantModel) {
                actions.push({
                    type: 'modify',
                    path: `${servicesPath}/../constants/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW MODELAPIURLs ABOVE\].+\n/),
                    templateFile: './service/appendApiUrl.hbs',
                    abortOnFail: false,
                    data,
                });
            }

            if (data.wantCreate || data.allCrudSaga) {
                actions.push({
                    type: 'add',
                    path: `${serviceSagaPath}/${serviceName}-saga-create.ts`,
                    templateFile: './service/sagas/saga-create.ts.hbs',
                    abortOnFail: false,
                    data,
                });

                actions.push({
                    type: 'modify',
                    path: `${serviceSagaPath}/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SAGAS ABOVE\].+\n/),
                    templateFile: './service/sagas/importServiceSagas-create.hbs',
                    abortOnFail: false,
                    data,
                });

                if (data.wantTests) {
                    actions.push({
                        type: 'add',
                        path: `${serviceSagaPath}/__tests__/{{dashCase ServiceName}}-saga-create.test.tsx`,
                        templateFile: './service/index.test.tsx.hbs',
                        abortOnFail: true,
                    });
                    prettyPaths.push(
                        `${serviceSagaPath}/__tests__/${camelCaseToDash(data.ServiceName)}-saga-create.test.tsx`,
                    );
                }
            }

            if (data.wantReadAll || data.allCrudSaga) {
                actions.push({
                    type: 'add',
                    path: `${serviceSagaPath}/${serviceName}-saga-get-all.ts`,
                    templateFile: './service/sagas/saga-get-all.ts.hbs',
                    abortOnFail: false,
                    data,
                });

                actions.push({
                    type: 'modify',
                    path: `${serviceSagaPath}/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SAGAS ABOVE\].+\n/),
                    templateFile: './service/sagas/importServiceSagas-get-all.hbs',
                    abortOnFail: false,
                    data,
                });

                if (data.wantTests) {
                    actions.push({
                        type: 'add',
                        path: `${serviceSagaPath}/__tests__/{{dashCase ServiceName}}-saga-get-all.test.tsx`,
                        templateFile: './service/index.test.tsx.hbs',
                        abortOnFail: true,
                    });
                    prettyPaths.push(
                        `${serviceSagaPath}/__tests__/${camelCaseToDash(data.ServiceName)}-saga-get-all.test.tsx`,
                    );
                }
            }

            if (data.wantReadByID || data.allCrudSaga) {
                actions.push({
                    type: 'add',
                    path: `${serviceSagaPath}/${serviceName}-saga-get-by-id.ts`,
                    templateFile: './service/sagas/saga-get-by-id.ts.hbs',
                    abortOnFail: false,
                    data,
                });

                actions.push({
                    type: 'modify',
                    path: `${serviceSagaPath}/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SAGAS ABOVE\].+\n/),
                    templateFile: './service/sagas/importServiceSagas-get-by-id.hbs',
                    abortOnFail: false,
                    data,
                });

                if (data.wantTests) {
                    actions.push({
                        type: 'add',
                        path: `${serviceSagaPath}/__tests__/{{dashCase ServiceName}}-saga-get-by-id.test.tsx`,
                        templateFile: './service/index.test.tsx.hbs',
                        abortOnFail: true,
                    });
                    prettyPaths.push(
                        `${serviceSagaPath}/__tests__/${camelCaseToDash(data.ServiceName)}-saga-get-by-id.test.tsx`,
                    );
                }
            }

            if (data.wantUpdate || data.allCrudSaga) {
                actions.push({
                    type: 'add',
                    path: `${serviceSagaPath}/${serviceName}-saga-update.ts`,
                    templateFile: './service/sagas/saga-update.ts.hbs',
                    abortOnFail: false,
                });

                actions.push({
                    type: 'modify',
                    path: `${serviceSagaPath}/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SAGAS ABOVE\].+\n/),
                    templateFile: './service/sagas/importServiceSagas-update.hbs',
                    abortOnFail: false,
                    data,
                });

                if (data.wantTests) {
                    actions.push({
                        type: 'add',
                        path: `${serviceSagaPath}/__tests__/{{dashCase ServiceName}}-saga-update.test.tsx`,
                        templateFile: './service/index.test.tsx.hbs',
                        abortOnFail: true,
                    });
                    prettyPaths.push(
                        `${serviceSagaPath}/__tests__/${camelCaseToDash(data.ServiceName)}-saga-update.test.tsx`,
                    );
                }
            }

            if (data.wantDelete || data.allCrudSaga) {
                actions.push({
                    type: 'add',
                    path: `${serviceSagaPath}/${serviceName}-saga-delete.ts`,
                    templateFile: './service/sagas/saga-delete.ts.hbs',
                    abortOnFail: false,
                    data,
                });

                actions.push({
                    type: 'modify',
                    path: `${serviceSagaPath}/index.ts`,
                    pattern: new RegExp(/.*\/\/.*\[IMPORT NEW SAGAS ABOVE\].+\n/),
                    templateFile: './service/sagas/importServiceSagas-delete.hbs',
                    abortOnFail: false,
                    data,
                });

                if (data.wantTests) {
                    actions.push({
                        type: 'add',
                        path: `${serviceSagaPath}/__tests__/{{dashCase ServiceName}}-saga-delete.test.tsx`,
                        templateFile: './service/index.test.tsx.hbs',
                        abortOnFail: true,
                    });
                    prettyPaths.push(
                        `${serviceSagaPath}/__tests__/${camelCaseToDash(data.ServiceName)}-saga-delete.test.tsx`,
                    );
                }
            }

            prettyPaths.push(`${servicesPath}/../constants/index.ts`);
        }

        /* ** *** */

        if (data.wantLoadable) {
            actions.push({
                type: 'add',
                path: `${widgetPath}/Loadable.ts`,
                templateFile: './component/loadable.ts.hbs',
                abortOnFail: true,
            });
            prettyPaths.push(`${widgetPath}/Loadable.ts`);
        }

        if (data.wantTests) {
            actions.push({
                type: 'add',
                path: `${widgetPath}/__tests__/index.test.tsx`,
                templateFile: './widget/index.test.tsx.hbs',
                abortOnFail: true,
            });
        }

        if (data.wantTranslations) {
            actions.push({
                type: 'add',
                path: `${widgetPath}/messages.ts`,
                templateFile: './widget/messages.ts.hbs',
                abortOnFail: true,
            });
            actions.push({
                type: 'modify',
                path: `${enLocalePath}`,
                pattern: new RegExp(/.*\/\/.*\[INSERT NEW WIDGET EN TITLE KEY ABOVE\].+\n/),
                templateFile: './widget/appendEnLocale.hbs',
                abortOnFail: true,
            });

            prettyPaths.push(`${widgetPath}/messages.ts`);
            // prettyPaths.push(`${enLocalePath}`);
        }

        actions.push({
            type: 'prettify',
            data: {
                path: `${svcPath}/** ${prettyPaths.join(' ')}`,
            },
        });

        actions.push({
            type: 'prettify',
            data: { path: `${widgetsPath}/${data.ComponentName}/** ; ${servicesPath}/${serviceName}/**` },
        });

        return actions;
    },
};

export default widgetGenerator;
