/**
 * Page Generator
 */

import { Actions, PlopGeneratorConfig } from 'node-plop';
import path from 'path';

import { camelCaseToDash, containerExists, serviceExists } from '../utils';
import widgets from '../../../src/widgets/widgets';

export enum PageProptNames {
    'ComponentName' = 'ComponentName',
    'ServiceName' = 'ServiceName',
    'wantMemo' = 'wantMemo',
    'wantHeaders' = 'wantHeaders',
    'wantFilters' = 'wantFilters',
    'wantDashboard' = 'wantDashboard',
    'wantStyledComponents' = 'wantStyledComponents',
    'wantTranslations' = 'wantTranslations',
    'wantLoadable' = 'wantLoadable',
    'wantModel' = 'wantModel',
    'ModelName' = 'ModelName',
    'wantService' = 'wantService',
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
    'wantAllWidgets' = 'wantAllWidgets',
    'wantFullscreen' = 'wantFullscreen',
    'widgets' = 'widgets',
    'widgetProps' = 'widgetProps',
    'wantLayout' = 'wantLayout',
    'wantRules' = 'wantRules',
}

const servicesPath = path.join(__dirname, '../../../src/services');
const pagesPath = path.join(__dirname, '../../../src/pages');
const rootStatePath = path.join(__dirname, '../../../src/types/RootState.ts');
const appsComponentPath = path.join(__dirname, '../../../src/app/App.tsx');
const enLocalePath = path.join(__dirname, '../../../src/locales/en/translation.ts');
const modelsPath = path.join(__dirname, '../../../src/models');
const appsRoutePath = path.join(__dirname, '../../../src/services/dashboard/routes.tsx');

export const pageGenerator: PlopGeneratorConfig = {
    description: 'Add a page component to Application',
    prompts: [
        {
            type: 'input',
            name: PageProptNames.ComponentName,
            message: 'What should the page be called ?',
            default: 'MyPage',
            validate: (value) => {
                if (/.+/.test(value)) {
                    return containerExists(value) ? `A page with this name (${value}) already exists ` : true;
                }

                return 'The name is required';
            },
        },
        {
            type: 'confirm',
            name: PageProptNames.wantMemo,
            default: true,
            message: 'Do you want to wrap your page in React.memo ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantLayout,
            default: true,
            message: 'Do you want responsive grid layout for your page ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantHeaders,
            default: true,
            message: 'Do you want headers?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantFilters,
            default: true,
            message: 'Do you want filters via filter panel ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantRules,
            default: true,
            message: 'Do you want filters via rules panel ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantDashboard,
            default: true,
            message: (data) => `Do you want to convert PAGE ${data.ComponentName} to a DASHBOARD format ?`,
        },
        {
            type: 'checkbox',
            name: PageProptNames.widgets,
            choices: Object.keys(widgets)
                .reduce(
                    (acc, name: string) => {
                        const w: any = { name };
                        acc.push(w);
                        return acc;
                    },
                    [{ name: PageProptNames.wantAllWidgets }],
                )
                .sort(),
            when: (data) => data[PageProptNames.wantDashboard],
            default: [PageProptNames.wantAllWidgets],
            filter: (data = []) => (data.includes(PageProptNames.wantAllWidgets) ? Object.keys(widgets) : data),
            message: 'Select the widgets to add ? ',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantFullscreen,
            when: (data) => data[PageProptNames.widgets].length === 1,
            default: true,
            message: 'You selected One(1) widget. \nDo you want widget to take up all available space ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantService,
            default: false,
            message: 'Do you want a redux service for this page ?',
        },
        /* ** *** */

        {
            type: 'input',
            name: PageProptNames.ServiceName,
            message: 'What should the Service be called?',
            default: 'MyService',
            when: (data) => data[PageProptNames.wantService],
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
            default: false,
            message: (data) => `Do you want a model for the service ${data.ServiceName} ?`,
        },
        {
            type: 'input',
            name: PageProptNames.ModelName,
            message: 'What should the Model be called ?',
            default: (data) => data.ServiceName || 'MyModel',
            when: (data) => data.wantModel,
        },
        {
            type: 'confirm',
            name: PageProptNames.wantSlice,
            default: true,
            when: (data) => data[PageProptNames.wantService],
            message: 'Do you want a redux slice(actions/selectors/reducer) for this service ?',
        },
        {
            type: 'confirm',
            name: PageProptNames.wantSaga,
            default: true,
            when: (data) => data[PageProptNames.wantService],
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
            when: (data) => data[PageProptNames.wantSaga] && data[PageProptNames.wantService],
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
            message: 'Select the sagas for asynchronous flows ? ',
        },

        /* ** *** */
        // {
        //     type: 'confirm',
        //     name: PageProptNames.wantSaga,
        //     default: true,
        //     message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
        // },

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
            message: 'Do you want to load the page asynchronously?',
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
        const pageName = `{{properCase ${PageProptNames.ComponentName}}}`;
        const pagePath = `${pagesPath}/${pageName}`;

        /* ** *** */

        const actions: Actions = [
            {
                type: 'add',
                path: `${pagePath}/index.ts`,
                templateFile: './component/index.tsx.hbs',
                abortOnFail: true,
            },
            {
                type: 'add',
                path: `${pagePath}/${pageName}.tsx`,
                templateFile: './page/page-index.tsx.hbs',
                abortOnFail: true,
            },
            {
                type: 'add',
                path: `${pagePath}/${pageName}.scss`,
                templateFile: './page/index.scss.hbs',
                abortOnFail: true,
            },
            {
                type: 'modify',
                path: `${appsComponentPath}`,
                pattern: new RegExp(/.* \[INSERT NEW PAGE IMPORT ABOVE\].+\n/),
                templateFile: './page/appendPageImport.hbs',
                abortOnFail: true,
            },
            {
                type: 'modify',
                path: `${appsComponentPath}`,
                pattern: new RegExp(/.* \[INSERT NEW PAGE ROUTE ABOVE\].+\n/),
                templateFile: './page/appendPageRoute.hbs',
                abortOnFail: true,
            },
            {
                type: 'modify',
                path: `${appsRoutePath}`,
                pattern: new RegExp(/.* \[INSERT NEW PAGE ROUTE ABOVE\].+\n/),
                templateFile: './page/appendDashboardRoute.hbs',
                abortOnFail: true,
            },
        ];

        // add widget properties to data
        // @ts-ignore
        data.widgetProps = widgets;

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
                path: `${pagePath}/Loadable.ts`,
                templateFile: './component/loadable.ts.hbs',
                abortOnFail: true,
            });
        }

        if (data.wantTests) {
            actions.push({
                type: 'add',
                path: `${pagePath}/__tests__/index.test.tsx`,
                templateFile: './page/index.test.tsx.hbs',
                abortOnFail: true,
            });
        }

        if (data.wantTranslations) {
            actions.push({
                type: 'add',
                path: `${pagePath}/messages.ts`,
                templateFile: './page/messages.ts.hbs',
                abortOnFail: true,
            });
            actions.push({
                type: 'modify',
                path: `${enLocalePath}`,
                pattern: new RegExp(/.*\/\/.*\[INSERT NEW PAGE EN TITLE KEY ABOVE\].+\n/),
                templateFile: './page/appendEnLocale.hbs',
                abortOnFail: true,
            });
        }

        actions.push({
            type: 'prettify',
            data: {
                path: `${svcPath}/** ${prettyPaths.join(' ')}`,
            },
        });

        actions.push({
            type: 'prettify',
            data: { path: `${pagesPath}/${data.ComponentName}/** ; ${servicesPath}/${serviceName}/**` },
        });

        return actions;
    },
};

export default pageGenerator;
