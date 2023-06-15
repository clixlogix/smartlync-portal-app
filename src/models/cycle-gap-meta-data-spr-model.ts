/**
 *
 *
 * @export
 * @class CycleGapMetaDataSpr
 */
export class CycleGapMetaDataSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CycleGapMetaDataSprs = CycleGapMetaDataSpr[];

export default CycleGapMetaDataSpr;
