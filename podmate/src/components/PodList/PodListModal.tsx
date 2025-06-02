import styled, { keyframes } from "styled-components";
import { PodProps } from "../../types/types";
import PodInfoCard from "../PodInfoCard/PodInfoCard";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  width: 100%;
  height: 80%;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3337;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const PodListContainer = styled.div`
  flex: 1;
  padding: 20px 0px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: calc(
    20px + env(safe-area-inset-bottom)
  ); /* iOS 하단 네비바 높이 고려 */

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;

const PodCardWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface PodListModalProps {
  pods: PodProps[];
  onClose: () => void;
}

export default function PodListModal({ pods, onClose }: PodListModalProps) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>팟 목록</HeaderTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <PodListContainer>
          {pods.map((pod) => (
            <PodCardWrapper key={pod.podId}>
              <PodInfoCard selectedPod={pod} type={"list"} />
            </PodCardWrapper>
          ))}
        </PodListContainer>
      </ModalContainer>
    </ModalOverlay>
  );
}
