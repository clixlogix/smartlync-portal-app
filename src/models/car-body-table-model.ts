/**
 *
 *
 * @export
 * @class CarBodyTable
 */
export class CarBodyTable {
    protected id: string;
    studID?: number;
    carBody?: number;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.studID = o.studID;
        this.carBody = o.carBody;
    }
}

export type CarBodyTables = CarBodyTable[];

export default CarBodyTable;
