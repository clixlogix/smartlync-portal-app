/**
 *
 *
 * @export
 * @class SelectAggregateColumn
 */
export class SelectAggregateColumn {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type SelectAggregateColumns = SelectAggregateColumn[];

export default SelectAggregateColumn;
