import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
// import './LanguageSwitch.scss';

export enum LanguageSwitchType {
    DropDown = 'DropDown',
    CheckBox = 'CheckBox',
}
export interface LanguageSwitchProps {
    className?: string;
    switchType?: LanguageSwitchType;
    onLangChange?(value);
}

export const LanguageSwitch = (props: LanguageSwitchProps) => {
    const { i18n } = useTranslation() as any;
    const { onLangChange } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleLanguageChange = (event: any) => {
        const language = event.value;
        setAnchorEl(null);
        i18n.changeLanguage(language);
        if (onLangChange) {
            onLangChange(event.value);
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const selected = `${i18n.language}`.split('-')[0];
    const options = i18n.availableLanguages;

    return (
        <>
            <Button
                variant="outlined"
                sx={{
                    width: 0,
                    height: 28,
                }}
                onClick={handleClick}
            >
                <Typography>{selected}</Typography>
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {options.map((option, index) => (
                    <MenuItem
                        key={option.key}
                        sx={{
                            width: 100,
                            textAlign: 'center',
                            top: undefined,
                            height: undefined,
                        }}
                        selected={option.value === selected}
                        onClick={() => handleLanguageChange(option)}
                    >
                        {option.label || 'NA'}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default LanguageSwitch;
