/**
 *
 *
 * @export
 * @class TaTable
 */
export class TaTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TaTables = TaTable[];

export default TaTable;
