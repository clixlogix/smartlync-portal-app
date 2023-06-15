/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    saTableTitle: _t(translations.Widgets.SaTable.Title, 'SaTable widget'), // default value
    saTableSubTitle: _t(translations.Widgets.SaTable.SubTitle, 'A saTable widget'), // default value
    station: _t(translations.Widgets.SaTable.Station, 'Station'),
    deviationUptime: _t(translations.Widgets.SaTable.DeviationUptime, 'St. Deviation Uptime (min)'),
    downtime: _t(translations.Widgets.SaTable.Downtime, 'Downtime (min)'),
    maxUptime: _t(translations.Widgets.SaTable.MaxUptime, 'Max Uptime (min)'),
    meanUptime: _t(translations.Widgets.SaTable.MeanUptime, 'Mean Uptime (min)'),
    totalUptime: _t(translations.Widgets.SaTable.TotalUptime, 'Total Uptime (min)'),
    TA: _t(translations.Widgets.SaTable.TA, 'TA (%)'),
};
