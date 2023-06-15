import { ChartData } from 'models';

export const fillEmptyValues = (list: ChartData[], dates: string[]): ChartData[] => {
    return list.map(({ data, name }) => {
        const fullData = data.slice();

        dates.forEach((dateString, i) => {
            const currentItem = fullData[i];
            if (!currentItem || currentItem[0] !== dateString) {
                fullData.splice(i, 0, [dateString.toString(), 0]);
            }
        });
        return {
            name,
            data: fullData,
        };
    });
};

export const fillEmptyValuesObjects = (list: ChartData[], dates: any[]): ChartData[] => {
    let fullData: ChartData[] = [];
    list.forEach(({ data, name }) => {
        let newData: any = [...dates];
        data.forEach((element) => {
            const index = newData.findIndex((item) => {
                return element?.name === item?.name;
            });
            newData.splice(index, 1, { ...element });
        });

        fullData.push({ name, data: newData });
    });
    return fullData;
};
