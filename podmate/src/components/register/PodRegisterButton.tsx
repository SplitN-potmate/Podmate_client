import { useState } from 'react';
import './podRegisterButton.css';
import { useNavigate } from 'react-router-dom';

export default function PodRegisterButton() {
    const navigate = useNavigate();
    const [podType, setPodType] = useState<string>('');

    const onClickPodTypeAmount = () => {
        const currentPodType = '최소금액 주문';
        setPodType('최소금액 주문');
        navigate('/register/minAmountPod', {
            state: {
                currentPodType,
            },
        });
    };

    const onClickPodTypeCollective = () => {
        const currentPodType = '물품 공동구매';
        setPodType('물품 공동구매');
        navigate('/register/minAmountPod', {
            state: {
                currentPodType,
            },
        });
    };
    return (
        <div className="podRegister_container">
            <div className="podRegister_button" onClick={onClickPodTypeAmount}>
                <p>최소금액 주문</p>
                <img src="/navigator/registerIcon.png" className="register_icon" />
            </div>
            <div className="podRegister_button" onClick={onClickPodTypeCollective}>
                <p>물품 공동구매</p>
                <img src="/navigator/registerIcon.png" className="register_icon" />
            </div>
            {/* <div>
                <p className="podRegister_cancel_button">취소</p>
            </div> */}
        </div>
    );
}
