import { Rule } from 'components/panels/RulesPanel/RulesPanel';

export interface RulesPanelState {
    isPanelOpen: boolean;
    rules: Rule[];
    savedRules: Rule[];
    appliedRules: Rule[];
}
