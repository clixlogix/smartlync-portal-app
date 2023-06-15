/**
 *
 *
 * @export
 * @class CarBodyGraph
 */
export class CarBodyGraph {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CarBodyGraphs = CarBodyGraph[];

export default CarBodyGraph;
