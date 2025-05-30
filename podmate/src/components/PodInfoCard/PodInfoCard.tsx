import styled, { keyframes } from "styled-components";
import { PodProps, PodDetail } from "../../types/types";
import HeartShape from "../HeartShape";
import { useState, useEffect } from "react";
import { postJjim, getPodDetail } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

interface PodInfoCardProps {
  selectedPod: PodProps;
  type: "list" | "modal";
}

const PodInfoCard = ({ selectedPod, type }: PodInfoCardProps) => {
  const navigate = useNavigate();
  const [isJjim, setIsJjim] = useState(selectedPod.jjim);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [podDetail, setPodDetail] = useState<PodDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchPodDetail = async () => {
      if (isExpanded && selectedPod.podId && !podDetail) {
        setIsLoadingDetail(true);
        const detail = await getPodDetail(selectedPod.podId);
        setPodDetail(detail);
        setIsLoadingDetail(false);
      }
    };

    fetchPodDetail();
  }, [isExpanded, selectedPod.podId]);

  const handleJjimClick = async () => {
    if (loading || !selectedPod.podId) return;
    setLoading(true);
    try {
      // const response = await postJjim(selectedPod.podId);
      // if (response?.isSuccess) {
      //   setIsJjim(!isJjim);
      // } else {
      //   console.error(
      //     "Failed to toggle jjim:",
      //     response?.message || "Unknown error"
      //   );
      // }
    } catch (error) {
      console.error("Failed to toggle jjim:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    if (selectedPod.podId) {
      if (selectedPod.podType === "MINIMUM") {
        navigate("/pod/join/mini", {
          state: { podId: selectedPod.podId },
        });
      } else {
        navigate("/pod/join/group", {
          state: { podId: selectedPod.podId },
        });
      }
    }
  };

  return (
    <PodInfoOverlay type={type} onClick={(e) => e.stopPropagation()}>
      <PodInfoContent>
        <PodInfoLine isUpper={false}>
          <PodTextWrapper>
            <PodCardH3Text isNickname={false}>
              {selectedPod.podName}
            </PodCardH3Text>
            <PodInfoText>
              {selectedPod.podType === "MINIMUM" ? "최소주문" : "공동구매"}
            </PodInfoText>
          </PodTextWrapper>
          <div onClick={handleJjimClick} style={{ cursor: "pointer" }}>
            <HeartShape isOn={isJjim} loading={loading} />
          </div>
        </PodInfoLine>

        <ProgressBarContainer>
          <ProgressBar
            progress={
              ((selectedPod.currentAmount ?? 1) /
                (selectedPod.goalAmount ?? 1)) *
              100
            }
          />
        </ProgressBarContainer>
        <PodInfoLine isUpper={true}>
          <PodInfoText>{selectedPod.platform}</PodInfoText>
          <PodAmount>
            <PodAmountText isGoal={false}>
              {selectedPod.currentAmount.toLocaleString()}
            </PodAmountText>
            <PodAmountText isGoal={true}>
              /{selectedPod.goalAmount.toLocaleString()}
            </PodAmountText>
          </PodAmount>
        </PodInfoLine>
        <PodInfoText>
          {selectedPod.roadAddress || selectedPod.road_address}
        </PodInfoText>
      </PodInfoContent>

      <ExpandedContent isExpanded={isExpanded}>
        {isLoadingDetail ? (
          <InfoRow>
            <InfoValue>정보를 불러오는 중...</InfoValue>
          </InfoRow>
        ) : podDetail ? (
          <>
            <PodTextWrapper>
              <ProfileImage
                src={podDetail.podLeader.profileImageUrl}
                alt="프로필 이미지"
              />
              <PodCardH3Text isNickname={true}>
                {podDetail.podLeader.nickname}
              </PodCardH3Text>
            </PodTextWrapper>
            <PodInfoText>{podDetail.podLeader.description}</PodInfoText>
          </>
        ) : (
          <InfoRow>
            <InfoValue>정보를 불러올 수 없습니다.</InfoValue>
          </InfoRow>
        )}
        <PodInfoLine isUpper={true}>
          <div></div>
          <PodJoinButton onClick={handleJoinClick}>
            참여하기
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2.5L9.5 6M9.5 6L6 9.5M9.5 6L2.5 6"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PodJoinButton>
        </PodInfoLine>
      </ExpandedContent>

      <ExpendButton
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="#919DA1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isExpanded ? "접기" : "펼치기"}
      </ExpendButton>
    </PodInfoOverlay>
  );
};

export default PodInfoCard;

const PodInfoOverlay = styled.div<{ type: "list" | "modal" }>`
  box-sizing: border-box;
  z-index: 10;
  position: ${(props) => (props.type === "modal" ? "absolute" : "relative")};
  width: 335px;
  ${(props) => (props.type === "modal" ? "left: 20px;" : "")}
  ${(props) => (props.type === "modal" ? "top: 62px;" : "")}
  background: #ffffff;
  border: 1px solid rgba(94, 106, 110, 0.12);
  border-radius: 12px;
  cursor: default;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PodInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PodInfoLine = styled.div<{ isUpper?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: ${(props) => (props.isUpper ? "flex-start" : "flex-end")};
  justify-content: space-between;
`;

const PodTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 3px;
`;
const PodCardH3Text = styled.h3<{ isNickname?: boolean }>`
  height: ${(props) => (props.isNickname ? "17px" : "19px")};
  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => (props.isNickname ? "14px" : "16px")};
  line-height: 120%;
  letter-spacing: -0.02em;

  color: #2f3337;

  /* Inside auto layout */
  flex: none;
  flex-grow: 0;
  margin: 0;
`;
const PodInfoText = styled.div`
  font-size: 12px;
  color: #888;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #e3e7e8;
  border-radius: 1000px;
  overflow: hidden;
`;

const PodAmount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
  right: 0;
  bottom: -20px;
`;

const ExpendButton = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 0;
  margin-top: 8px;
  border-top: 1px solid rgba(94, 106, 110, 0.12);

  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.02em;
  color: #919da1;

  svg {
    transform: rotate(${(props) => (props.isExpanded ? "180deg" : "0deg")});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #33bbff;
    svg path {
      stroke: #33bbff;
    }
  }
`;

const PodAmountText = styled.div<{ isGoal?: boolean }>`
  width: ${(props) => (props.isGoal ? "fit-content" : "")};
  height: ${(props) => (props.isGoal ? "12px" : "24px")};

  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: ${(props) => (props.isGoal ? "400" : "600")};
  font-size: ${(props) => (props.isGoal ? "10px" : "16px")};
  line-height: 120%;
  /* identical to box height, or 24px */
  text-align: right;
  letter-spacing: -0.02em;

  color: ${(props) => (props.isGoal ? "#919DA1" : "#33bbff")};

  /* Inside auto layout */
  flex: none;

  flex-grow: 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${(props) => `${Math.min(props.progress, 100)}%`};
  height: 100%;
  background: linear-gradient(90deg, #52d4e0 0%, #33bbff 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const expandAnimation = keyframes`
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
`;

const ExpandedContent = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  animation: ${(props) =>
      props.isExpanded ? expandAnimation : collapseAnimation}
    0.3s ease-in-out;
  max-height: ${(props) => (props.isExpanded ? "500px" : "0")};
  opacity: ${(props) => (props.isExpanded ? 1 : 0)};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #2f3337;
`;

const InfoValue = styled.span`
  font-weight: 500;
`;

const PodJoinButton = styled.button`
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 8px 10px;
  gap: 5px;

  width: 90px;
  height: 30px;

  /* Instance/btn */
  background: #52d4e0;
  border: 1px solid rgba(94, 106, 110, 0.08);
  border-radius: 4px;
  /* 팟 참여하기 */

  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 120%;

  text-align: center;
  letter-spacing: -0.02em;

  color: #ffffff;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 1500px;
  object-fit: cover;
  margin-right: 8px;
`;
