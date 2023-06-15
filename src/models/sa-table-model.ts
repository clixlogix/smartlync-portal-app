/**
 *
 *
 * @export
 * @class SaTable
 */
export class SaTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type SaTables = SaTable[];

export default SaTable;
