/**
 *
 *
 * @export
 * @class CarType
 */
export class CarType {
    id?: string | number;
    name?: string;
    description?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, name = '', description = '' } = o || ({} as any);

        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export type CarTypes = CarType[];

export default CarType;
