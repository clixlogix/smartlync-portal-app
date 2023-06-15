/**
 *
 * CircularBarWithLabel
 *
 */
import React, { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


interface Props {
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
    value: any;
    label: string;
    unit?: any;
}

export const CircularBarWithLabel = memo((props: Props) => {
    const { value = 0, label, unit } = props;

    const v = parseFloat(value).toFixed(2);
    // const v = +value.toFixed(1);
    const color = v > '99.8' ? 0 : v > '99.4' ? 1 : 2;
    const colors = ['#149B74', '#FF9D00', '#e42d37'];

    return (
            <Box  position='relative' display='inline-flex'
                sx={{ width: '215px', height: '186px' , flexDirection:'column',
                    alignItems:'center'}}>
                    <Typography >{label}</Typography>

                    <Box sx={{ position: 'relative', display: 'inline-flex' }}> 
                        <CircularProgress
                            size="7rem"
                            variant="determinate"
                            {...props}
                            style={{
                                color: colors[color],
                                border: '1px ridge #3F5208',
                                borderRadius: '50%',
                            }}

                            sx = {{   width:'100px', height:'100px',
                                    marginTop: '5px', marginBottom:'17px'
                            }}
                        />
                     
                    <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="caption" component="div" style={{ color: 'white', fontSize: 13 }}>
                                {`${parseFloat(value).toFixed(2)}`}
                                {unit}
                            </Typography>
                        </Box>
                    </Box>
            </Box>
    );
});


export default CircularBarWithLabel;
