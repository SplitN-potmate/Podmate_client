import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginPage from './pages/LoginPage';
import OAuthRedirect from './components/OAuthRedirect';
import Home from './pages/Home';
import NavigationBar from './components/NavigationBar';
import MyPage from './pages/Mypage';

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
    height: 844px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
`;

// 내부 라우팅과 NavigationBar 조건 렌더링
const AppRoutes = () => {
    const location = useLocation();
    const hideNav = location.pathname === '/login' || location.pathname === '/oauth/redirect';

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<div>등록 페이지</div>} />
                <Route path="/mypage" element={<MyPage />} />
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
