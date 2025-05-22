import { PodProps } from '../../types/types';
import PodPercentBar from './PodPercentBar';

export default function Pod({ podName, podType, podId, currentAmount, goalAmount, jjim }: PodProps) {
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

                    <p className="myPodList_pod_podState">주문 상태?</p>
                </div>

                <PodPercentBar percentage={(currentAmount / goalAmount) * 100} />

                <div className="myPodList_pod_pod_bottom">
                    <p className="myPodList_pod_platform">플랫폼명?</p>
                    <div className="myPodList_pod_amount_div">
                        <p className="myPodList_pod_amount_main">{currentAmount}</p>
                        <p className="myPodList_pod_amount_sub">/{goalAmount}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
