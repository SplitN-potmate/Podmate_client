import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { getPodDetail, postPodJoin } from "../api/userApi";
import { PodDetail } from "../types/types";

const Container = styled.div`
  padding: 20px;
`;

const PodInfo = styled.div`
  margin-bottom: 24px;
`;

const PodName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2f3337;
`;

const PodDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const PodStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  flex: 1;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2f3337;
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #52d4e0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #33bbff;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  margin: 24px 0;
  padding: 0 16px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #27c3d8;
  }

  &::placeholder {
    color: #999;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

interface InputInfoProps {
  isError?: boolean;
}

const InputInfo = styled.div<InputInfoProps>`
  font-size: 12px;
  color: ${(props: InputInfoProps) => (props.isError ? "#ff4d4f" : "#666")};
  margin-top: 4px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 280px;
  text-align: center;
  animation: ${keyframes`
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  `} 0.3s ease-out;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2f3337;
  margin-bottom: 16px;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #52d4e0;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    background: #33bbff;
  }
`;

export default function PodJoinPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const podId = location.state?.podId;
  const [podDetail, setPodDetail] = useState<PodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodDetail = async () => {
      if (!podId) {
        navigate("/");
        return;
      }

      setIsLoading(true);
      const detail = await getPodDetail(podId);
      setPodDetail(detail);
      setIsLoading(false);
    };

    fetchPodDetail();
  }, [podId, navigate]);

  const getRemainingAmount = () => {
    if (!podDetail) return 0;
    return podDetail.goalAmount - podDetail.currentAmount;
  };

  const getRemainingQuantity = () => {
    if (!podDetail) return 0;
    return Math.floor(podDetail.goalAmount - podDetail.currentAmount);
  };

  const isExceedingGoal = () => {
    if (!podDetail) return false;
    if (pathname.startsWith("/pod/join/mini")) {
      return Number(amount) > getRemainingAmount();
    } else {
      return quantity > getRemainingAmount();
    }
  };

  const handleJoin = async () => {
    if (isExceedingGoal() || !podId) {
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      const res = await postPodJoin(podId, quantity);
      console.log(res);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to join pod:", err);
      setShowModal(true);
    } finally {
      setIsJoining(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numValue = Number(value);
      setQuantity(numValue);
      if (podDetail?.unitPrice) {
        const totalAmount = numValue * podDetail.unitPrice;
        setAmount(totalAmount.toString());
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
      if (podDetail?.unitPrice) {
        const calculatedQuantity = Math.floor(
          Number(value) / podDetail.unitPrice
        );
        setQuantity(calculatedQuantity);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header pageName="팟 참여하기" />
        <Container>
          <div>로딩 중...</div>
        </Container>
      </>
    );
  }

  if (!podDetail) {
    return (
      <>
        <Header pageName="팟 참여하기" />
        <Container>
          <div>팟 정보를 불러올 수 없습니다.</div>
        </Container>
      </>
    );
  }

  return pathname.startsWith("/pod/join/mini") ? (
    <>
      <Header pageName="팟 참여하기" />
      <Container>
        <PodInfo>
          <PodName>{podDetail.podName}</PodName>
          <PodDescription>{podDetail.podLeader.description}</PodDescription>
        </PodInfo>

        <InputContainer>
          <InputGroup>
            <InputLabel>참여 금액</InputLabel>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="참여하실 금액을 입력해주세요"
            />
            <InputInfo isError={isExceedingGoal()}>
              최소 주문 금액: {podDetail.unitPrice?.toLocaleString()}원
              {isExceedingGoal() && (
                <ErrorMessage>
                  목표 금액을 초과했습니다. 남은 금액:{" "}
                  {getRemainingAmount().toLocaleString()}원
                </ErrorMessage>
              )}
            </InputInfo>
          </InputGroup>
        </InputContainer>

        <JoinButton
          onClick={handleJoin}
          disabled={
            isExceedingGoal() || !amount || Number(amount) === 0 || isJoining
          }
        >
          {isJoining ? "참여 중..." : "참여 신청하기"}
        </JoinButton>
      </Container>
      {error && (
        <ErrorMessage style={{ textAlign: "center", marginTop: "16px" }}>
          {error}
        </ErrorMessage>
      )}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>신청이 완료되었습니다!</ModalTitle>
            <ModalButton onClick={handleModalClose}>확인</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  ) : (
    <>
      <Header pageName="팟 참여하기" />
      <Container>
        <PodInfo>
          <PodName>{podDetail.podName}</PodName>
          <PodDescription>{podDetail.podLeader.description}</PodDescription>
        </PodInfo>
        <ProgressBarContainer>
          <ProgressBar
            progress={
              ((podDetail.currentAmount ?? 1) / (podDetail.goalAmount ?? 1)) *
              100
            }
          />
        </ProgressBarContainer>
        <PodInfoLine isUpper={true}>
          <PodInfoText>{podDetail.platform}</PodInfoText>
          <PodAmount>
            <PodAmountText isGoal={false}>
              {podDetail.currentAmount.toLocaleString()}
            </PodAmountText>
            <PodAmountText isGoal={true}>
              /{podDetail.goalAmount.toLocaleString()}
            </PodAmountText>
          </PodAmount>
        </PodInfoLine>

        <InputContainer>
          <InputGroup>
            <InputLabel>참여 수량</InputLabel>
            <Input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="참여하실 수량을 입력해주세요"
            />
            <InputInfo isError={false}>
              묶음당 {podDetail.unitQuantity}개,{" "}
              {podDetail.unitPrice?.toLocaleString()}원
            </InputInfo>
          </InputGroup>
          {quantity !== 0 && (
            <>
              <InputInfo isError={false}>
                총 {quantity * podDetail.unitQuantity}개,{" "}
                {(quantity * podDetail.unitPrice).toLocaleString()}원 입니다.
              </InputInfo>
            </>
          )}
          <InputInfo isError={isExceedingGoal()}>
            {isExceedingGoal() && (
              <ErrorMessage>
                목표 수량을 초과했습니다. 남은 수량: {getRemainingQuantity()}개
              </ErrorMessage>
            )}
          </InputInfo>
        </InputContainer>

        <JoinButton
          onClick={handleJoin}
          disabled={isExceedingGoal() || quantity === 0 || isJoining}
        >
          {isJoining ? "참여 중..." : "참여 신청하기"}
        </JoinButton>
      </Container>
      {error && (
        <ErrorMessage style={{ textAlign: "center", marginTop: "16px" }}>
          {error}
        </ErrorMessage>
      )}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>신청이 완료되었습니다!</ModalTitle>
            <ModalButton onClick={handleModalClose}>확인</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

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
