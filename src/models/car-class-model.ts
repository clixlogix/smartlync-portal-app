import CarLine from 'models/car-line-model';

/**
 *
 *
 * @export
 * @class CarClass
 */
export class CarClass {
    id?: string | number;
    name?: string;
    description?: string;
    lines?: CarLine[];

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, name = '', description = '', lines = [] } = o || ({} as any);

        this.id = id;
        this.name = name;
        this.lines = lines;
        this.description = description;
    }
}

export type CarClasses = CarClass[];

export default CarClass;
