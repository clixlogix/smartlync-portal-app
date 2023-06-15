/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantHealthOverviewPageTitle: _t(translations.PlantOverview.PageTitle, 'Plant Overview '),
    plantHealthOverviewTitle: _t(translations.PlantOverview.Title, 'Plant Overview '),
    systemHealthCard: _t(translations.PlantOverview.SystemHealthCard, 'System Health Card'),
    week: _t(translations.PlantOverview.Week, 'Week'),
    change: _t(translations.PlantOverview.Change, 'Change'),
    new: _t(translations.PlantOverview.New, 'New'),
    noChange: _t(translations.PlantOverview.NoChange, 'No Change'),
};
