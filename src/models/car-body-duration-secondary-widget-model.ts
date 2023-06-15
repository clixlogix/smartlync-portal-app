/**
 *
 *
 * @export
 * @class CarBodyDurationSecondaryWidget
 */
export class CarBodyDurationSecondaryWidget {
    protected id: string;
    public occurredOn?: string;
    public eventType?: string;
    public faultCode?: number;
    public description?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.occurredOn = o.occurredOn;
        this.eventType = o.eventType;
        this.faultCode = o.faultCode;
        this.description = o.description;
    }
}

export type CarBodyDurationSecondaryWidgets = CarBodyDurationSecondaryWidget[];

export default CarBodyDurationSecondaryWidget;
