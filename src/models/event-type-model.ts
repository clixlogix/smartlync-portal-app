/**
 *
 *
 * @export
 * @class EventType
 */
export class EventType {
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

export type EventTypes = EventType[];

export default EventType;
