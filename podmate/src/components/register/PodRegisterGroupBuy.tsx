import { useLocation, useNavigate } from 'react-router-dom';
import HeaderButton from '../HeaderButton';
import './podRegister.css';
import Header from '../Header';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DaumPost from './DaumPost';
import { postPodAddress, postPodGroupBuy } from '../../api/userApi';
import { placeProps } from '../../types/types';

const CustomDatePicker = DatePicker as unknown as React.FC<any>;

export default function PodRegisterGroupBuy() {
    const location = useLocation();
    const navigate = useNavigate();
    const podType = location.state?.currentPodType;
    const [step, setStep] = useState<number>(1);
    const [podName, setPodName] = useState<string>('');
    //상품 url
    const [itemUrl, setItemUrl] = useState<string>('');
    //전체 금액
    const [totalAmount, setTotalAmount] = useState<number>(0);
    //단위 금액
    const [unitPrice, setUnitPrice] = useState<number>(0);
    //전체 개수
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    //단위 개수
    const [unitQuantitiy, setUnitQuantity] = useState<number>(0);
    //상품 설명
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

    const fetchPodGroupBuy = async () => {
        try {
            const res = await postPodGroupBuy({
                podName,
                itemUrl,
                addressId,
                endDate,
                totalAmount,
                totalQuantity,
                description,
                unitPrice,
                unitQuantitiy,
            });
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

    const handleChangeItemUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemUrl(e.target.value);
    };

    const handleStepOneButton = () => {
        if (podName && itemUrl && place && endDate) {
            podAddressData();
            // setStep(2);
        } else {
            return;
        }
    };

    const handleSubmitStep2button = () => {
        if (
            podName &&
            itemUrl &&
            place &&
            endDate &&
            totalAmount &&
            totalQuantity &&
            unitPrice &&
            unitQuantitiy &&
            addressId
        ) {
            fetchPodGroupBuy();
        }
    };

    const handleSubmitStep3button = () => {
        navigate('/');
    };

    return (
        <>
            <Header pageName="팟 등록" />
            <div className="podRegister_total_div">
                <HeaderButton type1="최소금액 주문" type2="물품 공동구매" activeType={podType} />

                <div>
                    {step === 1 && (
                        <>
                            <p className="podRegister_podNameQ">팟 이름을 입력해주세요</p>
                            <input
                                type="text"
                                value={podName}
                                onChange={handleChangePodName}
                                className="podRegister_input"
                            />
                            <p className="podRegister_podNameQ">어떤 상품을 공동구매 하나요?</p>
                            <input className="podRegister_input" value={itemUrl} onChange={handleChangeItemUrl} />

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
                                    podName && itemUrl && place && endDate
                                        ? 'podRegister_ste1_complete_button_active'
                                        : 'podRegister_ste1_complete_button'
                                }
                                onClick={handleStepOneButton}
                            >
                                물품 정보 입력하기
                            </button>
                        </>
                    )}{' '}
                    {step === 2 && (
                        <>
                            <div className="podRegister_step2_pod_div">
                                <p className="podRegister_step2_podName">{podName} </p>
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
                                <h3 className="podRegiste_step2_comment2">상품 개수를 입력하세요!</h3>
                                <p className="podRegisterGroupBuy_step2_text">
                                    전체
                                    <input
                                        type="text"
                                        value={totalQuantity.toLocaleString()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            setTotalQuantity(Number(raw));
                                        }}
                                        className="podRegisterGroupBuy_step2_totalAmount_input"
                                    />
                                    개
                                </p>
                                <p className="podRegisterGroupBuy_step2_text">
                                    단위
                                    <input
                                        type="text"
                                        value={unitQuantitiy.toLocaleString()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            setUnitQuantity(Number(raw));
                                        }}
                                        className="podRegisterGroupBuy_step2_totalAmount_input"
                                    />
                                    개
                                </p>
                                <h3 className="podRegiste_step2_comment2">상품 금액을 입력하세요!</h3>
                                <p className="podRegisterGroupBuy_step2_text">
                                    {' '}
                                    전체
                                    <input
                                        type="text"
                                        value={totalAmount.toLocaleString()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            setTotalAmount(Number(raw));
                                        }}
                                        className="podRegisterGroupBuy_step2_totalAmount_input"
                                    />
                                    개
                                </p>{' '}
                                <p className="podRegisterGroupBuy_step2_text">
                                    단위
                                    <input
                                        type="text"
                                        value={unitPrice.toLocaleString()}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^0-9]/g, '');
                                            setUnitPrice(Number(raw));
                                        }}
                                        className="podRegisterGroupBuy_step2_totalAmount_input"
                                    />
                                    개
                                </p>
                            </div>
                            <button
                                className="podRegisterGroupBuy_step2_SubmitButton"
                                onClick={handleSubmitStep2button}
                            >
                                팟 생성 완료하기
                            </button>
                        </>
                    )}{' '}
                    {step === 3 && (
                        <>
                            <div className="podRegister_step3_div">
                                <img src="/mypage/mypage_profile.png" className="podRegister_step3_img" />
                                <p className="podRegister_step3_podName">{podName}</p>
                                {/* <p className="podRegister_step3_platform">{platform}</p> */}
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
