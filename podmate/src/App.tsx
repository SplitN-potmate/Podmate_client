import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import styled from "@emotion/styled";
import LoginPage from "./pages/LoginPage";
import OAuthRedirect from "./components/OAuthRedirect";
import Home from "./pages/mainPage/Home";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import MyPage from "./pages/myPage/MyPage";
import PodRegisterPage from "./pages/PodRegisterPage";
import MyPodList from "./pages/myPage/MyPodList";
import PodRegister from "./components/register/PodRegister";

const BackGround = styled.div`
  background-color: #cccccc;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MobileFrame = styled.div`
  width: 375px;
  height: 812px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: auto;
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
  const hideNav =
    location.pathname === "/login" || location.pathname === "/oauth/redirect";

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/redirect" element={<OAuthRedirect />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<PodRegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/my/mypodList" element={<MyPodList />} />
        <Route path="/register/minAmountPod" element={<PodRegister />} />
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
