import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { getPods, getUser } from "../../api/userApi";
import { PodProps, MapState, MapBounds } from "../../types/types";
import PodInfoCard from "../../components/PodInfoCard/PodInfoCard";
import PodListModal from "../../components/PodList/PodListModal";

// 마커 이미지 크기 및 옵션 수정
const MARKER_IMAGE_SIZE = new window.kakao.maps.Size(31, 41); // SVG 크기에 맞게 수정
const MARKER_IMAGE_OPTIONS = {
  offset: new window.kakao.maps.Point(15.5, 41), // 마커 이미지의 중심점 (가로 중앙, 세로 하단)
};

declare global {
  interface Window {
    kakao: any;
    currentMarker: any;
  }
}

const initialMapState: MapState = {
  map: null,
  isLoading: false,
  isMapLoading: true,
  isContainerReady: false,
  pods: [],
  currentAddress: {
    main: "",
    sub: "",
  },
  bounds: null,
  markers: [],
  selectedPod: null,
};

const Home = (): React.ReactElement => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<MapState>(initialMapState);
  const mapStateRef = useRef(mapState);
  mapStateRef.current = mapState;
  const [showPodList, setShowPodList] = useState(false);

  useEffect(() => {
    const user = getUser();
  });

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const newMap = new window.kakao.maps.Map(mapRef.current, options);
      const zoomControl = new window.kakao.maps.ZoomControl();
      newMap.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      setMapState((prev) => ({
        ...prev,
        map: newMap,
        isMapLoading: false,
      }));
    } catch (err) {
      console.error("Error creating map:", err);
      setMapState((prev) => ({
        ...prev,
        isMapLoading: false,
      }));
    }
  }, []);

  // 지도 바운드 가져오기
  const getMapBounds = useCallback((): MapBounds | null => {
    if (!mapState.map) return null;

    try {
      const bounds = mapState.map.getBounds();
      const swLat = bounds.getSouthWest().getLat();
      const swLng = bounds.getSouthWest().getLng();
      const neLat = bounds.getNorthEast().getLat();
      const neLng = bounds.getNorthEast().getLng();

      return { swLat, swLng, neLat, neLng };
    } catch (error) {
      console.error("Error getting map bounds:", error);
      return null;
    }
  }, [mapState.map]);

  // 마커 생성 및 표시 함수 수정
  const createPodMarkers = useCallback(
    (pods: PodProps[]) => {
      if (!mapState.map) return;

      // 기존 마커 제거
      mapState.markers.forEach((marker) => marker.setMap(null));

      // 마커 이미지 생성
      const markerImage = new window.kakao.maps.MarkerImage(
        MARKER_IMAGE_URL,
        MARKER_IMAGE_SIZE,
        MARKER_IMAGE_OPTIONS
      );

      const newMarkers = pods.map((pod) => {
        const position = new window.kakao.maps.LatLng(
          pod.latitude,
          pod.longitude
        );

        // 마커 생성 (커스텀 이미지 적용)
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: mapState.map,
          title: pod.podName,
          image: markerImage,
          zIndex: mapState.selectedPod?.podId === pod.podId ? 2 : 1,
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(
          marker,
          "click",
          (mouseEvent: any) => {
            // 이벤트 전파 중단
            if (mouseEvent && mouseEvent.domEvent) {
              mouseEvent.domEvent.stopPropagation();
            }

            // 모든 마커의 z-index를 1로 설정
            newMarkers.forEach((m) => m.setZIndex(1));
            // 클릭한 마커의 z-index를 2로 설정
            marker.setZIndex(2);

            // selectedPod 상태 업데이트
            setMapState((prev) => {
              // 이미 선택된 마커를 다시 클릭한 경우 선택 해제
              if (prev.selectedPod?.podId === pod.podId) {
                return {
                  ...prev,
                  selectedPod: null,
                };
              }
              // 새로운 마커 선택
              return {
                ...prev,
                selectedPod: pod,
              };
            });
          }
        );

        // 마커에 마우스오버 효과 추가
        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          // 선택되지 않은 마커만 z-index 변경
          if (mapState.selectedPod?.podId !== pod.podId) {
            marker.setZIndex(2);
          }
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          // 선택되지 않은 마커만 z-index 변경
          if (mapState.selectedPod?.podId !== pod.podId) {
            marker.setZIndex(1);
          }
        });

        return marker;
      });

      setMapState((prev) => ({
        ...prev,
        markers: newMarkers,
      }));
    },
    [mapState.map, mapState.selectedPod]
  );

  // Pod 데이터 가져오기 함수 수정
  const fetchPods = useCallback(
    async (bounds: MapBounds) => {
      try {
        const podsData: PodProps[] = await getPods({
          lat1: bounds.swLat,
          lat2: bounds.neLat,
          lng1: bounds.swLng,
          lng2: bounds.neLng,
        });

        if (podsData.length === 0) {
          console.log("No pods data received");
        }

        setMapState((prev) => ({
          ...prev,
          pods: podsData,
        }));

        // 마커 생성 및 표시
        createPodMarkers(podsData);
      } catch (error) {
        console.error("Error fetching pods:", error);
        setMapState((prev) => ({
          ...prev,
          pods: [],
          markers: [],
        }));
      }
    },
    [createPodMarkers]
  );

  // 지도 이벤트 핸들러 수정
  const handleMapEvents = useCallback(() => {
    if (!mapState.map) return;

    const bounds = getMapBounds();
    if (bounds) {
      setMapState((prev) => ({
        ...prev,
        bounds,
      }));
      fetchPods(bounds);
    }

    // 지도 클릭 이벤트 수정
    window.kakao.maps.event.addListener(
      mapState.map,
      "click",
      (mouseEvent: any) => {
        // 마커나 오버레이를 클릭한 경우 이벤트 무시
        if (
          mouseEvent &&
          mouseEvent.domEvent &&
          (mouseEvent.domEvent.target.closest(".kakao-marker") ||
            mouseEvent.domEvent.target.closest(".PodInfoOverlay"))
        ) {
          return;
        }

        setMapState((prev) => ({
          ...prev,
          selectedPod: null,
        }));
      }
    );

    // 지도 이동/줌 이벤트 추가
    window.kakao.maps.event.addListener(mapState.map, "dragend", () => {
      setMapState((prev) => ({
        ...prev,
        selectedPod: null,
      }));
    });

    window.kakao.maps.event.addListener(mapState.map, "zoom_changed", () => {
      setMapState((prev) => ({
        ...prev,
        selectedPod: null,
      }));
    });
  }, [mapState.map, getMapBounds, fetchPods]);

  // 현재 위치로 이동
  const moveToCurrentLocation = useCallback(async () => {
    if (!mapState.map || mapState.isLoading) return;

    setMapState((prev) => ({
      ...prev,
      isLoading: true,
      currentAddress: {
        main: "위치 정보를 가져오는 중...",
        sub: "",
      },
    }));

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 30000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude);

      // 지도 이동 및 마커 설정
      mapState.map.setCenter(moveLatLng);
      mapState.map.setLevel(2);

      if (window.currentMarker) {
        window.currentMarker.setMap(null);
      }

      const marker = new window.kakao.maps.Marker({
        map: mapState.map,
        position: moveLatLng,
        title: "현재 위치",
      });

      window.currentMarker = marker;

      // 주소 변환
      const geocoder = new window.kakao.maps.services.Geocoder();
      const result = await new Promise<any>((resolve, reject) => {
        geocoder.coord2Address(
          longitude,
          latitude,
          (result: any, status: any) => {
            if (
              status === window.kakao.maps.services.Status.OK &&
              result.length > 0
            ) {
              resolve(result[0]);
            } else {
              reject(new Error("주소를 찾을 수 없습니다"));
            }
          }
        );
      });

      const address = result.address;
      const roadAddress = result.road_address;

      let addressText = "";
      let subAddressText = "";

      if (roadAddress) {
        addressText = roadAddress.address_name;
        if (roadAddress.building_name) {
          subAddressText = roadAddress.building_name;
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

      setMapState((prev) => ({
        ...prev,
        currentAddress: {
          main: addressText,
          sub: subAddressText,
        },
      }));
    } catch (error) {
      console.error("Error getting location:", error);
      let errorMessage = "위치 정보를 가져오는데 실패했습니다";
      let subMessage = "";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다";
            subMessage = "브라우저 설정에서 위치 정보 접근을 허용해주세요";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다";
            subMessage = "다시 시도해주세요";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다";
            subMessage = "다시 시도해주세요";
            break;
        }
      }

      setMapState((prev) => ({
        ...prev,
        currentAddress: {
          main: errorMessage,
          sub: subMessage,
        },
      }));
    } finally {
      setMapState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [mapState.map, mapState.isLoading]);

  // 지도 컨테이너 마운트 체크
  useEffect(() => {
    if (mapRef.current) {
      setMapState((prev) => ({
        ...prev,
        isContainerReady: true,
      }));
    }
  }, []);

  // 카카오맵 초기화
  useEffect(() => {
    if (!mapState.isContainerReady) return;

    const checkKakaoMapLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
      } else {
        setTimeout(checkKakaoMapLoaded, 100);
      }
    };

    checkKakaoMapLoaded();
  }, [mapState.isContainerReady, initializeMap]);

  // 지도 이벤트 리스너 설정
  useEffect(() => {
    if (!mapState.map) return;

    window.kakao.maps.event.addListener(
      mapState.map,
      "dragend",
      handleMapEvents
    );
    window.kakao.maps.event.addListener(
      mapState.map,
      "zoom_changed",
      handleMapEvents
    );

    // 초기 바운드 정보 가져오기
    handleMapEvents();

    return () => {
      window.kakao.maps.event.removeListener(
        mapState.map,
        "dragend",
        handleMapEvents
      );
      window.kakao.maps.event.removeListener(
        mapState.map,
        "zoom_changed",
        handleMapEvents
      );
    };
  }, [mapState.map, handleMapEvents]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      if (mapState.markers.length > 0) {
        mapState.markers.forEach((marker) => marker.setMap(null));
      }
    };
  }, [mapState.markers]);

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    if (showPodList) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPodList]);

  if (mapState.isMapLoading) {
    return (
      <MapContainer ref={mapRef}>
        <LoadingMessage>지도를 불러오는 중입니다...</LoadingMessage>
      </MapContainer>
    );
  }

  return (
    <MapContainer
      ref={mapRef}
      onClick={(e) => {
        // PodInfoOverlay를 클릭한 경우 이벤트 전파 중단
        if (e.target === e.currentTarget) {
          setMapState((prev) => ({
            ...prev,
            selectedPod: null,
          }));
        }
      }}
    >
      {mapState.currentAddress.main && (
        <>
          <AddressInfo>
            <AddressLine>{mapState.currentAddress.main}</AddressLine>
            {mapState.currentAddress.sub && (
              <SubAddressLine>{mapState.currentAddress.sub}</SubAddressLine>
            )}
          </AddressInfo>
        </>
      )}
      {mapState.selectedPod && (
        <PodInfoCard type="modal" selectedPod={mapState.selectedPod} />
      )}
      {mapState.pods.length > 0 && (
        <PodsListButton
          onClick={() => {
            setMapState((prev) => ({
              ...prev,
              selectedPod: null,
            }));
            setShowPodList(true);
          }}
        >
          목록보기
        </PodsListButton>
      )}
      {showPodList && (
        <PodListModal
          pods={mapState.pods}
          onClose={() => setShowPodList(false)}
        />
      )}
      <CurrentLocationButton
        onClick={moveToCurrentLocation}
        isLoading={mapState.isLoading}
        title="현재 위치로 이동"
      />
    </MapContainer>
  );
};

export default Home;

const MapContainer = styled.div`
  width: 100%;
  height: 732px; //812-50-60
  position: relative;
  margin-top: 50px;
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

const PodsListButton = styled.button`
  box-sizing: border-box;
  z-index: 1;
  position: absolute;
  width: 200px;
  height: 40px;
  justify-self: anchor-center;
  bottom: 30px;

  background: #ffffff;
  border: 1px solid rgba(94, 106, 110, 0.12);
  border-radius: 12px;
`;

const CurrentLocationButton = styled.button<{ isLoading?: boolean }>`
  position: absolute;
  right: 20px;
  bottom: 20px;
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
    content: "";
    width: 20px;
    height: 20px;
    background-image: ${(props) =>
      props.isLoading
        ? "none"
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

// SVG 마커 이미지 URL
const MARKER_IMAGE_URL = `data:image/svg+xml,${encodeURIComponent(`<svg width="31" height="41" viewBox="0 0 31 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_392_753)">
<path d="M2.93534 8.629C3.00614 8.47223 3.08141 8.30557 3.16129 8.125C3.80541 6.66902 5.48387 4.75 5.48387 4.75C5.48387 4.75 7.56305 2.6659 9.25966 1.91345C10.9758 1.15231 12.3733 1 14 1C15.6267 1 17.0242 1.15231 18.7403 1.91345C20.4369 2.6659 22.5161 4.75 22.5161 4.75C22.5161 4.75 24.1946 6.66902 24.8387 8.125C24.9186 8.30557 24.9939 8.47223 25.0647 8.629C25.729 10.1001 26 10.7 26 13.75C26 16.7502 22.6106 24.3004 14 34C5.38941 24.3004 2 16.7502 2 13.75C2 10.7 2.27097 10.1001 2.93534 8.629Z" fill="url(#paint0_linear_392_753)" shape-rendering="crispEdges"/>
<path d="M2.93534 8.629C3.00614 8.47223 3.08141 8.30557 3.16129 8.125C3.80541 6.66902 5.48387 4.75 5.48387 4.75C5.48387 4.75 7.56305 2.6659 9.25966 1.91345C10.9758 1.15231 12.3733 1 14 1C15.6267 1 17.0242 1.15231 18.7403 1.91345C20.4369 2.6659 22.5161 4.75 22.5161 4.75C22.5161 4.75 24.1946 6.66902 24.8387 8.125C24.9186 8.30557 24.9939 8.47223 25.0647 8.629C25.729 10.1001 26 10.7 26 13.75C26 16.7502 22.6106 24.3004 14 34C5.38941 24.3004 2 16.7502 2 13.75C2 10.7 2.27097 10.1001 2.93534 8.629Z" stroke="#5E6A6E" stroke-opacity="0.12" stroke-width="0.75" shape-rendering="crispEdges"/>
</g>
<rect x="8.75" y="7" width="10.5" height="10.5" rx="5.25" fill="white"/>
<defs>
<filter id="filter0_d_392_753" x="0.125" y="0.625" width="30.75" height="39.9399" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1.5" dy="3"/>
<feGaussianBlur stdDeviation="1.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_392_753"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_392_753" result="shape"/>
</filter>
<linearGradient id="paint0_linear_392_753" x1="2" y1="17.5" x2="23.204" y2="25.1998" gradientUnits="userSpaceOnUse">
<stop stop-color="#52D4E0"/>
<stop offset="1" stop-color="#33BBFF"/>
</linearGradient>
</defs>
</svg>`)}`;
