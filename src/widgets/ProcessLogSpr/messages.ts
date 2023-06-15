/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    processLogTitle: _t(translations.Widgets.ProcessLog.Title, 'ProcessLog widget'),
    processLogSubTitle: _t(translations.Widgets.ProcessLog.SubTitle, 'A processLog widget'),
    anomalyTypeLabel: _t(translations.Widgets.ProcessLog.AnomalyTypeLabel, 'Type'),
    anomalyDeviceLabel: _t(translations.Widgets.ProcessLog.AnomalyDeviceLabel, 'Device Information'),
    anomalyStationLabel: _t(translations.Filters.StationLabel, 'Station'),
    anomalyListLabel: _t(translations.Widgets.ProcessLog.AnomalyListLabel, 'Anomaly'),
    anomalyConfidenceLabel: _t(translations.Widgets.ProcessLog.AnomalyConfidenceLabel, 'Confidence'),
    anomalyTimeLabel: _t(translations.Widgets.ProcessLog.AnomalyTimeLabel, 'Time'),
    anomalyFeedbackLabel: _t(translations.Widgets.ProcessLog.AnomalyFeedbackLabel, 'Feedback'),
    anomalyStationPlaceholder: _t(translations.Filters.FilterByStationPlaceholder, 'Station'),
    processStudId: _t(translations.Widgets.ProcessLog.studId, 'Stud Id'),
};

export default messages;
