import { PayloadAction } from '@reduxjs/toolkit';
import { Rule } from 'components/panels/RulesPanel/RulesPanel';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { RulesPanelState } from '.';

export const initialState: RulesPanelState = {
    isPanelOpen: false,
    rules: [],
    savedRules: [],
    appliedRules: [],
};

const updateLocalStorage = (rules: Rule[], savedRules: Rule[]): void => {
    localStorage.setItem('rules', JSON.stringify({ addedRules: rules, savedRules: savedRules }));
};

const rulesPanelSlice = createSlice({
    name: 'rulesPanel',
    initialState,
    reducers: {
        openRulesPanel(state, action: PayloadAction<boolean>): void {
            state.isPanelOpen = action.payload;
        },
        getRules(state): void {
            const rulesFromLS = localStorage.getItem('rules');
            const parsedRulesFromLS = rulesFromLS
                ? JSON.parse(rulesFromLS)
                : { addedRules: [], savedRules: [], appliedRule: {} };

            state.rules = parsedRulesFromLS.addedRules;
            state.savedRules = parsedRulesFromLS.savedRules;
        },
        addRule(state, action: PayloadAction<Rule>): void {
            state.rules.push(action.payload);
            updateLocalStorage(state.rules, state.savedRules);
        },
        deleteRule(state, action: PayloadAction<number>): void {
            const newRules = state.rules.filter((rule: Rule) => rule.id !== action.payload);
            state.rules = newRules;
            updateLocalStorage(state.rules, state.savedRules);
        },
        saveRule(state, action: PayloadAction<Rule | Rule[]>): void {
            if (Array.isArray(action.payload)) {
                state.savedRules = action.payload;
                updateLocalStorage(state.rules, state.savedRules);
                return;
            }
            state.savedRules.push(action.payload);
            updateLocalStorage(state.rules, state.savedRules);
        },
        removeFromSaved(state, action: PayloadAction<number>): void {
            const newRules = state.savedRules.filter((rule: Rule) => rule.id !== action.payload);
            state.savedRules = newRules;
            updateLocalStorage(state.rules, state.savedRules);
        },
        applyRule(state, action: PayloadAction<Rule | Rule[]>): void {
            if (Array.isArray(action.payload)) {
                state.appliedRules = action.payload;
                return;
            }

            state.appliedRules.push(action.payload);
        },
        canselAppliedRule(state, action: PayloadAction<number>): void {
            const newAppliedRules = state.appliedRules.filter((rule: Rule) => rule.id !== action.payload);
            state.appliedRules = newAppliedRules;
        },
    },
});

export const { actions: rulesPanelActions, reducer: rulesPanelReducer, name: rulesPanelKey } = rulesPanelSlice;
