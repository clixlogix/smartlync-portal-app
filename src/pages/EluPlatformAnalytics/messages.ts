/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    eluPlatformAnalyticsPageTitle: _t(translations.EluPlatformAnalytics.PageTitle, 'Platform Overview '),
    eluPlatformAnalyticsTitle: _t(translations.EluPlatformAnalytics.Title, 'Platform Overview '),
    layout: _t(translations.General.LayoutLabel, 'Layout '),
    dailyDataUploadLabel: _t(translations.EluPlatformAnalytics.DailyDataUploadLabel, "ELU's Daily Data Upload"),
    weeklyDataUploadLabel: _t(translations.EluPlatformAnalytics.WeeklyDataUploadLabel, "ELU's Weekly Data Upload"),
    monthlyDataUploadLabel: _t(translations.EluPlatformAnalytics.MonthlyDataUploadLabel, "ELU's Monthly Data Upload"),
    annualDataUploadLabel: _t(translations.EluPlatformAnalytics.AnnualDataUploadLabel, "ELU's Annual Data Upload"),
    hourlyDataUploadLabel: _t(translations.EluPlatformAnalytics.HourlyDataUploadLabel, "ELU's Hourly Data Upload"),
};
