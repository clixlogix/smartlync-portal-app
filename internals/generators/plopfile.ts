import { NodePlopAPI } from 'node-plop';
import { componentGenerator } from './component';
import { containerGenerator } from './container';
import { modelGenerator } from './model';
import { pageGenerator } from './page';
import { widgetGenerator } from './widget';
import { serviceGenerator } from './service';
import shell from 'shelljs';

interface CustomActionData {
    path: string;
    file?: string;
}

/**
 * Every generated backup file gets this extension
 */
export const BACKUPFILE_EXTENSION = 'rbgen';

/**
 *
 *
 * @export
 * @param {NodePlopAPI} plop
 */
export default function plop(plop: NodePlopAPI) {
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('container', containerGenerator);
    plop.setGenerator('model', modelGenerator);
    plop.setGenerator('page', pageGenerator);
    plop.setGenerator('widget', widgetGenerator);
    plop.setGenerator('service', serviceGenerator);
    plop.setPartial('AnyModel', '{{#if wantModel}}{{ properCase ModelName }}{{else}}any{{/if}}');
    plop.setPartial('AnyModels', '{{#if wantModel}}{{ properCase ModelName }}s{{else}}any[]{{/if}}');
    plop.setPartial(
        'ServiceModel',
        '{{#if wantModel}}{{ properCase ModelName }}{{else}}{{ properCase ServiceName }}{{/if}}',
    );
    plop.setPartial(
        'serviceModel',
        '{{#if wantModel}}{{ camelCase ModelName }}{{else}}{{ camelCase ServiceName }}{{/if}}',
    );
    plop.setHelper('getWidgetPath', (widget, a) => {
        return a[widget].path;
    });
    plop.setHelper('iff', (a, operator, b, opts) => {
        let bool: boolean = false;

        switch (operator) {
            case '&&':
                bool = a && b;
                break;
            case '||':
                bool = a || b;
                break;
            case '==':
                bool = a === b;
                break;
            case '>':
                bool = a > b;
                break;
            case '<':
                bool = a < b;
                break;
            default:
                throw new Error(`Unknown operator ${operator}`);
        }

        return bool ? opts.fn(this) : opts.inverse(this);
    });

    plop.setActionType('prettify', (answers, config) => {
        const data = config.data as CustomActionData;
        shell.exec(`echo yarn run prettify -- "${data.path}"`, { silent: false });
        shell.exec(`yarn run prettify -- ${data.path} `, { silent: true });
        return '';
    });
}
