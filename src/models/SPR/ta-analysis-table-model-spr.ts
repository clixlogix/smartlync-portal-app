/**
 *
 *
 * @export
 * @class TaAnalysisTableSpr
 */
export class TaAnalysisTableSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TaAnalysisTablesSpr = TaAnalysisTableSpr[];

export default TaAnalysisTableSpr;
