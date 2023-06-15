/**
 *
 *
 * @export
 * @class Event
 */
export class Event {
    protected id: string | number;
    name?: string;
    description?: string;

    constructor(o?: any) {
        const { id = '-1', name = '', description = '' } = o || ({} as any);

        this.id = id;
        this.name = name;
        this.description = description;
    }
}

export type Events = Event[];

export default Event;
