import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './podMember.css';
import { useState } from 'react';
import { patchApprovalStatus } from '../../api/userApi';

const approvalStatusMap: Record<string, string> = {
    PENDING: '승인 대기',
    ACCEPTED: '승인 완료',
    REJECTED: '승인 거절',
};

export default function PodMember() {
    const location = useLocation();
    const navigate = useNavigate();
    const MemberList = location.state?.members;
    const podId = location.state?.podId;
    const podType = location.state?.podType;
    console.log('podtype', podType);
    const [memberList, setMemberList] = useState(MemberList);

    const [openDropdownUserId, setOpenDropdownUserId] = useState<number | null>(null);

    const handleChangeStatus = (userId: number, newStatus: string) => {
        console.log(userId);
        patchApprovalStatus(userId, podId, newStatus)
            .then(() => {
                // 상태 업데이트
                const updated = memberList.map((item: any) =>
                    item.memberProfile.userId === userId
                        ? {
                              ...item,
                              memberProfile: {
                                  ...item.memberProfile,
                                  isApproved: newStatus,
                              },
                          }
                        : item
                );
                setMemberList(updated);
            })
            .catch((err) => {
                alert('상태 변경에 실패했습니다.');
                console.error(err);
            });
    };

    const onClickMemberOrder = (userId: number, podId: number) => {
        navigate('/member/order', {
            state: {
                userId: userId,
                podId: podId,
            },
        });
    };

    return (
        <>
            <Header pageName="팟원 목록" />
            <div className="myPodList_pod_container">
                {memberList?.map((item: any) => {
                    const { userId, nickname, profileImageUrl, isApproved, mannerScore } = item.memberProfile;
                    const isGroupBuy = podType === 'GROUP_BUY';
                    const amountLabel = isGroupBuy
                        ? `희망 개수: ${item.groupBuyQuantity}개`
                        : `희망 금액: ${item.orderItem.totalAmount}원`;

                    return (
                        <div className="pm_container" key={userId}>
                            <div className="pm_title_container">
                                <div className="pm_title_div">
                                    <p className="pm_title">🙋{nickname}</p>
                                    <p className={`manner-badge manner-${mannerScore}`}>매너 {mannerScore}/5</p>
                                </div>
                                <div>
                                    <p
                                        onClick={() =>
                                            setOpenDropdownUserId(openDropdownUserId === userId ? null : userId)
                                        }
                                    >
                                        {approvalStatusMap[isApproved]}
                                    </p>
                                    {openDropdownUserId === userId && (
                                        <ul className="dropdown-list">
                                            {Object.entries(approvalStatusMap).map(([eng, kor]) => (
                                                <li
                                                    key={eng}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        handleChangeStatus(userId, eng);
                                                        setOpenDropdownUserId(null);
                                                    }}
                                                >
                                                    {kor}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="pm_bottom_div">
                                <p className="pm_totalAmount">{amountLabel}</p>

                                <button className="pm_button" onClick={() => onClickMemberOrder(userId, podId)}>
                                    주문서 보러가기
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
