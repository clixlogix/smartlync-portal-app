/**
 *
 *
 * @export
 * @class HistoricalDiagnosticGraph
 */
export class HistoricalDiagnosticGraph {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type HistoricalDiagnosticGraphs = HistoricalDiagnosticGraph[];

export default HistoricalDiagnosticGraph;
