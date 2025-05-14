import { useEffect } from 'react';

export default function OAuthRedirect() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        if (status === 'success' && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // alert('로그인 성공!');
            window.location.href = '/main';
            //메인페이지로 이동
        } else {
            alert('로그인 실패…');
            window.location.href = '/login';
        }
    }, []);

    return <div>로그인 처리 중…</div>;
}
