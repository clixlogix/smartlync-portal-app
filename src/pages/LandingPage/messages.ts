/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantPageTitle: _t(
        translations.HomePage.PageTitle,
        'Home', // default value
    ),
    plantTitle: _t(
        translations.HomePage.Title,
        'Home', // default value
    ),
    reportingView_title: _t(
        translations.HomePage.Title,
        'Hubert Reporting view', // default value
    ),
    last_Updated: _t(
        translations.HomePage.Last_Updated,
        'Last_Updated', // default value
    ),
    risk: _t(
        translations.HomePage.Risk,
        'Risk', // default value
    ),
    target: _t(
        translations.HomePage.Target,
        'Target', // default value
    ),
    technicalAvail: _t(
        translations.HomePage.TechnicalAvail,
        'TA', // default value
    ),
    faultTrend: _t(
        translations.HomePage.FaultTrend,
        'Fault Trend', // default value
    ),
    cycleCount: _t(
        translations.HomePage.cycleCount,
        'Cycles', // default value
    ),
    eventCount: _t(
        translations.HomePage.eventCount,
        'Faults', // default value
    ),
    eventRate: _t(
        translations.HomePage.eventRate,
        'Fault Rate', // default value
    ),
    noPlants: _t(translations.General.NoPlants, 'No data'), // default value
};
