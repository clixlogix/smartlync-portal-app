/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    measurementGraphTitle: _t(
        translations.Widgets.MeasurementsSprWidget.GraphTitle,
        'Measurements (station: {{stationName}}',
    ),
    none: _t(translations.Widgets.MeasurementsSprWidget.None, 'None'),
    eventTypeLabel: _t(translations.Widgets.MeasurementsSprWidget.EventTypeLabel, 'Event Type'),
    unitslabel: _t(translations.Widgets.MeasurementsSprWidget.Unitslabel, 'Weld Energy'),
};
