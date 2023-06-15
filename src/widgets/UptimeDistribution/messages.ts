/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    uptimeDistributionTitle: _t(translations.Widgets.UptimeDistribution.Title, 'UptimeDistribution widget'), // default value
    uptimeDistributionSubTitle: _t(translations.Widgets.UptimeDistribution.SubTitle, 'A uptimeDistribution widget'),
    distributionDailyText: _t(
        translations.Widgets.UptimeDistribution.DistributionDailyText,
        'Distribution of daily Uptime per station',
    ),
};
