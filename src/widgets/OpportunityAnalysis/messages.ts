/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    opportunityAnalysisTitle: _t(translations.Widgets.OpportunityAnalysisWidget.WidgetTitle, 'Opportunity Analysis '),
    opportunityAnalysisSubTitle: _t(translations.Widgets.OpportunityAnalysisWidget.SubTitle, 'Opportunity Analysis '),
    actionRecommended: _t(translations.Widgets.OpportunityAnalysisWidget.ActionRecommended, 'Action Recommended'),
    actionTaken: _t(translations.Widgets.OpportunityAnalysisWidget.ActionTaken, 'Action Taken'),
    caseClosed: _t(translations.Widgets.OpportunityAnalysisWidget.CaseClosed, 'Case Closed'),
    eventTypeLabel: _t(translations.Filters.EventTypeLabel, 'Event Type'),
    eventTypePlaceholder: _t(translations.Filters.EventTypePlaceholder, 'Filter By Event Type'),
};
