/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    measurementsWidgetTitle: _t(translations.Widgets.MeasurementsWidget.WidgetTitle, 'MeasurementsWidget widget'), // default value
    measurementsWidgetSubTitle: _t(translations.Widgets.MeasurementsWidget.SubTitle, 'A measurementsWidget widget'), // default value
    cycleGapGraphTitle: _t(
        translations.Widgets.MeasurementsWidget.GraphTitle,
        'Measurements (station: {{stationName}}',
    ),
    none: _t(translations.Widgets.MeasurementsWidget.None, 'None'),
    eventTypeLabel: _t(translations.Widgets.MeasurementsWidget.EventTypeLabel, 'Event Type'),
    unitslabel: _t(translations.Widgets.MeasurementsWidget.Unitslabel, 'Weld Energy'),
};
