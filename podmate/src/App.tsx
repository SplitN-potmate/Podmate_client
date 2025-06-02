import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginPage from './pages/LoginPage';
import OAuthRedirect from './components/OAuthRedirect';
import Home from './pages/mainPage/Home';
import NavigationBar from './components/NavigationBar/NavigationBar';
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
import PodJoinPage from './pages/PodJoinPage';
import ReviewPage from './pages/review/ReviewPage';
import PodMember from './components/mypage/PodMember';
import MemberOrder from './components/mypage/MemberOrder';

const BackGround = styled.div`
    background-color: #cccccc;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MobileFrame = styled.div`
    position: relative;
    width: 390px;
    height: 844px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    /** 

    &::-webkit-scrollbar {
        display: none;
    }
				*/
    /* 
    -ms-overflow-style: none; /* IE, Edge */
    /*   scrollbar-width: none; Firefox */
`;

const Content = styled.div`
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        display: none;
    }
`;

// 내부 라우팅과 NavigationBar 조건 렌더링
const AppRoutes = () => {
    const location = useLocation();
    const hideNav = location.pathname !== '/' && location.pathname !== '/mypage';

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<PodRegisterPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/my/mypodList" element={<MyPodList />} />
                <Route path="/my/joinedpodList" element={<JoinedPodList />} />
                <Route path="/my/myCart" element={<MyCartList />} />
                <Route path="/my/myOrder/write" element={<MyOrderWrite />} />
                <Route path="/my/cart" element={<MyCart />} />
                <Route path="/my/cartItems" element={<MyCartItems />} />
                <Route path="/my/myReviews" element={<MyReviewList />} />
                <Route path="/my/pod/members" element={<PodMember />} />
                <Route path="/register/minAmountPod" element={<PodRegister />} />
                <Route path="/register/groupBuyPod" element={<PodRegisterGroupBuy />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/pod/join/mini" element={<PodJoinPage />} />
                <Route path="/pod/join/group" element={<PodJoinPage />} />
                <Route path="/member/order" element={<MemberOrder />} />
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
                    <Content>
                        <AppRoutes />
                    </Content>
                </MobileFrame>
            </BackGround>
        </Router>
    );
};

export default App;
