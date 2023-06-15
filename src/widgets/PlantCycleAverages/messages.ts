/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    plantCycleAveragesTitle: _t(translations.Widgets.PlantCycleAverages.SubTitle, 'PlantCycleAverages widget'), // default value
    plantCycleAveragesSubTitle: _t(translations.Widgets.PlantCycleAverages.SubTitle, 'A plantCycleAverages widget'), // default value
    week: _t(translations.PlantOverview.Week, 'Week'), // default value
    technicalAvailability: _t(translations.PlantOverview.TechnicalAvailability, 'Technical Availability'), // default value
    meanTimeToRepair: _t(translations.PlantOverview.MeanTimeToRepair, 'Mean Time To Repair'), // default value
    meanTimeBetweenFailure: _t(translations.PlantOverview.MeanTimeBetweenFailure, 'Mean Time Between Failure'), // default value
    meanTimeToFailure: _t(translations.PlantOverview.MeanTimeToFailure, 'Mean Time To Failure'), // default value
    noData: _t(translations.General.NoData, 'No data'), // default value
};
