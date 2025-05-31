import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './reviewPage.css';
import { useEffect, useState } from 'react';
import { getReviewTarget, postReviewTarget } from '../../api/userApi';

type PodMember = {
    userId: number;
    nickname: string;
    profileImageUrl: string;
};

const reviewOptions = [
    { label: '거래가 정확해요', code: 'EXACT_TRANSACTION' },
    { label: '친절해요', code: 'KIND' },
    { label: '시간 약속을 잘 지켜요', code: 'ON_TIME' },
    { label: '응답이 빨라요', code: 'QUICK_RESPONSE' },
    { label: '별로예요', code: 'BAD' },
];

export default function ReviewPage() {
    const location = useLocation();
    const podID = location.state;
    const navigate = useNavigate();
    const [reviewTargets, setReviewTargets] = useState<PodMember[]>([]);

    const [completedMember, setCompletedMember] = useState<number[]>([]);
    const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<number, string[]>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getReviewTarget(podID);
                console.log('res', res);
                setReviewTargets(res.podMembers);
            } catch (error) {
                console.error('리뷰 대상 조회 실패:', error);
            }
        };

        if (podID) {
            fetchData();
        }
    }, [podID]);

    const handleChange = (memberId: number, option: string) => {
        setSelectedOptionsMap((prev) => {
            const currentOptions = prev[memberId] || [];
            const updatedOptions = currentOptions.includes(option)
                ? currentOptions.filter((item) => item !== option)
                : [...currentOptions, option];
            return { ...prev, [memberId]: updatedOptions };
        });
    };

    const onClickMemberReviewPost = async (memberId: number) => {
        const options = selectedOptionsMap[memberId];
        if (!podID || !options || options.length === 0) return;

        try {
            await postReviewTarget({
                podId: podID,
                recipientId: memberId,
                options,
            });

            setCompletedMember((prev) => [...prev, memberId]);
        } catch (error) {
            console.error('리뷰 저장 실패:', error);
        }
    };
    return (
        <>
            <Header pageName="후기 남기기" />
            <div className="reviewPage-members-container">
                {reviewTargets?.map((member) => {
                    const isCompleted = completedMember.includes(member.userId);
                    const selectedOptions = selectedOptionsMap[member.userId] || [];
                    return (
                        <>
                            <div
                                className={isCompleted ? 'reviewPage-profile-div' : 'reviewPage-profile-div-active'}
                                key={member.userId}
                            >
                                <img
                                    src={
                                        isCompleted ? '/review/review-profile-black.png' : '/mypage/mypage_profile.png'
                                    }
                                    className="reviewPage-profile-img"
                                />
                                <p
                                    className={
                                        isCompleted ? 'reviewPage-profile-name' : 'reviewPage-profile-name-active'
                                    }
                                >
                                    {member.nickname}
                                </p>
                            </div>

                            <div className="checkbox-wrapper">
                                <h3 className="checkout-title">이 팟원은 어땠나요?</h3>
                                <p className="checkout-title-second">후기를 남겨주세요:)</p>
                                {reviewOptions.map((option) => (
                                    <label key={option.code} className="custom-checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={option.code}
                                            checked={selectedOptions.includes(option.code)}
                                            onChange={() => handleChange(member.userId, option.code)}
                                            className="hidden-checkbox"
                                        />
                                        <span className="custom-box"></span>
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                            <button
                                className="reviewPage-button"
                                onClick={() => onClickMemberReviewPost(member.userId)}
                            >
                                후기 저장
                            </button>
                        </>
                    );
                })}

                <button className="reviewPage-submit-button" onClick={() => navigate('/mypage')}>
                    후기 작성 완료
                </button>
            </div>
        </>
    );
}
