/**
 *
 *
 * @export
 * @class TopFaultCountSpr
 */
export class TopFaultCountSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TopFaultCountSprs = TopFaultCountSpr[];

export default TopFaultCountSpr;
