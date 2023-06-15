/**
 *
 *
 * @export
 * @class TaTableSpr
 */
export class TaTableSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TaTableSprs = TaTableSpr[];

export default TaTableSpr;
