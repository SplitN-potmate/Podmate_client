import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./mypage.css";
import { useState, useRef, useEffect } from "react";
import MyReviewList from "../../components/mypage/ReceivedReivewList";
import { getUser, getUserProfile } from "../../api/userApi";

type UserInfo = {
  profile: {
    userId: number;
    nickname: string;
    profileImageUrl: string;
  };
  reviews: [];
};

export default function MyPage() {
  const navigate = useNavigate();
  const [onReview, setOnReview] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const reviewListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = await getUser();
      if (userData.userId) {
        const profileData = await getUserProfile(userData.userId);
        if (profileData) {
          setUserInfo(profileData);
          console.log("userProfile", profileData);
        }
      }
    };
    fetchUserInfo();
  }, []);

  const handleReviewClick = () => {
    setOnReview((prev) => !prev);
    if (!onReview && reviewListRef.current) {
      setTimeout(() => {
        reviewListRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <Header pageName="마이페이지" />
      <div className="mypage_container">
        <div className="mypage_profile_container">
          <img
            src={
              userInfo?.profile.profileImageUrl || "/mypage/mypage_profile.png"
            }
            className="mypage_profile_img"
            alt="프로필 이미지"
          />
          <p className="mypage_profile_name">
            {userInfo?.profile.nickname || "이름"}
          </p>
        </div>

        <button
          className="mypage_list_line"
          onClick={() => {
            navigate("/my/myCart");
          }}
        >
          나의 장바구니 목록{" "}
          <img src="/mypage/Vector.png" className="mypage_button_icon" />
        </button>
        <button
          className="mypage_list_line"
          onClick={() => navigate("/my/mypodList")}
        >
          나의 팟 내역{" "}
          <img src="/mypage/Vector.png" className="mypage_button_icon" />
        </button>
        <button
          className="mypage_list_line"
          onClick={() => navigate("/my/joinedpodList")}
        >
          참여 팟 내역{" "}
          <img src="/mypage/Vector.png" className="mypage_button_icon" />
        </button>
        <button
          className="mypage_list_line"
          onClick={() => navigate("/my/myReviews")}
        >
          내가 남긴 후기{" "}
          <img src="/mypage/Vector.png" className="mypage_button_icon" />
        </button>

        <button className="mypage_list_line" onClick={handleReviewClick}>
          받은 거래 후기{" "}
          <img src="/mypage/Vector.png" className="mypage_button_icon" />
        </button>
        {onReview ? (
          <div ref={reviewListRef}>
            <MyReviewList />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
