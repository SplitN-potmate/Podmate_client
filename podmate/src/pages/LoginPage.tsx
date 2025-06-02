import "./loginPage.css";

export default function LoginPage() {
  // const restApiKey = import.meta.env.VITE_RESTAPI_KEY;
  // const redirectURL = import.meta.env.VITE_REDIRECT_URI;
  const kakaoLoginHandler = () => {
    try {
      window.location.href =
        "http://3.37.242.204:8081/oauth2/authorization/kakao";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <p>PodMate</p>
      </div>
      <button className="kakao-login-button" onClick={kakaoLoginHandler}>
        <img src="/login/kakaologo.png" className="kakao-logo" />
        카카오 로그인
      </button>
    </div>
  );
}
