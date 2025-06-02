import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { getPodDetail } from "../api/userApi";
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

export default function PodJoinPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const podId = location.state?.podId;
  const [podDetail, setPodDetail] = useState<PodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleJoin = () => {
    // TODO: Implement join request API
    alert("참여 신청이 완료된척! 아무일도 일어나지 않음.");
    navigate("/");
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

        {/* <PodStats>
          <StatItem>
            <StatLabel>현재 금액</StatLabel>
            <StatValue>{podDetail.currentAmount.toLocaleString()}원</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>목표 금액</StatLabel>
            <StatValue>{podDetail.goalAmount.toLocaleString()}원</StatValue>
          </StatItem>
        </PodStats> */}

        <JoinButton onClick={handleJoin}>참여 신청하기</JoinButton>
      </Container>
    </>
  ) : (
    <>
      <Header pageName="팟 참여하기" />
      <Container>
        <PodInfo>
          <PodName>{podDetail.podName}</PodName>
          <PodDescription>{podDetail.podLeader.description}</PodDescription>
        </PodInfo>

        {/* <PodStats>
          <StatItem>
            <StatLabel>현재 인원</StatLabel>
            <StatValue>{podDetail.currentAmount.toLocaleString()}원</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>목표 인원</StatLabel>
            <StatValue>{podDetail.goalAmount.toLocaleString()}원</StatValue>
          </StatItem>
        </PodStats> */}

        <JoinButton onClick={handleJoin}>참여 신청하기</JoinButton>
      </Container>
    </>
  );
}
