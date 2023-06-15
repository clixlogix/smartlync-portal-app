
import Chip, { ChipTypeMap } from '@mui/material/Chip';
import { memo } from 'react';

import 'scss/main.scss';
import './CustomChip.scss';

// declare module '@mui/styles/defaultTheme' {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface DefaultTheme extends Theme {}
// }

type ChipProps = ChipTypeMap['props'];

export const CustomChip = memo(({ variant, color = 'default', ...other }: ChipProps) => {
    return <Chip variant={variant} color={color} {...other} />;
});

export default CustomChip;