/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const messages = {
    // labels
    faultCodeLabel: _t(translations.Filters.FilterByFaultCodeLabel),
    studTypeLabel: _t(translations.Filters.FilterByStudTypeLabel),
    studIdLabel: _t(translations.Filters.FilterByStudIdLabel),
    deviceNameLabel: _t(translations.Filters.FilterByDeviceNameLabel),
    dateLabel: _t(translations.Filters.FilterByDateLabel),

    // Placeholders
    faultCodePlaceholder: _t(translations.Filters.FilterByFaultCodePlaceholder),
    studTypePlaceholder: _t(translations.Filters.FilterByStudTypePlaceholder),
    studIdPlaceholder: _t(translations.Filters.FilterByStudIdPlaceholder),
    deviceNamePlaceholder: _t(translations.Filters.FilterByDeviceNamePlaceholder),
    datePlaceholder: _t(translations.Filters.FilterByDatePlaceholder),
};
