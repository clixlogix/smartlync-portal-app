/**
 *
 *
 * @export
 * @class CarBodyDurationWidget
 */
export class CarBodyDurationWidget {
    protected id: string;
    public carBodyID?: string;
    public timeIn?: string;
    public timeOut?: string;
    public value?: number;
    public durations?: [];
    public events?: [];

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.carBodyID = o?.carBodyID;
        this.timeIn = o?.timeIn;
        this.timeOut = o?.timeOut;
        this.value = o?.value;
        this.durations = o?.durations;
        this.events = o?.events;
    }
}

export type CarBodyDurationWidgets = CarBodyDurationWidget[];

export default CarBodyDurationWidget;
