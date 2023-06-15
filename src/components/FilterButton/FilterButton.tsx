import React from 'react';
import AppRegistrationIcon from '@mui/icons-material/Apps';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import styled from 'styled-components/macro';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './FilterButton.scss';

interface FilterButtonProps {
    isEdit?: boolean;
    isLayoutEdit?: boolean;
    hanldeLayoutEdit?: (isEdit: boolean) => void;
    hanldeFilterPanelOpen: (isOpen: boolean) => void;
    className?: string;
}

export const FilterButton = ({
    isLayoutEdit,
    isEdit = true,
    hanldeLayoutEdit = () => {},
    hanldeFilterPanelOpen = () => {},
    className,
}: FilterButtonProps) => {
    return (
        <Div className={`page-title-bar ${className}`}>
            <Div className={'x-cls-action-btns'}>
                {isEdit && typeof isLayoutEdit !== 'undefined' && (
                    <Tooltip title={isLayoutEdit ? 'Stop page layout' : 'Edit page layout'}>
                        <Button
                            className={`layout-btn layout-edit-${!!isLayoutEdit}`}
                            onClick={() => hanldeLayoutEdit(!isLayoutEdit)}
                        >
                            <AppRegistrationIcon />
                        </Button>
                    </Tooltip>
                )}
                <Tooltip title="Add global filter">
                    <Button className="filter-button" onClick={() => hanldeFilterPanelOpen(true)}>
                        <FilterAltIcon style={{ color: '#C3D4FB', fontSize: '24px' }} />
                    </Button>
                </Tooltip>
            </Div>
        </Div>
    );
};

const Div = styled.div``;
