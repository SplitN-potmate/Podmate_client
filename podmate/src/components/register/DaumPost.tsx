import DaumPostcode from 'react-daum-postcode';
import styled from 'styled-components';
import CloseIcon from '/mypage/close-white.svg';

const DaumPostBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 100;
`;

const DaumPostContainer = styled.div`
    width: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

// type LatLng = {
//     lat: number;
//     lng: number;
// };

export default function DaumPost(props: any) {
    // const [latLng, setLatLng] = useState<LatLng | undefined>();

    const complete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 선택한 주소값을 상태값으로 설정
        props.setAddress({
            ...props,
            address: fullAddress,
        });

        // ✅ SDK 로드 대기
        const waitForKakao = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(waitForKakao);

                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(fullAddress, (result: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const { y, x } = result[0];
                        console.log('위도:', y);
                        console.log('경도:', x);
                        props.setAddress({
                            address: fullAddress,
                            latitude: parseFloat(y),
                            longitude: parseFloat(x),
                        });
                    } else {
                        console.error('주소 검색 실패:', status);
                    }

                    props.handleComplete(); // 팝업 닫기
                });
            }
        }, 100);
    };

    return (
        <DaumPostBackground>
            <DaumPostContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 style={{ color: '#fff', height: '30px', width: '500px' }}>주소 검색</h2>
                    <img
                        src={CloseIcon}
                        width={24}
                        onClick={() => {
                            props.handleComplete();
                        }}
                    />
                </div>
                <DaumPostcode
                    autoClose
                    style={{
                        height: '500px',
                        width: '500px',
                    }}
                    onComplete={complete}
                />
            </DaumPostContainer>
        </DaumPostBackground>
    );
}
