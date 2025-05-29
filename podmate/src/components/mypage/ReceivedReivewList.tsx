import { useEffect, useState } from 'react';
import { getReceivedReviews } from '../../api/userApi';
import './receivedReviewList.css';

type ReviewList = {
    recipient: {
        userId: number;
        nickname: string;
        profileImageUrl: string;
    };
    optionTexts: string[];
};

export default function ReceivedReviewList() {
    const [reviewList, setReviewList] = useState<ReviewList[]>([]);
    const [optionCount, setOptionCount] = useState<Record<string, number>>({});

    const getReceivedReviewsData = async () => {
        try {
            const res = await getReceivedReviews();

            console.log('res', res);
            setReviewList(res);

            // 빈도수 저장용 객체
            const optionCount: Record<string, number> = {};

            // 각 result 안의 optionTexts를 순회
            for (const item of res) {
                for (const text of item.optionTexts) {
                    optionCount[text] = (optionCount[text] || 0) + 1;
                }
            }
            setOptionCount(optionCount);
        } catch {}
    };
    console.log(optionCount);

    useEffect(() => {
        getReceivedReviewsData();
    }, []);

    return (
        <>
            <div>
                <div className="review-total-div">
                    {Object.entries(optionCount).map(([text, count]) => (
                        <div className="review-div">
                            <div className="review-container-triangle"></div>
                            <div key={text} className="review-container">
                                <p>{text}</p>
                                <p className="review-count">{count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
