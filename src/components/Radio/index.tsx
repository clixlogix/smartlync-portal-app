import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { theme } from 'styles/theme/styledTheme';

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface Props extends InputProps {
    id: string;
    label: string;
    className?: string;
    isSelected?: boolean;
}

export const Radio = memo(({ id, label, className, isSelected, ...restOf }: Props) => {
    return (
        <Wrapper className={className}>
            <input type="radio" id={id} checked={isSelected} {...restOf} />
            <label htmlFor={id}>{label}</label>
        </Wrapper>
    );
});

const Wrapper = styled.div`
    input[type='radio'] {
        margin: 0;
        opacity: 0;
        width: 0;
        height: 0;
        padding: 0;

        + label {
            margin: 0;
            display: inline-block;
            padding-left: 1.375rem;
            padding-top: 0.0625rem;
            position: relative;
            cursor: pointer;
            font-size: 0.875rem;
            color: ${theme.text};
            z-index: 1;

            a {
                color: ${theme.text};
                text-decoration: none;
            }

            &::before {
                position: absolute;
                top: 0.25rem;
                left: 0;
                display: inline-block;
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                content: '';
                border: 2px solid ${theme.border};
                transition: all 0.1s;
            }

            &::after {
                display: none;
                content: '';
                position: absolute;
                display: inline-block;
                width: 0.375rem;
                height: 0.375rem;
                border-radius: 50%;
                top: 0.5625rem;
                left: 0.3125rem;
            }

            &:hover {
                &::before {
                    border-color: ${theme.primary};
                }
            }
        }

        &:disabled {
            + label {
                opacity: 0.6;
                cursor: auto;

                &:hover {
                    &::before {
                        border-color: ${theme.border};
                    }
                }
            }
        }

        &:focus {
            + label {
                &::before {
                    box-shadow: 0 0 0 3px
                        ${theme.primary.replace(/rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/, 'rgba$1,0.2)')};
                }
            }
        }

        &:checked {
            + label {
                &::before {
                    background-color: ${theme.primary};
                    border-color: ${theme.primary};
                }

                &::after {
                    display: inline-block;
                }
            }
        }
    }
`;
