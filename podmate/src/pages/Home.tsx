import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { testUser } from '../api/userApi';

const MapContainer = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
    background-color: #f8f8f8;
`;

const LoadingMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const CurrentLocationButton = styled.button<{ isLoading?: boolean }>`
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1;
    width: 50px;
    height: 50px;
    background-color: white;
    border: none;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f8f8f8;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    &::before {
        content: '';
        width: 20px;
        height: 20px;
        background-image: ${(props) =>
            props.isLoading
                ? 'none'
                : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E")`};
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    ${(props) =>
        props.isLoading &&
        `
    &::after {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const AddressInfo = styled.div`
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 12px 24px;
    border-radius: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    z-index: 1;
    max-width: 90%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f8f8f8;
        transform: translateX(-50%) scale(1.02);
    }

    &:active {
        transform: translateX(-50%) scale(0.98);
    }
`;

const AddressLine = styled.div`
    color: #333;
    font-weight: 500;
`;

const SubAddressLine = styled.div`
    color: #666;
    font-size: 12px;
`;

declare global {
    interface Window {
        kakao: any;
        currentMarker: any;
    }
}

const Home = (): React.ReactElement => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isContainerReady, setIsContainerReady] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<AddressInfo>({
        main: '',
        sub: '',
    });

    //test User2
    useEffect(() => {
        testUser();
    });

    // 지도 컨테이너가 마운트되었는지 확인
    useEffect(() => {
        if (mapRef.current) {
            setIsContainerReady(true);
        }
    }, []);

    // 카카오맵 초기화
    useEffect(() => {
        if (!isContainerReady) {
            return;
        }

        const checkKakaoMapLoaded = () => {
            if (window.kakao && window.kakao.maps) {
                initializeMap();
            } else {
                setTimeout(checkKakaoMapLoaded, 100);
            }
        };

        const initializeMap = () => {
            if (!mapRef.current) {
                return;
            }

            try {
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 3,
                };
                const newMap = new window.kakao.maps.Map(mapRef.current, options);

                const zoomControl = new window.kakao.maps.ZoomControl(); //줌인아웃
                newMap.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                // 지도 클릭 이벤트 추가
                window.kakao.maps.event.addListener(newMap, 'click', (mouseEvent: any) => {
                    const latlng = mouseEvent.latLng;

                    // 이전 마커 제거
                    if (window.currentMarker) {
                        window.currentMarker.setMap(null);
                    }

                    // 새로운 마커 생성
                    const marker = new window.kakao.maps.Marker({
                        map: newMap,
                        position: latlng,
                    });

                    window.currentMarker = marker;

                    // 클릭한 위치의 주소 가져오기
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
                        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                            const address = result[0].address;
                            const roadAddress = result[0].road_address;

                            let addressText = '';
                            let subAddressText = '';

                            if (roadAddress) {
                                addressText = roadAddress.address_name;
                                if (roadAddress.building_name) {
                                    subAddressText = `${roadAddress.building_name}`;
                                }
                                if (address.region_3depth_name) {
                                    subAddressText += subAddressText
                                        ? ` (${address.region_3depth_name})`
                                        : address.region_3depth_name;
                                }
                            } else {
                                addressText = address.address_name;
                                if (address.region_3depth_name) {
                                    subAddressText = address.region_3depth_name;
                                }
                            }

                            setCurrentAddress({
                                main: addressText,
                                sub: subAddressText,
                            });
                        } else {
                            setCurrentAddress({
                                main: '주소를 찾을 수 없습니다',
                                sub: '',
                            });
                        }
                    });
                });

                setMap(newMap);
                setIsMapLoading(false);
            } catch (err) {
                console.error('Error creating map:', err);
                setIsMapLoading(false);
            }
        };

        checkKakaoMapLoaded();

        return () => {
            setIsMapLoading(false);
        };
    }, [isContainerReady]);

    // 현재 위치로 이동하는 함수
    const moveToCurrentLocation = () => {
        if (!map || isLoading) return;

        setIsLoading(true);
        setCurrentAddress({
            main: '위치 정보를 가져오는 중...',
            sub: '',
        });

        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 30000,
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude);

                    Promise.all([
                        new Promise<void>((resolve) => {
                            map.setCenter(moveLatLng);
                            map.setLevel(2);

                            if (window.currentMarker) {
                                window.currentMarker.setMap(null);
                            }

                            const marker = new window.kakao.maps.Marker({
                                map: map,
                                position: moveLatLng,
                                title: '현재 위치',
                            });

                            window.currentMarker = marker;
                            resolve();
                        }),
                        // 주소 변환
                        new Promise<void>((resolve) => {
                            try {
                                if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
                                    throw new Error('카카오맵 서비스가 로드되지 않았습니다');
                                }

                                const geocoder = new window.kakao.maps.services.Geocoder();

                                geocoder.coord2Address(longitude, latitude, (result: any, status: any) => {
                                    if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                                        const address = result[0].address;
                                        const roadAddress = result[0].road_address;

                                        let addressText = '';
                                        let subAddressText = '';

                                        if (roadAddress) {
                                            addressText = roadAddress.address_name;
                                            if (roadAddress.building_name) {
                                                subAddressText = `${roadAddress.building_name}`;
                                            }
                                            if (address.region_3depth_name) {
                                                subAddressText += subAddressText
                                                    ? ` (${address.region_3depth_name})`
                                                    : address.region_3depth_name;
                                            }
                                        } else {
                                            addressText = address.address_name;
                                            if (address.region_3depth_name) {
                                                subAddressText = address.region_3depth_name;
                                            }
                                        }

                                        setCurrentAddress({
                                            main: addressText,
                                            sub: subAddressText,
                                        });
                                    } else {
                                        setCurrentAddress({
                                            main: '주소를 찾을 수 없습니다',
                                            sub: '',
                                        });
                                    }
                                    resolve();
                                });
                            } catch (error) {
                                console.error('주소 변환 중 오류 발생:', error);
                                setCurrentAddress({
                                    main: '주소 정보를 가져오는데 실패했습니다',
                                    sub: '잠시 후 다시 시도해주세요',
                                });
                                resolve();
                            }
                        }),
                    ]).finally(() => {
                        setIsLoading(false);
                    });
                },
                (error) => {
                    console.error('위치 정보를 가져오는데 실패했습니다:', error);
                    let errorMessage = '위치 정보를 가져오는데 실패했습니다';
                    let subMessage = '';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '위치 정보 접근이 거부되었습니다';
                            subMessage = '브라우저 설정에서 위치 정보 접근을 허용해주세요';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '위치 정보를 사용할 수 없습니다';
                            subMessage = '다시 시도해주세요';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '위치 정보 요청 시간이 초과되었습니다';
                            subMessage = '다시 시도해주세요';
                            break;
                    }

                    setCurrentAddress({
                        main: errorMessage,
                        sub: subMessage,
                    });
                    setIsLoading(false);
                },
                options
            );
        } else {
            setCurrentAddress({
                main: '이 브라우저에서는 위치 정보를 사용할 수 없습니다',
                sub: '다른 브라우저를 사용해주세요',
            });
            setIsLoading(false);
        }
    };

    if (isMapLoading) {
        return (
            <MapContainer ref={mapRef}>
                <LoadingMessage>지도를 불러오는 중입니다...</LoadingMessage>
            </MapContainer>
        );
    }

    return (
        <MapContainer ref={mapRef}>
            {currentAddress.main && (
                <AddressInfo>
                    <AddressLine>{currentAddress.main}</AddressLine>
                    {currentAddress.sub && <SubAddressLine>{currentAddress.sub}</SubAddressLine>}
                </AddressInfo>
            )}
            <CurrentLocationButton onClick={moveToCurrentLocation} isLoading={isLoading} title="현재 위치로 이동" />
        </MapContainer>
    );
};

// 타입 정의 추가
interface AddressInfo {
    main: string;
    sub: string;
}

export default Home;
