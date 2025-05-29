import { useLocation, useNavigate } from 'react-router-dom';
import HeaderButton from '../HeaderButton';
import './podRegister.css';
import Header from '../Header';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DaumPost from './DaumPost';
import { postPodAddress, postPodMinOrder } from '../../api/userApi';
import { placeProps } from '../../types/types';

export const shoppingmallList = [
    '플랫폼 선택',
    'COUPANG',
    'NAVER_SHOPPING',
    'ALIEXPRESS',
    'UNKNOWN',
    // '쿠팡이츠',
    // '11번가',
    // 'G마켓',
    // '위메프',
    // '옥션',
    // '아마존',
    // '월마트',
];

const CustomDatePicker = DatePicker as unknown as React.FC<any>;

export default function PodRegister() {
    const location = useLocation();
    const navigate = useNavigate();
    const podType = location.state?.currentPodType;
    const [step, setStep] = useState<number>(1);
    const [podName, setPodName] = useState<string>('');
    const [platform, setPlatform] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    //만나는 장소 상태값
    const [place, setPlace] = useState<placeProps>({
        address: '',
        detailedAddress: '',
        latitude: 0, // 위도
        longitude: 0, //경도
    });
    const [addressId, setAddressId] = useState<number>(0);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [popUp, setPopUp] = useState(false);
    //step2
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const podAddressData = async () => {
        try {
            const roadAddress = place.address;
            const longitude = place.longitude;
            const latitude = place.latitude;
            const res = await postPodAddress({ roadAddress, longitude, latitude });

            if (res.isSuccess) {
                setAddressId(res.result);
                setStep(2);
                console.log('팟 주소 ID 성공');
                return;
            }
        } catch {
            return;
        }
    };

    const fetchPodMinOrder = async () => {
        try {
            const res = await postPodMinOrder({ podName, platform, addressId, endDate, totalAmount, description });
            console.log('res', res);
            if (res.isSuccess) {
                setStep(3);
                console.log('팟 생성 성공');
            }
        } catch {}
    };

    // 팝업 열고 닫기
    const handleComplete = () => {
        setPopUp(!popUp);
    };

    const handleChangePodName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPodName(e.target.value);
    };

    const handleSelectPlatForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlatform(e.target.value);
    };

    const handleStepOneButton = () => {
        if (podName && platform && place && endDate) {
            podAddressData();
        } else {
            return;
        }
    };

    const handleSubmitStep2button = () => {
        if (podName && platform && place && endDate && totalAmount && addressId) {
            fetchPodMinOrder();
        }
    };

    const handleSubmitStep3button = () => {
        navigate('/');
    };

    function formatWithComma(numStr: string): string {
        const onlyNums = numStr.replace(/[^0-9]/g, '');
        return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <>
            <Header pageName="팟 등록" />
            <div className="podRegister_total_div">
                <HeaderButton type1="최소금액 주문" type2="물품 공동구매" activeType={podType} />

                <div className="podReigster_total_container">
                    {step === 1 && (
                        <>
                            <p className="podRegister_podNameQ">팟 이름을 입력해주세요</p>
                            <input
                                type="text"
                                value={podName}
                                onChange={handleChangePodName}
                                className="podRegister_input"
                            />
                            <p className="podRegister_podNameQ">어느 플랫폼에서 주문하나요?</p>
                            <select className="podRegister_select" onChange={handleSelectPlatForm}>
                                {shoppingmallList.map((mall, index) => (
                                    <option key={index} value={mall}>
                                        {mall}
                                    </option>
                                ))}
                            </select>

                            <p className="podRegister_podNameQ">어디에서 만날 예정인가요?</p>
                            <div>
                                <input
                                    type="text"
                                    value={place.address}
                                    // onChange={handleChangeMeetPlace}
                                    className="podRegister_input"
                                    placeholder="기본주소"
                                />

                                <input
                                    type="text"
                                    value={place.detailedAddress}
                                    className="podRegister_input"
                                    placeholder="상세주소"
                                />
                                <button className="podRegister_meetPlace_button" onClick={handleComplete}>
                                    주소 검색
                                </button>
                            </div>
                            <p className="podRegister_podNameQ">모집 마감일은 언제인가요?</p>
                            <CustomDatePicker
                                selected={endDate}
                                onChange={(date: Date | null) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="날짜를 선택하세요"
                            />

                            <button
                                className={
                                    podName && platform && place && endDate
                                        ? 'podRegister_ste1_complete_button_active'
                                        : 'podRegister_ste1_complete_button'
                                }
                                onClick={handleStepOneButton}
                            >
                                목표 금액 입력하기
                            </button>
                        </>
                    )}{' '}
                    {step === 2 && (
                        <>
                            <div className="podRegister_step2_pod_div">
                                <p className="podRegister_step2_podName">{podName} </p>
                                <p className="podRegister_step2_platform"> {platform}</p>
                            </div>
                            <div>
                                <p className="podRegister_step2_place">
                                    <img src="/register/place_icn.png" className="podRegister_step2_icon" />{' '}
                                    {place.address}
                                </p>
                                <p className="podRegister_step2_place">
                                    <img src="/register/callendar_icn.png" className="podRegister_step2_icon" />{' '}
                                    {endDate ? endDate.toLocaleDateString('ko-KR') : ''}
                                </p>
                            </div>
                            <div className="podRegister_step2_line"></div>
                            <div>
                                <p className="podRegiste_step2_comment1">이제 거의 다 되었어요 :)</p>
                                <h3 className="podRegiste_step2_comment2">목표 금액을 입력하세요!</h3>
                                <p className="podRegister_step2_totalAmount_text">
                                    <input
                                        type="text"
                                        value={totalAmount.toLocaleString()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            setTotalAmount(Number(raw));
                                        }}
                                        className="podRegister_step2_totalAmount_input"
                                    />
                                    원
                                </p>
                            </div>
                            <button className="podRegister_step2_SubmitButton" onClick={handleSubmitStep2button}>
                                팟 생성 완료하기
                            </button>
                        </>
                    )}{' '}
                    {step === 3 && (
                        <>
                            <div className="podRegister_step3_div">
                                <img src="/mypage/mypage_profile.png" className="podRegister_step3_img" />
                                <p className="podRegister_step3_podName">{podName}</p>
                                <p className="podRegister_step3_platform">{platform}</p>
                                <p className="podRegister_step2_place">
                                    <img src="/register/place_icn.png" className="podRegister_step2_icon" />{' '}
                                    {place.address}
                                </p>
                                <p className="podRegister_step2_place">
                                    <img src="/register/callendar_icn.png" className="podRegister_step2_icon" />{' '}
                                    {endDate ? endDate.toLocaleDateString('ko-KR') : ''}
                                </p>
                                <button className="podRegister_step3_SubmitButton" onClick={handleSubmitStep3button}>
                                    메인으로
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {popUp && <DaumPost address={place} setAddress={setPlace} handleComplete={handleComplete} />}
        </>
    );
}
