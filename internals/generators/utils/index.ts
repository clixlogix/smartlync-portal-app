/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */
import fs from 'fs';
import path from 'path';

const componentDirs = [
    'src/components',
    'src/components/cards',
    'src/components/filters',
    'src/components/formFields',
    'src/components/panels',
    'src/components/widgets',
    'src/widgets',
];
const pageDirs = ['src/pages', 'src/containers'];
const widgetDirs = ['src/widgets', 'src/pages', 'src/components/widgets'];
const serviceDirs = ['src/services'];
const modelDirs = ['src/models'];

/**
 *
 *
 * @export
 * @param {string} name
 * @param {string[]} list
 * @returns {boolean}
 */
export function pathExists(name: string, list: string[]): boolean {
    let foundIt = false;

    try {
        foundIt = list.some((dir) => {
            console.log(`\nChecking if ${name} exists in  ${dir} `);
            const dirs = fs.readdirSync(path.join(__dirname, `../../../${dir}`));
            return dirs.indexOf(name) >= 0;
        });
    } catch (e) {
        // console.log(`Error finding ${component} in dirs `, componentDirs, e);
    }

    return foundIt;
}

/**
 *
 *
 * @export
 * @param {string} name
 * @returns {boolean}
 */
export function modelExists(model: string): boolean {
    return pathExists(model, modelDirs);
}

/**
 *
 *
 * @export
 * @param {string} component
 * @returns {boolean}
 */
export function componentExists(component: string): boolean {
    return pathExists(component, componentDirs);
}

/**
 *
 *
 * @export
 * @param {any} myStr
 * @returns {string}
 */
export function camelCaseToDash(myStr): string {
    return !myStr ? '' : myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 *
 *
 * @export
 * @param {string} service
 * @returns {boolean}
 */
export function serviceExists(service: string): boolean {
    return pathExists(service, serviceDirs);
}

/**
 *
 *
 * @export
 * @param {string} container
 * @returns {boolean}
 */
export function containerExists(container: string): boolean {
    return pathExists(container, pageDirs);
}

/**
 *
 *
 * @export
 * @param {string} container
 * @returns {boolean}
 */
export function widgetExists(container: string): boolean {
    return pathExists(container, widgetDirs);
}

/**
 *
 *
 * @export
 * @param {string} directory
 * @returns {string[]}
 */
export function walkDir(directory: string): string[] {
    let dirList: string[] = [];

    const files = fs.readdirSync(directory);
    for (const file of files) {
        const p = path.join(directory, file);
        if (fs.statSync(p).isDirectory()) {
            dirList.push(p);
            dirList = [...dirList, ...walkDir(p)];
        }
    }
    return dirList;
}

/**
 *
 *
 * @export
 * @returns
 */
export function listComponentsDirectories() {
    return componentDirs;
}
