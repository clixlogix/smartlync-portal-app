/**
 *
 *
 * @export
 * @class TtrTableSpr
 */
export class TtrTableSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TtrTableSprs = TtrTableSpr[];

export default TtrTableSpr;
