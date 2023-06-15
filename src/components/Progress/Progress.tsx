/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import './Progress.scss';

/**
 *
 *
 * @interface ProgressProps
 */
interface ProgressProps {
    progress: Number;
}

/**
 *
 *
 * @class Progress
 * @extends {Component<ProgressProps>}
 */
class Progress extends Component<ProgressProps> {
    render() {
        const { progress = 0 } = this.props;

        return (
            <div className="ProgressBar">
                <div className="Progress" style={{ width: `${progress}%` }} />
            </div>
        );
    }
}

export default Progress;
