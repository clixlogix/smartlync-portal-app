/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantCycleCountTitle: _t(translations.Widgets.PlantCycleCount.WidgetTitle, 'PlantCycleCount widget'), // default value
    plantCycleCountSubTitle: _t(translations.Widgets.PlantCycleCount.SubTitle, 'A plantCycleCount widget'), // default value

    totalCycles: _t(translations.PlantOverview.TotalCycles, 'Weekly Cycle Counts'),
    currentWeekText: _t(translations.PlantOverview.CurrentWeekText, 'Current Week'),
    previousDay: _t(translations.PlantOverview.PreviousDay, 'Previous Day'),
    previousWeek: _t(translations.PlantOverview.PreviousWeek, 'Previous Week'),
    week: _t(translations.PlantOverview.Week, 'Week'),
    totalCyclesTooltip: _t(translations.PlantOverview.TotalCyclesTooltip, ' in week'),
    noData: _t(translations.ReportingViewPage.NoData, 'No Data to be displayed'),
    currentYear: _t(translations.PlantOverview.CurrentYear, 'Current Year'),
};
