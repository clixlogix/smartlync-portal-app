/**
 *
 *
 * @export
 * @class TtrTable
 */
export class TtrTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TtrTables = TtrTable[];

export default TtrTable;
