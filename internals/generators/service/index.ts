/**
 * Page Generator
 */

import { Actions, PlopGeneratorConfig } from 'node-plop';
import path from 'path';

import { serviceExists, camelCaseToDash } from '../utils';

export enum ServiceProptNames {
    'ServiceName' = 'ServiceName',
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

const modelsPath = path.join(__dirname, '../../../src/models');
const servicesPath = path.join(__dirname, '../../../src/services');
const pagesPath = path.join(__dirname, '../../../src/pages');
const rootStatePath = path.join(__dirname, '../../../src/types/RootState.ts');

export const serviceGenerator: PlopGeneratorConfig = {
    description: 'Add a Service',
    prompts: [
        {
            type: 'input',
            name: ServiceProptNames.ServiceName,
            message: 'What should the Service be called?',
            default: 'MyService',
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
            name: ServiceProptNames.wantModel,
            default: true,
            message: (data) => `Do you want a model for the service ${data.ServiceName} ?`,
        },
        {
            type: 'input',
            name: ServiceProptNames.ModelName,
            message: 'What should the Model be called?',
            default: (data) => data.ServiceName || 'MyModel',
            when: (data) => data.wantModel,
        },
        {
            type: 'confirm',
            name: ServiceProptNames.wantSlice,
            default: true,
            message: 'Do you want a redux slice(actions/selectors/reducer) for this service?',
        },
        {
            type: 'confirm',
            name: ServiceProptNames.wantSaga,
            default: true,
            message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
        },
        {
            type: 'checkbox',
            name: ServiceProptNames.sagas,
            choices: [
                {
                    name: ServiceProptNames.allCrudSaga,
                },
                {
                    name: ServiceProptNames.wantCreate,
                },
                {
                    name: ServiceProptNames.wantReadAll,
                    checked: true,
                },
                {
                    name: ServiceProptNames.wantReadByID,
                },
                {
                    name: ServiceProptNames.wantUpdate,
                },
                {
                    name: ServiceProptNames.wantDelete,
                },
            ],
            when: (data) => data[ServiceProptNames.wantSaga],
            default: [ServiceProptNames.wantReadAll],
            filter: (data = []) =>
                data.includes(ServiceProptNames.allCrudSaga)
                    ? [
                          ServiceProptNames.allCrudSaga,
                          ServiceProptNames.wantCreate,
                          ServiceProptNames.wantReadAll,
                          ServiceProptNames.wantReadByID,
                          ServiceProptNames.wantUpdate,
                          ServiceProptNames.wantDelete,
                      ]
                    : data,
            message: 'Select the sagas for asynchronous flows? ',
        },
        {
            type: 'confirm',
            name: ServiceProptNames.wantTests,
            default: false,
            message: 'Do you want to have tests?',
        },
    ],
    actions: (data: { [P in ServiceProptNames]: any }) => {
        const prettyPaths: string[] = [];
        const serviceName = camelCaseToDash(data.ServiceName);
        const svcPath = `${servicesPath}/${serviceName}`;
        const servicePath = `${svcPath}/${serviceName}`;
        const serviceSagaPath = `${svcPath}/sagas`;

        const actions: Actions = [];

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

        if (data.wantTests) {
            actions.push({
                type: 'add',
                path: `${servicesPath}/${serviceName}/__tests__/index.test.tsx`,
                templateFile: './service/index.test.tsx.hbs',
                abortOnFail: true,
            });
            actions.push({
                type: 'add',
                path: `${serviceSagaPath}/__tests__/index.test.tsx`,
                templateFile: './service/index.test.tsx.hbs',
                abortOnFail: true,
            });
        }

        actions.push({
            type: 'prettify',
            data: {
                path: `${svcPath}/** ${prettyPaths.join(' ')}`,
            },
        });

        return actions;
    },
};

export default serviceGenerator;
