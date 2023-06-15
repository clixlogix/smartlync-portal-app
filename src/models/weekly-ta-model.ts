/**
 *
 *
 * @export
 * @class WeeklyTa
 */
export class WeeklyTa {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type WeeklyTas = WeeklyTa[];

export default WeeklyTa;
