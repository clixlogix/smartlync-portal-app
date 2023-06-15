/**
 *
 *
 * @export
 * @class DailyFaultTrend
 */
export class DailyFaultTrend {
    protected id: string;
    public occurredOn?: string;
    public countDayPercent?: number;
    public countDay?: number;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.occurredOn = o.occurredOn;
        this.countDayPercent = o.countDayPercent;
        this.countDay = o.countDay;
    }
}

export type DailyFaultTrends = DailyFaultTrend[];

export default DailyFaultTrend;
