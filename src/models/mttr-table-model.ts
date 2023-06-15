/**
 *
 *
 * @export
 * @class MttrTable
 */
export class MttrTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MttrTables = MttrTable[];

export default MttrTable;
