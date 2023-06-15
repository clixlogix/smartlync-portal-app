import { ChartRef } from 'components/panels/Chart/Chart';

export const synchronousChart = (refs: ChartRef[] | undefined) => {
    return function (event) {
        var thisChart = this.chart;
        const xMin = event.min;
        const xMax = event.max;
        const shouldShowResetZoom = !(
            xMin === thisChart.xAxis[0].options.min && xMax === thisChart.xAxis[0].options.max
        );

        if (event.trigger !== 'syncExtremes') {
            refs?.forEach((item: any) => {
                const ex = item.current?.chart.xAxis[0].getExtremes();
                if (item.current?.chart !== thisChart) {
                    if (ex?.min !== xMin || ex?.max !== xMax) {
                        item.current?.chart.xAxis[0].setExtremes(event.min, event.max, undefined, false, {
                            trigger: 'syncExtremes',
                        });
                    }
                }

                if (shouldShowResetZoom && !item.current?.chart.resetZoomButton) {
                    item.current?.chart.showResetZoom();
                } else if (!shouldShowResetZoom && item.current?.chart.resetZoomButton) {
                    item.current.chart.resetZoomButton = item.current.chart.resetZoomButton.destroy();
                }
            });
        }
    };
};
