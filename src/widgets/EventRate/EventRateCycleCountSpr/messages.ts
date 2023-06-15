/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {

    eventRateCycleCounSprTitleWeekly: _t(
        translations.Widgets.EventRateCycleCount.EventRateCycleCountitleWeekly,
        'Cycle count By Week 2021',
    ),
    eventRateCycleCounSprTitleDaily: _t(
        translations.Widgets.EventRateCycleCount.EventRateCycleCountitleDaily,
        'Cycle count By Day 2021',
    ),
    yAxisEventRateCycleCountTitle: _t(
        translations.Widgets.EventRateCycleCount.YAxisEventRateCycleCountTitle,
        'Cycle Count',
    ),
    secondaryYAxisEventRateCycleCountTitle: _t(
        translations.Widgets.EventRateCycleCount.SecondaryYAxisEventRateCycleCountTitle,
        'Event Rate',
    ),

    xAxisEventRateCycleCountTitleWeekly: _t(
        translations.Widgets.EventRateCycleCount.XAxisEventRateCycleCountTitleWeekly,
        'Week',
    ),
    xAxisEventRateCycleCountTitleDaily: _t(
        translations.Widgets.EventRateCycleCount.XAxisEventRateCycleCountTitleDaily,
        'Day',
    ),
    fault: _t(translations.Widgets.EventCodeFrequency.Fault, 'Fault'),
};
