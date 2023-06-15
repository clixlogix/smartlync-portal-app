/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    stationAnomalyTitle: _t(translations.Widgets.StationAnomaly.Title, 'Station Anomaly widget'),
    stationAnomalySubTitle: _t(translations.Widgets.StationAnomaly.SubTitle, 'A station anomaly widget'),
    noAnomaly: _t(translations.Widgets.StationAnomaly.NoAnomaly, 'None'),
    anomalyFeedback: _t(translations.Widgets.StationAnomaly.AnomalyFeedbackLabel, 'Feedback'),
    anomalyMetadata: _t(translations.Widgets.StationAnomaly.AnomalyMetadataLabel, 'Metadata'),
    anomalyTypeLabel: _t(translations.Widgets.ProcessLog.AnomalyTypeLabel, 'Type'),
    faultCodeLabel: _t(translations.Filters.FilterByFaultCodeLabel, 'Fault Code'),
    studTypeLabel: _t(translations.Filters.FilterByStudTypeLabel, 'Stud Type'),
    studIdLabel: _t(translations.Filters.FilterByStudIdLabel, 'Stud ID'),
    deviceNameLabel: _t(translations.Filters.FilterByDeviceNameLabel, 'Device Name'),
    dateLabel: _t(translations.Filters.FilterByDateLabel, 'Date'),
    eventTypeLabel: _t(translations.Filters.EventTypeLabel, 'Event Type'),
    stationLabel: _t(translations.Filters.StationLabel, 'Station'),
};
