import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './mypage.css';

export default function MyPage() {
    const navigate = useNavigate();
    return (
        <>
            <Header pageName="마이페이지" />
            <div className="mypage_container">
                <div className="mypage_profile_container">
                    <img src="/mypage/mypage_profile.png" className="mypage_profile_img" />
                    <p className="mypage_profile_name">이름</p>
                </div>

                <button className="mypage_list_line">
                    나의 장바구니 목록 <img src="/mypage/Vector.png" className="mypage_button_icon" />
                </button>
                <button className="mypage_list_line" onClick={() => navigate('/my/mypodList')}>
                    나의 팟 내역 <img src="/mypage/Vector.png" className="mypage_button_icon" />
                </button>
                <button className="mypage_list_line">
                    참여 팟 내역 <img src="/mypage/Vector.png" className="mypage_button_icon" />
                </button>
                <button className="mypage_list_line">
                    내가 남긴 후기 <img src="/mypage/Vector.png" className="mypage_button_icon" />
                </button>
                <button className="mypage_list_line">
                    받은 거래 후기 <img src="/mypage/Vector.png" className="mypage_button_icon" />
                </button>
            </div>
        </>
    );
}
