import { getCompletedMyPods, getInProgressMyPods } from '../../api/userApi';
import Header from '../../components/Header';
import Pod from '../../components/mypage/Pod';
import { PodProps } from '../../types/types';

import './myPodList.css';
import { useEffect, useState } from 'react';

export default function MyPodList() {
    const [activeB, setActiveB] = useState<string>('inProgress');
    const [podList, setPodList] = useState<PodProps[]>([]);
    const fetchData = async () => {
        try {
            const podList = await getInProgressMyPods();
            console.log(podList);
            setPodList(podList);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchgetCompletedMyPodData = async () => {
        const res = await getCompletedMyPods();
        console.log(res);
        setPodList(res);
        return res;
    };

    useEffect(() => {
        if (activeB === 'inProgress') {
            fetchData();
        } else {
            fetchgetCompletedMyPodData();
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
                    {podList
                        ? podList.map((pod) => (
                              <Pod
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
                                  inprogressStatus={pod.inprogressStatus}
                              />
                          ))
                        : ''}
                </div>
            </div>
        </>
    );
}
