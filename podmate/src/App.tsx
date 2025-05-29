import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginPage from './pages/LoginPage';
import OAuthRedirect from './components/OAuthRedirect';
import Home from './pages/Home';
import NavigationBar from './components/NavigationBar';
import MyPage from './pages/myPage/MyPage';
import PodRegisterPage from './pages/PodRegisterPage';
import MyPodList from './pages/myPage/MyPodList';
import PodRegister from './components/register/PodRegister';
import PodRegisterGroupBuy from './components/register/PodRegisterGroupBuy';
import JoinedPodList from './pages/myPage/JoinedPodList';
import MyOrderWrite from './components/mypage/MyCartItems';
import MyCart from './components/mypage/MyCart';
import MyCartList from './pages/myPage/MyCartList';
import MyReviewList from './components/mypage/MyReviewList';
import MyCartItems from './components/mypage/MyCartItems';

const BackGround = styled.div`
    margin: 0;
    padding: 0;
    background-color: #cccccc;
    height: 100%;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MobileFrame = styled.div`
    width: 390px;
    height: 784px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: auto;
    padding-bottom: 60px; /* ✅ NavigationBar 높이만큼 여백 추가 */

    /* 스크롤바 숨기기 */
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE, Edge */
    scrollbar-width: none; /* Firefox */
`;

// 내부 라우팅과 NavigationBar 조건 렌더링
const AppRoutes = () => {
    const location = useLocation();
    const hideNav = location.pathname !== '/main' && location.pathname !== '/mypage';

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                <Route path="/main" element={<Home />} />
                <Route path="/register" element={<PodRegisterPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/my/mypodList" element={<MyPodList />} />
                <Route path="/my/joinedpodList" element={<JoinedPodList />} />
                <Route path="/my/myCart" element={<MyCartList />} />
                <Route path="/my/myOrder/write" element={<MyOrderWrite />} />
                <Route path="/my/cart" element={<MyCart />} />
                <Route path="/my/cartItems" element={<MyCartItems />} />
                <Route path="/my/myReviews" element={<MyReviewList />} />
                <Route path="/register/minAmountPod" element={<PodRegister />} />
                <Route path="/register/groupBuyPod" element={<PodRegisterGroupBuy />} />
            </Routes>
            {!hideNav && <NavigationBar />}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <BackGround>
                <MobileFrame>
                    <AppRoutes />
                </MobileFrame>
            </BackGround>
        </Router>
    );
};

export default App;
