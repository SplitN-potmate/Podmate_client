import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import LoginPage from './pages/LoginPage';
import OAuthRedirect from './components/OAuthRedirect';
import Home from './pages/Home';
import NavigationBar from './components/NavigationBar';

const BackGround = styled.div`
    margin: 0;
    padding: 0;
    background-color: #cccccc; /* 회색 */
    height: 100%;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const MobileFrame = styled.div`
    width: 390px; /* iPhone 12 크기 예시 */
    height: 844px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const App = () => {
    return (
        <Router>
            <BackGround>
                <MobileFrame>
                    <Routes>
                        <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                        <Route path="/" element={<LoginPage />} />
                    </Routes>
                    <Routes>
                        <Route path="/main" element={<Home />} />
                        <Route path="/register" element={<div>등록 페이지</div>} />
                        <Route path="/mypage" element={<div>마이페이지</div>} />
                    </Routes>
                    <NavigationBar />
                </MobileFrame>
            </BackGround>
        </Router>
    );
};

export default App;
