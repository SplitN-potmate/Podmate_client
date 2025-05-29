import styled from "styled-components";
import { MapState } from "../../types/types";

const PodInfoOverlay = styled.div`
  box-sizing: border-box;
  z-index: 1000;
  position: absolute;
  width: 335px;
  left: 20px;
  top: 62px;
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

const PodName = styled.h3`
  width: 130px;
  height: 19px;

  font-family: "Wanted Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 120%;
  letter-spacing: -0.02em;

  /* Instance/main */
  color: #2f3337;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0;
`;

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
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

const PodAmountText = styled.div<{ isGoal?: boolean }>`
  width: ${(props) => (props.isGoal ? "fit-content" : "13px")};
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
  order: 0;
  flex-grow: 0;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${(props) => `${Math.min(props.progress, 100)}%`};
  height: 100%;
  background: linear-gradient(90deg, #52d4e0 0%, #33bbff 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const PodAddress = styled.div`
  font-size: 12px;
  color: #888;
`;

const PodInfoCard = (mapState: MapState) => {
  return (
    <PodInfoOverlay onClick={(e) => e.stopPropagation()}>
      <PodInfoContent>
        <PodName>{mapState.selectedPod?.podName}</PodName>
        <ProgressContainer>
          <ProgressBarContainer>
            <ProgressBar
              progress={
                ((mapState.selectedPod?.currentAmount ?? 1) /
                  (mapState.selectedPod?.goalAmount ?? 1)) *
                100
              }
            />
          </ProgressBarContainer>
          <PodAmount>
            <PodAmountText isGoal={false}>
              {mapState.selectedPod?.currentAmount.toLocaleString()}
            </PodAmountText>
            <PodAmountText isGoal={true}>
              /{mapState.selectedPod?.goalAmount.toLocaleString()}
            </PodAmountText>
          </PodAmount>
        </ProgressContainer>
        <PodAddress>
          {mapState.selectedPod?.roadAddress ||
            mapState.selectedPod?.road_address}
        </PodAddress>
      </PodInfoContent>
    </PodInfoOverlay>
  );
};

export default PodInfoCard;
