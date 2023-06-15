/**
 *
 *
 * @export
 * @class MtbfAnalysisTable
 */
export class MtbfAnalysisTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MtbfAnalysisTables = MtbfAnalysisTable[];

export default MtbfAnalysisTable;
