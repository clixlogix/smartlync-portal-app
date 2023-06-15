/**
 *
 *
 * @export
 * @class MtbfAnalysisTableSpr
 */
export class MtbfAnalysisTableSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MtbfAnalysisTableSprs = MtbfAnalysisTableSpr[];

export default MtbfAnalysisTableSpr;
