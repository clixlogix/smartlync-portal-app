/**
 *
 *
 * @export
 * @class TaAnalysisTable
 */
export class TaAnalysisTable {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TaAnalysisTables = TaAnalysisTable[];

export default TaAnalysisTable;
