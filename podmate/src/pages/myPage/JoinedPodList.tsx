import { getCompletedJoinedPods, getInProgressJoinedPods } from '../../api/userApi';
import Header from '../../components/Header';
import CompletedPod from '../../components/mypage/CompletedPod';
import Pod from '../../components/mypage/Pod';
import { PodProps } from '../../types/types';
import './myPodList.css';
import { act, useEffect, useState } from 'react';

export default function JoinedPodList() {
    const [activeB, setActiveB] = useState<string>('inProgress');
    const [podList, setPodList] = useState<PodProps[]>([]);
    const fetchInProgressJoinedPods = async () => {
        try {
            const podList = await getInProgressJoinedPods();
            console.log(podList);
            setPodList(podList);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchgetCompletedJoindedPods = async () => {
        const res = await getCompletedJoinedPods();
        console.log(res);
        setPodList(res);
        return res;
    };

    useEffect(() => {
        if (activeB === 'inProgress') {
            fetchInProgressJoinedPods();
        } else {
            fetchgetCompletedJoindedPods();
        }
    }, [activeB]);

    const onClickInProgressPod = () => {
        setActiveB('inProgress');
    };
    const onClickCompletedPod = () => {
        setActiveB('completed');
        // fetchgetCompletedMyPodData();
    };

    return (
        <>
            <Header pageName="팟 목록" />
            <div className="myPodList_container">
                <div className="myPodList_button_container">
                    <button
                        className={activeB === 'inProgress' ? 'myPodList_button_active' : 'myPodList_button'}
                        onClick={onClickInProgressPod}
                    >
                        진행 중인 팟
                    </button>
                    <button
                        className={activeB === 'completed' ? 'myPodList_button_active' : 'myPodList_button'}
                        onClick={onClickCompletedPod}
                    >
                        완료된 팟
                    </button>
                </div>

                <div className="myPodList_podList_div">
                    {podList &&
                        podList.map((pod) => {
                            const isCompleted = activeB === 'completed';
                            const PodComponent = isCompleted ? CompletedPod : Pod;

                            return (
                                <PodComponent
                                    key={pod.podId}
                                    podId={pod.podId}
                                    podName={pod.podName}
                                    podType={pod.podType}
                                    podStatus={pod.podStatus}
                                    itemUrl={pod.itemUrl}
                                    currentAmount={pod.currentAmount}
                                    goalAmount={pod.goalAmount}
                                    jjim={pod.jjim}
                                    platform={pod.platform}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
}
