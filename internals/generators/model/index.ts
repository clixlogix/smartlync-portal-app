/**
 * Page Generator
 */

import { Actions, PlopGeneratorConfig } from 'node-plop';
import path from 'path';
import { modelExists, camelCaseToDash } from '../utils';

export enum ModelProptNames {
    'ModelName' = 'ModelName',
    'wantTests' = 'wantTests',
}

const modelsPath = path.join(__dirname, '../../../src/models');

export const modelGenerator: PlopGeneratorConfig = {
    description: 'Add a Model',
    prompts: [
        {
            type: 'input',
            name: ModelProptNames.ModelName,
            message: 'What should the Model be called?',
            default: 'MyModel',
            validate: (value) => {
                const modelName = camelCaseToDash(value);

                if (/.+/.test(value)) {
                    return modelExists(modelName) ? `A model with this name (${value}) already exists ` : true;
                }

                return 'The unique name is required';
            },
        },
        {
            type: 'confirm',
            name: ModelProptNames.wantTests,
            default: false,
            message: 'Do you want to have tests?',
        },
    ],
    actions: (data: { [P in ModelProptNames]: any }) => {
        const prettyPaths: string[] = [];

        const actions: Actions = [];

        if (data.ModelName) {
            actions.push({
                type: 'add',
                path: `${modelsPath}/{{dashCase ModelName}}-model.ts`,
                templateFile: './model/model.ts.hbs',
                abortOnFail: false,
                data,
            });
            prettyPaths.push(`${modelsPath}/${camelCaseToDash(data.ModelName)}-model.ts`);

            actions.push({
                type: 'modify',
                path: `${modelsPath}/index.ts`,
                pattern: new RegExp(/.*\/\/.*\[IMPORT NEW MODELs ABOVE\].+\n/),
                templateFile: './model/appendModelIndex.hbs',
                abortOnFail: false,
                data,
            });
            prettyPaths.push(`${modelsPath}/index.ts`);

            if (data.wantTests) {
                actions.push({
                    type: 'add',
                    path: `${modelsPath}/__tests__/{{ dashCase ModelName }}-model.test.ts`,
                    templateFile: './model/index.test.tsx.hbs',
                    abortOnFail: true,
                });

                prettyPaths.push(`${modelsPath}/__tests__/${camelCaseToDash(data.ModelName)}-model.test.ts`);
            }

            actions.push({
                type: 'prettify',
                data: {
                    path: prettyPaths.join(' '),
                },
            });
        }
        return actions;
    },
};

export default modelGenerator;
