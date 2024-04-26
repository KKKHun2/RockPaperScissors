import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background-color: #dcdde1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 10px 0px 20px 0px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ChoiceButton = styled.button`
  font-size: 1.5rem;
  padding: 10px 20px;
  border: none;
  background-color: ${props => (props.active ? '#004799' : '#007BFF')};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s; /* 호버 및 클릭 효과 부드럽게 적용 */

  &:hover {
    background-color: ${props => (props.active ? '#004799' : '#0056b3')}; /* 호버 시 배경색 변경 */
  }
`;

const ResultContainer = styled.div`
  margin: 10px 0;
`;

const Result = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 5px;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2rem;
  margin-right: 10px;
`;

const ProbabilitiesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const Probability = styled.div`
  font-size: 1.2rem;
  margin-right:20px;
`;

const PopupContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top:13rem;
  border-radius: 2rem;
  flex-direction: column;
  z-index: 100;
  align-items: center;
  width:30rem;
  height: 18rem;
  background-color:#778390;
  padding: 1.7rem;
`;
const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  height: 100%;
  width: 100%;
  align-items: center;
  padding-top: 5rem;
  background-color: #4698fd;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 500;
  color:white;
  gap:3rem;
`


const App = () => {
  const [playerChoice, setPlayerChoice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [openPopup,setOpenPopup] = useState(false);
  const [probabilitiesA, setProbabilitiesA] = useState({
    '가위': 33.33,
    '바위': 33.33,
    '보': 33.33,
  });
  const [probabilitiesB, setProbabilitiesB] = useState({
    '가위': 33.33,
    '바위': 33.33,
    '보': 33.33,
  });
  const [selectedOpponent, setSelectedOpponent] = useState('상대방A');
  const [result, setResult] = useState('');
  const [setButtonActiveOpponent] = useState(false);

  useEffect(() => {
    const savedProbabilities = localStorage.getItem(`probabilities_${selectedOpponent}`);
    if (savedProbabilities) {
      if (selectedOpponent === '상대방A') {
        setProbabilitiesA(JSON.parse(savedProbabilities));
      } else {
        setProbabilitiesB(JSON.parse(savedProbabilities));
      }
    }
  }, [selectedOpponent]);


  const normalizeProbabilities = (probs) => {
    const total = Object.values(probs).reduce((acc, val) => acc + val, 0);
    const normalizedProbs = {};
    for (const key in probs) {
      normalizedProbs[key] = (probs[key] / total) * 100;
    }
    return normalizedProbs;
  };

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
  };

  const handleOpponentChoice = (choice) => {
    setOpponentChoice(choice);
    setButtonActiveOpponent(true);
  };
  const recommendNextChoiceForUserA = () => {
    const selectedProbabilities = probabilitiesA;
    return recommendRandomChoices(selectedProbabilities);
  };

  const recommendNextChoiceForUserB = () => {
    const selectedProbabilities = probabilitiesB;
    return recommendRandomChoices(selectedProbabilities);
  };

  const calculateResult = () => {
    if (!playerChoice || !opponentChoice) {
      alert('플레이어와 상대방 둘 다 선택해주세요.');
      return;
    }

    const selectedProbabilities = selectedOpponent === '상대방A' ? probabilitiesA : probabilitiesB;
    const newProbabilities = { ...selectedProbabilities };
    newProbabilities[opponentChoice]++;
    const normalizedProbabilities = normalizeProbabilities(newProbabilities);

    if (selectedOpponent === '상대방A') {
      setProbabilitiesA(normalizedProbabilities);
    } else {
      setProbabilitiesB(normalizedProbabilities);
    }

    localStorage.setItem(`probabilities_${selectedOpponent}`, JSON.stringify(normalizedProbabilities));

    const winner = calculateWinner(playerChoice, opponentChoice);
    setResult(winner);
  };

  const tips = [
    "가위바위보는 1:1:1 비율로 이길 확률이 동일합니다.",
    "가위바위보에서 이길 확률을 높이려면 상대방의 패턴을 읽는 것이 중요합니다.",
    "가위바위보에서 연속으로 같은 손을 내는 것은 좋지 않은 전략입니다.",
    "무엇보다도 가위바위보는 운빨이 많이 개입되는 게임입니다.",
    "가위바위보에서 이기려면 상대방의 행동을 예측하는 것이 중요합니다.",
    "상대방의 특정 패턴을 파악하면 이길 확률을 높일 수 있습니다.",
    "가위바위보는 심리전이 중요한 게임입니다.",
    "이길 확률을 높이려면 상대방의 습관을 파악하세요.",
    "가위바위보에서 이길 확률을 높이려면 다양한 전략을 사용하세요.",
    "이길 확률을 높이려면 가위바위보 전략을 연구해보세요.",
    "상대방이 자주내는 가위바위보를 입력하고 여러번 게임하게 되면 승률이 오릅니다"
  ];

  // 랜덤한 팁을 선택하는 함수
  function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }

  useEffect(() => {
    setOpenPopup(true);
  }, []);

  const calculateWinner = (player, opponent) => {
    if (player === opponent) {
      return '무승부';
    } else if (
      (player === '가위' && opponent === '보') ||
      (player === '바위' && opponent === '가위') ||
      (player === '보' && opponent === '바위')
    ) {
      return '플레이어 승리';
    } else {
      return '상대방 승리';
    }
  };

  const restartGame = () => {
    const isConfirmed = window.confirm('게임 기록 및 확률이 전체 리셋 됩니다. 리셋하시겠습니까?');
    if (isConfirmed) {
      setPlayerChoice('');
      setOpponentChoice('');
      setResult('');
      localStorage.removeItem(`probabilities_${selectedOpponent}`);
      setButtonActiveOpponent(false);
      window.location.reload();
    }
  };

  const handleRecommendation = () => {
    const YouChoice = selectedOpponent === '상대방A' ? recommendNextChoiceForUserA() : recommendNextChoiceForUserB()
    alert(`추천하는 상대방의 다음 선택: ${YouChoice}`);
  };

  const recommendRandomChoices = (probabilities) => {
    const choices = [];
    for (const choice in probabilities) {
      const probability = probabilities[choice];
      const numRecommendations = Math.floor(probability);
      for (let i = 0; i < numRecommendations; i++) {
        choices.push(choice);
      }
    }
    const selectedChoices = [];
    for (let i = 0; i <= 20; i++) {
      const randomIndex = Math.floor(Math.random() * choices.length);
      selectedChoices.push(choices[randomIndex]);
    }
    const counts = {};
    selectedChoices.forEach((choice) => {
      counts[choice] = (counts[choice] || 0) + 1;
    });
    let recommendedChoice = '';
    let maxCount = 0;
    for (const choice in counts) {
      if (counts[choice] > maxCount) {
        maxCount = counts[choice];
        recommendedChoice = choice;
      }
    }
    return recommendedChoice;
  };


  return (
    <Container>
      <Title>가위 주먹 보</Title>
      <h2>플레이어 선택: {playerChoice}</h2>
      <ButtonContainer>
        <ChoiceButton
          onClick={() => handlePlayerChoice('가위')}
        >
          <Icon icon={faHandScissors} /> 가위
        </ChoiceButton>
        <ChoiceButton
          onClick={() => handlePlayerChoice('바위')}
        >
          <Icon icon={faHandRock} /> 바위
        </ChoiceButton>
        <ChoiceButton
          onClick={() => handlePlayerChoice('보')}
        >
          <Icon icon={faHandPaper} /> 보
        </ChoiceButton>
      </ButtonContainer>
      <div>
        <h2>상대방 선택: {opponentChoice}</h2>
        <ButtonContainer>
          <ChoiceButton
            onClick={() => handleOpponentChoice('가위')}
          >
            <Icon icon={faHandScissors} /> 가위
          </ChoiceButton>
          <ChoiceButton
            onClick={() => handleOpponentChoice('바위')}
          >
            <Icon icon={faHandRock} /> 바위
          </ChoiceButton>
          <ChoiceButton
            onClick={() => handleOpponentChoice('보')}
          >
            <Icon icon={faHandPaper} /> 보
          </ChoiceButton>
        </ButtonContainer>
        <ButtonContainer>
          <ChoiceButton onClick={calculateResult}>계산하기</ChoiceButton>
          <ChoiceButton onClick={handleRecommendation}>추천하기</ChoiceButton>
        </ButtonContainer>
        <ResultContainer>
          <Result>{result}</Result>
        </ResultContainer>
      </div>
      <ProbabilitiesContainer>
        <div>
          <h3>{selectedOpponent}의 다음 선택은?</h3>
          <ul>
            {Object.entries(
              selectedOpponent === '상대방A' ? probabilitiesA : probabilitiesB
            ).map(([choice, probability]) => (
              <Probability key={choice}>
                {choice}: {probability.toFixed(2)}%
              </Probability>
            ))}
          </ul>
        </div>
      </ProbabilitiesContainer>
      <ButtonContainer>
        <ChoiceButton
          active={selectedOpponent === '상대방A'}
          onClick={() => setSelectedOpponent('상대방A')}
        >
          상대방A
        </ChoiceButton>
        <ChoiceButton
          active={selectedOpponent === '상대방B'}
          onClick={() => setSelectedOpponent('상대방B')}
        >
          상대방B
        </ChoiceButton>
      </ButtonContainer>
      <ButtonContainer>
        <ChoiceButton onClick={restartGame}>기록 리셋</ChoiceButton>
      </ButtonContainer>
      {openPopup &&
      <PopupContainer>
      <PopupContent>
        <div>
        {getRandomTip()}
       </div>
       <ChoiceButton
          onClick={() => setOpenPopup(!openPopup)}
        >
          확인
        </ChoiceButton>
      </PopupContent>
    </PopupContainer>
      }


    </Container>
  );
};

export default App;
