import axios from 'axios';

const userAxios = axios.create({
    baseURL: 'https://localhost:8000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const kakaoLogin = async () => {
    const res = await userAxios.post('/oauth2/authorization/kakao');
    return res.data;
};
