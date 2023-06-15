/**
 *
 *
 * @export
 * @class MttrTableSpr
 */
export class MttrTableSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MttrTableSprs = MttrTableSpr[];

export default MttrTableSpr;
