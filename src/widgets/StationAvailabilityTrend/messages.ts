/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    stationAvailabilityTrendTitle: _t(
        translations.Widgets.StationAvailabilityTrend.Title,
        'Station Availability Trend',
    ), // default value
    stationAvailabilityTrendSubTitle: _t(
        translations.Widgets.StationAvailabilityTrend.SubTitle,
        'A stationAvailabilityTrend widget',
    ), // default value
    xAxis: _t(translations.Widgets.StationAvailabilityTrend.XAxis, 'Week interval'),
    yAxis: _t(translations.Widgets.StationAvailabilityTrend.YAxis, 'TA (%)'),
    station: _t(translations.Widgets.StationAvailabilityTrend.Station, 'Station'),
    cycleCount: _t(translations.Widgets.StationAvailabilityTrend.CycleCount, 'Cycle Count'),
    faultCount: _t(translations.Widgets.StationAvailabilityTrend.FaultCount, 'Fault Count'),
    wopCount: _t(translations.Widgets.StationAvailabilityTrend.WopCount, 'WOP Count'),
    totalUptime: _t(translations.Widgets.StationAvailabilityTrend.TotalUptime, 'Total Uptime (min)'),
    downtime: _t(translations.Widgets.StationAvailabilityTrend.Downtime, 'Downtime (min)'),
};
