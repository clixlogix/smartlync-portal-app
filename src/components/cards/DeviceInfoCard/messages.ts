/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    averageTAText: _t(translations.Components.OverviewCard.AverageTA, 'TA'),
    faultsText: _t(translations.Components.OverviewCard.FaultsText, 'Faults'),
    cyclesText: _t(translations.Components.OverviewCard.CyclesText, 'Cycles'),
    MTTRUnitsText: _t(translations.Components.OverviewCard.MTTRUnitsText, 'min'),
    MTBFUnitsText: _t(translations.Components.OverviewCard.MTBFUnitsText, 'hr'),
    MTTRText: _t(translations.Components.OverviewCard.MTTRText, 'MTTR'),
    MTBFText: _t(translations.Components.OverviewCard.MTBFText, 'MTTR'),
};
