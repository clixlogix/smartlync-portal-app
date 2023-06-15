/**
 *
 * LinearProgress
 *
 */
import React, { memo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import styled from 'styled-components/macro';

import 'scss/main.scss';
import './LinearProgress.scss';

interface ProgressBarProps {
    className?: string;
    variant?: ProgressVariant;
    value?: number;
}

export type ProgressVariant = 'buffer' | 'determinate' | 'indeterminate' | 'query' | undefined;

export const ProgressBar = memo((props: ProgressBarProps) => {
    const { className = '', variant = 'buffer', value = 50 } = props;
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);
    const progressRef = React.useRef(() => {});

    React.useEffect(() => {
        progressRef.current = () => {
            if (progress > 100) {
                setProgress(0);
                setBuffer(10);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(progress + diff);
                setBuffer(progress + diff + diff2);
            }
        };
    });

    React.useEffect(() => {
        if (value <= -1) {
            const timer = setInterval(() => {
                progressRef.current();
            }, 500);

            return () => {
                clearInterval(timer);
            };
        }
    }, [value]);

    return (
        <Div className={`${className} x-cls-linear-progress`}>
            <LinearProgress variant={variant} value={progress} valueBuffer={buffer} />
        </Div>
    );
});

const Div = styled.div``;

export default ProgressBar;
