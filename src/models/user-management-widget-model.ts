/**
 *
 *
 * @export
 * @class UserManagementWidget
 */
export class UserManagementWidget {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type UserManagementWidgets = UserManagementWidget[];

export default UserManagementWidget;
