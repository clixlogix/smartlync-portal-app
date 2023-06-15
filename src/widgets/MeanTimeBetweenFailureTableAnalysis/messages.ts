/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    meanTimeBetweenFailureTableAnalysisTitle: _t(
        translations.Widgets.MeanTimeBetweenFailureTableAnalysis.WidgetTitle,
        'MeanTimeBetweenFailureTableAnalysis widget',
    ), // default value
    meanTimeBetweenFailureTableAnalysisSubTitle: _t(
        translations.Widgets.MeanTimeBetweenFailureTableAnalysis.SubTitle,
        'A meanTimeBetweenFailureTableAnalysis widget',
    ), // default value
    deviceNameOutlet: _t(translations.Widgets.MeanTimeBetweenFailureTableAnalysis.TableDeviceName, 'DeviceName Outlet'),
    Event_Agnostic_Downtime: _t(translations.Widgets.MeanTimeBetweenFailureTableAnalysis.TotalMtbf, 'All faults'),
    noData: _t(translations.General.NoData, 'No data'), // default value
};
