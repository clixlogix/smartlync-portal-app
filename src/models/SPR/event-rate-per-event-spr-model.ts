/**
 *
 *
 * @export
 * @class EventRatePerEventSpr
 */
export class EventRatePerEventSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type EventRatePerEventSprs = EventRatePerEventSpr[];

export default EventRatePerEventSpr;
