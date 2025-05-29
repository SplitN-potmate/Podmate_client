import { useEffect, useState } from 'react';
import { PodProps } from '../../types/types';
import PodPercentBar from './PodPercentBar';

export default function Pod({
    podName,
    podType,
    podId,
    currentAmount,
    goalAmount,
    podStatus,
    jjim,
    platform,
}: PodProps) {
    const [hanguelStatus, setHangeulStatus] = useState<string>('');
    const changePodStatus = () => {
        if (podStatus == 'IN_PROGRESS') {
            setHangeulStatus('진행 중');
        }
    };

    useEffect(() => {
        changePodStatus();
    }, []);

    return (
        <>
            <div className="myPodList_pod_container">
                <div className="myPodList_pod_title_container">
                    <div className="myPodList_pod_title_div">
                        <p className="myPodList_pod_title">{podName}</p>
                        <p className="myPodList_pod_podtype">
                            {podType === 'GROUP_BUY' ? '물품 공동구매' : '최소주문 금액'}
                        </p>
                    </div>

                    <p className="myPodList_pod_podState">{hanguelStatus ? hanguelStatus : ''}</p>
                </div>

                <PodPercentBar percentage={(currentAmount / goalAmount) * 100} />

                <div className="myPodList_pod_pod_bottom">
                    <p className="myPodList_pod_platform">{platform ? platform : ''}</p>
                    <div className="myPodList_pod_amount_div">
                        <p className="myPodList_pod_amount_main">{currentAmount ? currentAmount : ''}</p>
                        <p className="myPodList_pod_amount_sub">/{goalAmount ? goalAmount : ''}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
