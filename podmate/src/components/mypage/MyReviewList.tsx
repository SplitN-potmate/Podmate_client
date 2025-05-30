import { useEffect, useState } from 'react';
import { getMyReviews } from '../../api/userApi';
import Header from '../Header';
import './myReviewList.css';

type ReviewProps = {
    optionTexts: string[];
    recipient: {
        userId: number;
        profileImgUrl: string;
        nickname: string;
    };
};

export default function MyReviewList() {
    const [reviewList, setReviewList] = useState<ReviewProps[]>([]);

    const getMyReviewsData = async () => {
        const res = await getMyReviews();
        setReviewList(res);
        console.log('res', res);
    };

    useEffect(() => {
        getMyReviewsData();
    }, []);
    return (
        <>
            <Header pageName="나의 후기" />
            <div>
                {reviewList?.map((review, index) => (
                    <div className="myReview-container">
                        <div className="myReview_review_title_div" key={index}>
                            <img src="/mypage/mypage_profile.png" className="myReview_review_profile" />
                            <p className="myReview_review_title">{review.recipient.nickname}</p>
                        </div>
                        <div className="myReview-review-lis">
                            {review.optionTexts.map((text, idx) => (
                                <p className="myReview-review-comment" key={idx}>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
