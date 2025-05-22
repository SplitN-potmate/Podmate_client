import { useState } from 'react';
import './headerButton.css';
import { HeaderButtonProps } from '../types/types';

export default function HeaderButton({ type1, type2, activeType }: HeaderButtonProps) {
    // const onClickInProgressPod = () => {
    //     setActiveB('inPro');
    // };
    // const onClickCompletedPod = () => {
    //     setActiveB('completed');
    // };
    return (
        <>
            <div className="headerButton_button_container">
                <button className={activeType === type1 ? 'headerButton_button_active' : 'headerButton_button'}>
                    {type1}
                </button>
                <button className={activeType === type2 ? 'headerButton_button_active' : 'headerButton_button'}>
                    {type2}
                </button>
            </div>
        </>
    );
}
