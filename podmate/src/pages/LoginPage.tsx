import './loginPage.css';
import React from 'react';

export default function LoginPage() {
    // const restApiKey = import.meta.env.VITE_RESTAPI_KEY;
    // const redirectURL = import.meta.env.VITE_REDIRECT_URI;
    const kakaoLoginHandler = () => {
        try {
            window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
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
