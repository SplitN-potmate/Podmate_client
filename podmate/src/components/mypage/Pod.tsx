import { useEffect, useState } from 'react';
import { PodProps } from '../../types/types';
import PodPercentBar from './PodPercentBar';
import Modal from '../Modal';
import { getPodMembers, patchPodStatus, postAccountInfo, postTrackingNum } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

const statusMap: Record<string, string> = {
    RECRUITING: '모집중',
    PENDING_ORDER: '주문 대기',
    ORDER_COMPLETED: '주문 완료',
    WAITING: '진행 대기',
};

export default function Pod({
    podName,
    podType,
    podId,
    currentAmount,
    goalAmount,
    podStatus,
    jjim,
    platform,
    inprogressStatus,
}: PodProps) {
    const navigate = useNavigate();
    const [hanguelStatus, setHangeulStatus] = useState<string>('');
    const [localInprogressStatus, setLocalInprogressStatus] = useState(inprogressStatus);
    const [onTrackingNumInput, setOnTrackingNumInput] = useState<boolean>(false);
    const [onAccountInput, setOnAccountInput] = useState<boolean>(false);
    const [account, setAccount] = useState<string>('');
    const [holder, setHolder] = useState<string>('');
    const [bank, setBank] = useState<string>('');
    const [trackingNum, setTrackingNum] = useState<string>('');
    const [courier, setCourier] = useState<string>('');

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [completedAccount, setCompletedAccount] = useState<boolean>(false);
    const [completedTrackingNum, setCompletedTrackingNum] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // 드롭다운 열림 여부

    const handleSelectStatus = (status: string) => {
        const currentStatus = status;
        setLocalInprogressStatus(status);
        setHangeulStatus(status);
        console.log(currentStatus);
        patchPodStatus(currentStatus, podId);
        setIsDropdownOpen(false);
    };

    const onClickSubmitAccount = async () => {
        if (!account || !bank || !holder) return;

        postAccountInfo({
            depositAccountNumber: account,
            depositAccountBank: bank,
            depositAccountHolder: holder,
            podId,
        })
            .then((result) => {
                if (result) {
                    setModalMessage('계좌 정보가 입력되었습니다.\n팟원들에게 안전하게 전달할게요!');
                    setIsOpenModal(true);
                    setCompletedAccount(true);
                }
            })
            .catch((error) => {
                console.error('계좌 정보 전송 실패:', error);
                setModalMessage('계좌 정보 전송에 실패했어요.\n잠시 후 다시 시도해주세요.');
                setIsOpenModal(true);
            });
    };

    const onClickSubmitTrackingNum = () => {
        if (!trackingNum || !courier) return;

        postTrackingNum({
            trackingNum: trackingNum,
            courierCompany: courier,
            podId,
        })
            .then((result) => {
                if (result) {
                    setModalMessage('운송장 정보가 입력되었습니다.\n팟원들에게 빠르게 전달할게요!');
                    setIsOpenModal(true);
                    setCompletedAccount(true);
                }
            })
            .catch((error) => {
                console.error('운송장 정보 전송 실패:', error);
                setModalMessage('운송장 정보 전송에 실패했어요.\n잠시 후 다시 시도해주세요.');
                setIsOpenModal(true);
                setCompletedTrackingNum(true);
            });
    };

    const onClickgetPodMembers = () => {
        getPodMembers(podId)
            .then((result) => {
                if (result.podMembers.length > 0) {
                    navigate('/my/pod/members', {
                        state: {
                            members: result.podMembers,
                            podId: podId,
                            podType: podType,
                        },
                    });
                } else {
                    setModalMessage('승인 대기 중인 팟원이 없어요!');
                    setIsOpenModal(true);
                }
            })
            .catch((error) => {
                console.error('운송장 정보 전송 실패:', error);
                setModalMessage('운송장 정보 전송에 실패했어요.\n잠시 후 다시 시도해주세요.');
                setIsOpenModal(true);
                setCompletedTrackingNum(true);
            });
    };

    return (
        <>
            <div className="myPodList_pod_container">
                <div className="myPodList_pod_title_container">
                    <div className="myPodList_pod_title_div">
                        <p className="myPodList_pod_title" onClick={onClickgetPodMembers}>
                            {podName}
                        </p>
                        <p className="myPodList_pod_podtype">
                            {podType === 'GROUP_BUY' ? '물품 공동구매' : '최소주문 금액'}
                        </p>
                    </div>
                    <div>
                        <p className="myPodList_pod_podState" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                            {localInprogressStatus ? statusMap[localInprogressStatus] : ''}
                        </p>
                        {isDropdownOpen && (
                            <ul className="dropdown-list">
                                {Object.entries(statusMap).map(([eng, kor]) => (
                                    <p key={eng} className="dropdown-item" onClick={() => handleSelectStatus(eng)}>
                                        {kor}
                                    </p>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <PodPercentBar percentage={(currentAmount / goalAmount) * 100} />

                <div className="myPodList_pod_pod_bottom">
                    <p className="myPodList_pod_platform">{platform ? platform : ''}</p>
                    <div className="myPodList_pod_amount_div">
                        <p className="myPodList_pod_amount_main">{currentAmount ? currentAmount : ''}</p>
                        <p className="myPodList_pod_amount_sub">/{goalAmount ? goalAmount : ''}</p>
                    </div>
                </div>
                {localInprogressStatus == 'PENDING_ORDER' ? (
                    <div>
                        <button className="inprogressPod-button" onClick={() => setOnAccountInput((prev) => !prev)}>
                            {completedAccount ? '계좌 정보 입력 완료' : '계좌 정보를 입력해주세요!'}
                        </button>{' '}
                    </div>
                ) : (
                    ''
                )}

                {localInprogressStatus === 'ORDER_COMPLETED' && (
                    <div>
                        <button className="inprogressPod-button" onClick={() => setOnTrackingNumInput((prev) => !prev)}>
                            {completedTrackingNum ? '운송장 번호 입력 완료' : '운송장 번호 입력'}
                        </button>
                    </div>
                )}

                {onAccountInput ? (
                    <div>
                        <div className="inProgressPod-account-div">
                            <h4 className="account-title">🏦은행명</h4>
                            <input
                                className="inProgressPod-account-input"
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                            />
                        </div>
                        <div className="inProgressPod-account-div">
                            <h4>💳계좌번호</h4>
                            <input
                                className="inProgressPod-account-input"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                            />
                        </div>
                        <div className="inProgressPod-account-div">
                            <h4 className="account-title">👤수취인</h4>
                            <input
                                className="inProgressPod-account-input"
                                value={holder}
                                onChange={(e) => setHolder(e.target.value)}
                            />
                        </div>

                        <button className="account-submit-button" onClick={onClickSubmitAccount}>
                            계좌 입력 완료!
                        </button>
                    </div>
                ) : (
                    ''
                )}

                {onTrackingNumInput ? (
                    <div>
                        <div className="inProgressPod-account-div">
                            <h4 className="account-title">🚚택배사</h4>
                            <input
                                className="inProgressPod-account-input"
                                value={courier}
                                onChange={(e) => setCourier(e.target.value)}
                            />
                        </div>

                        <div className="inProgressPod-account-div">
                            <h4 className="account-title">
                                📦운송장
                                <h4 className="account-title-second">번호</h4>
                            </h4>
                            <input
                                className="inProgressPod-account-input"
                                value={trackingNum}
                                onChange={(e) => setTrackingNum(e.target.value)}
                            />
                        </div>

                        <button className="account-submit-button" onClick={onClickSubmitTrackingNum}>
                            운송장 입력 완료!
                        </button>
                    </div>
                ) : (
                    ''
                )}
            </div>
            {isOpenModal ? (
                <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} message={modalMessage} />
            ) : (
                ''
            )}
        </>
    );
}
