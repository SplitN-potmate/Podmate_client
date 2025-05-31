import { useEffect, useState } from 'react';
import { PodProps } from '../../types/types';
import './pod.css';
import { getReviewTarget } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

export default function CompletedPod({
    podName,
    podType,
    podId,
    currentAmount,
    goalAmount,
    podStatus,
    jjim,
    platform,
}: PodProps) {
    const navigate = useNavigate();
    const [hanguelStatus, setHangeulStatus] = useState<string>('');

    const changePodStatus = () => {
        if (podStatus == 'COMPLETED') {
            setHangeulStatus('완료');
        }
    };

    useEffect(() => {
        changePodStatus();
    }, []);

    const onClickReviewButton = (podId: number) => {
        navigate('/review', {
            state: podId,
        });
        console.log('id', podId);
    };

    return (
        <>
            <div className="completedPod_pod_container">
                <div className="completedPod_pod_title_container">
                    <div className="completedPod_pod_title_div">
                        <p className="completedPod_pod_title">{podName}</p>
                        <p className="completedPod_pod_podtype">
                            {podType === 'GROUP_BUY' ? '물품 공동구매' : '최소주문 금액'}
                        </p>
                    </div>

                    <p className="completedPod_pod_podState">{hanguelStatus ? hanguelStatus : ''}</p>
                </div>

                <div>
                    <button className="completedPod-review-button" onClick={() => onClickReviewButton(podId)}>
                        거래 후기를 남겨주세요!
                    </button>
                </div>
            </div>
        </>
    );
}
