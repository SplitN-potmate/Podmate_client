import axios from 'axios';
import { postPodAddressProps, postPodMinOrderProps } from '../types/types';

const userAxios = axios.create({
    baseURL: 'http://3.37.242.204:8081',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const kakaoLogin = async () => {
    try {
        const res = await userAxios.post('/oauth2/authorization/kakao');
        return res.data;
    } catch {}
};

export const testUser = async () => {
    const res = await userAxios.get('/api/auth/test-token?userId=2');
    console.log(res.data);
    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return res.data;
};

export const getPodList = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const res = await userAxios.get(`api/pods`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data.result;
    } catch {}
};

//팟 생성 주소 저장 api
export const postPodAddress = async ({ roadAddress, latitude, longitude }: postPodAddressProps) => {
    const accessToken = localStorage.getItem('accessToken');
    const res = await userAxios.post(
        `/api/pods/addresses`,
        {
            roadAddress,
            latitude,
            longitude,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return res.data;
};

//최소주문 팟 생성
export const postPodMinOrder = async ({
    podName,
    platform,
    addressId,
    endDate,
    totalAmount,
    description,
}: postPodMinOrderProps) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const res = await userAxios.post(
            `/api/pods/minimum-order`,
            {
                podName: podName,
                platform: platform,
                addressId: addressId,
                deadline: endDate,
                goalAmount: totalAmount,
                description,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return res.data;
    } catch {}
};
