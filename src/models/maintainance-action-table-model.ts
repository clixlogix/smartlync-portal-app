/**
 *
 *
 * @export
 * @class MaintainanceActionTable
 */
export class MaintainanceActionTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MaintainanceActionTables = MaintainanceActionTable[];

export default MaintainanceActionTable;
