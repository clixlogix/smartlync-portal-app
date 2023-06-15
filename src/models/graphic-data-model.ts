/**
 *
 *
 * @export
 * @class GraphicData
 */

export type Values = {
    sample_time: number;
    scale_info: number;
    GraphicData: number[];
};

export type GraphData = {
    Lift_Position: Values;
    Voltage: Values;
    Current: Values;
};
export class GraphicData {
    protected id: string;
    station: string;
    dateTime: string;
    deviceName: string;
    weldType: string;
    carbodyId: number;
    date: string;
    studId: number;
    variance1: string;
    variance2: string;
    graphData: GraphData;

    constructor(o?: any) {
        const {
            id = `1-${Math.random()}`,
            station,
            dateTime,
            deviceName,
            weldType,
            carbodyId,
            date,
            studId,
            variance1,
            variance2,
            graphData,
        } = o || ({} as GraphicData);

        this.id = id;
        this.station = station;
        this.dateTime = dateTime;
        this.deviceName = deviceName;
        this.weldType = weldType;
        this.carbodyId = carbodyId;
        this.date = date;
        this.studId = studId;
        this.variance1 = variance1;
        this.variance2 = variance2;
        this.graphData = graphData;
    }
}

export type GraphicDatas = GraphicData[];

export default GraphicData;
