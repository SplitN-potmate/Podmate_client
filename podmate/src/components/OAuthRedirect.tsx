import { useEffect } from 'react';

export default function OAuthRedirect() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        console.log(status);
        const accessToken = urlParams.get('accessToken');
        console.log(accessToken);
        const refreshToken = urlParams.get('refreshToken');

        if (status === 'success' && accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            // alert('로그인 성공!');
            window.location.href = '/';
        } else {
            //로그인 실패 시 로직은??
            alert('로그인 실패…');
            // window.location.href = '/';
        }
    }, []);

    return <div>로그인 처리 중…</div>;
}
