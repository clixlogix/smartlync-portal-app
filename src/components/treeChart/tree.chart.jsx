import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsTreeChart from 'highcharts/modules/treemap';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import './tree.styles.scss';

const generateRandomColor = () => {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`;
};

const getHashOfString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // tslint:disable-next-line: no-bitwise
        hash = str.charCodeAt(i) * 10 * i + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
};

const normalizeHash = (hash, min, max) => {
    return Math.floor((hash % (max - min)) + min);
};

const generateHSL = (name, saturationRange, lightnessRange) => {
    const hash = getHashOfString(name);
    const h = normalizeHash(hash, 0, 360);
    const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
    const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
    return [h, s, l];
};

const HSLtoString = (hsl) => {
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

const generateColorHsl = (id, saturationRange, lightnessRange) => {
    return HSLtoString(generateHSL(id, saturationRange, lightnessRange));
};

HighchartsTreeChart(Highcharts);
HighchartsHeatmap(Highcharts);

const createOptions = (chartData, height, fields) => ({
    chart: {
        height: height,
        padding: '0px',
        spacing: 0,
    },
    series: [
        {
            type: 'treemap',
            allowDrillToNode: true,
            animation: true,
            dataLabels: {
                enabled: true,
            },
            levelIsConstant: false,
            levels: [
                {
                    level: 1,
                    layoutAlgorithm: 'squarified',
                    borderWidth: 1,
                    borderColor: '#000',
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'top',
                        style: {
                            // fontSize: '11px',
                            fontWeight: 'normal',
                        },
                    },
                },
            ],
            data: chartData,
        },
    ],
    title: false,
    credits: false,
    tooltip: {
        shared: false,
        useHTML: true,
        formatter: function () {
            let text = `${fields.name}: <b>${this.point?.name}</b>  <br>`;
            text += `${fields.value}: <b>${this.point?.value}</b>  <br>`;
            text += `position: <b>${this.point?.position || 'n/a'}</b> <br>`;
            text += `percentage change: <b>${this.point?.percentageChange}</b> <br>`;
            return text;
        },
    },
});

const TreeChart = ({ data, height, title }) => {
    const [options, setOptions] = useState(null);
    useEffect(() => {
        if (!data) return;
        let fields = {
            name: 'fault code',
            value: 'occurrences',
        };
        let chartData = data.map((item) => {
            if (item.duration) {
                fields.name = 'fault code';
                fields.value = 'duration';
            }
            if (item.deviceName) {
                fields.name = 'device name';
            }
            if (item.deviceName && item.duration) {
                fields.value = 'duration';
            }
            if (item.studType) {
                fields.name = 'stud type';
            }
            let newItem = { ...item };
            const name = newItem.faultCode || newItem.studType;
            const value = newItem.occurrences || newItem.duration;
            newItem.color = generateColorHsl(newItem.deviceName || String(name), [50, 70], [30, 50]);
            newItem.value = `${value}` | 'name';
            newItem.name = newItem.deviceName || String(name);
            return { ...newItem };
        });
        const optionss = createOptions(chartData, height, fields);
        setOptions(optionss);
    }, [data, height, title]);

    if (!options) return null;
    return (
        <div className="treemap">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default TreeChart;
