import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  text-align: center;
  padding: 5px;
  background-color: #dcdde1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
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
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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
`;

const App = () => {
  const [playerChoice, setPlayerChoice] = useState(''); // 플레이어 선택
  const [opponentChoice, setOpponentChoice] = useState(''); // 상대방 선택
  const [probabilitiesA, setProbabilitiesA] = useState({
    '가위': 33.33,
    '바위': 33.33,
    '보': 33.33,
  }); // 사용자 A의 초기 확률
  const [probabilitiesB, setProbabilitiesB] = useState({
    '가위': 33.33,
    '바위': 33.33,
    '보': 33.33,
  }); // 사용자 B의 초기 확률
  const [selectedOpponent, setSelectedOpponent] = useState('상대방A'); // 초기 상대방 선택
  const [result, setResult] = useState(''); // 결과 저장

  // 선택한 상대방에 대한 확률을 로컬 스토리지에서 불러옵니다.
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

  // 확률을 정규화하여 합이 100%가 되도록 업데이트
  const normalizeProbabilities = (probs) => {
    const total = Object.values(probs).reduce((acc, val) => acc + val, 0);
    const normalizedProbs = {};
    for (const key in probs) {
      normalizedProbs[key] = (probs[key] / total) * 100;
    }
    return normalizedProbs;
  };

  // 사용자가 플레이어 선택한 경우
  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
  };

  // 사용자가 상대방 선택한 경우
  const handleOpponentChoice = (choice) => {
    setOpponentChoice(choice);
  };

  // 결과 계산 함수
  const calculateResult = () => {
    if (!playerChoice || !opponentChoice) {
      alert('플레이어와 상대방 둘 다 선택해주세요.');
      return;
    }

    // 선택한 상대방에 따라 확률 업데이트
    const selectedProbabilities = selectedOpponent === '상대방A' ? probabilitiesA : probabilitiesB;
    const newProbabilities = { ...selectedProbabilities };
    newProbabilities[opponentChoice]++;
    const normalizedProbabilities = normalizeProbabilities(newProbabilities);

    if (selectedOpponent === '상대방A') {
      setProbabilitiesA(normalizedProbabilities);
    } else {
      setProbabilitiesB(normalizedProbabilities);
    }

    // 로컬 스토리지에 확률 저장
    localStorage.setItem(`probabilities_${selectedOpponent}`, JSON.stringify(normalizedProbabilities));

    const winner = calculateWinner(playerChoice, opponentChoice);
    setResult(winner);
  };

  // 승패 계산 함수
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

  // 다시하기 함수
  const restartGame = () => {
    setPlayerChoice('');
    setOpponentChoice('');
    setResult('');
  };

  return (
    <Container>
      <Title>가위바위보 게임</Title>
      <h2>플레이어 선택: {playerChoice}</h2>
      <ButtonContainer>
        <ChoiceButton onClick={() => handlePlayerChoice('가위')}>
          <Icon icon={faHandScissors} /> 가위
        </ChoiceButton>
        <ChoiceButton onClick={() => handlePlayerChoice('바위')}>
          <Icon icon={faHandRock} /> 바위
        </ChoiceButton>
        <ChoiceButton onClick={() => handlePlayerChoice('보')}>
          <Icon icon={faHandPaper} /> 보
        </ChoiceButton>
      </ButtonContainer>
      <div>
        <h2>상대방 선택: {opponentChoice}</h2>
        <ButtonContainer>
          <ChoiceButton onClick={() => handleOpponentChoice('가위')}>
            <Icon icon={faHandScissors} /> 가위
          </ChoiceButton>
          <ChoiceButton onClick={() => handleOpponentChoice('바위')}>
            <Icon icon={faHandRock} /> 바위
          </ChoiceButton>
          <ChoiceButton onClick={() => handleOpponentChoice('보')}>
            <Icon icon={faHandPaper} /> 보
          </ChoiceButton>
        </ButtonContainer>
        <ButtonContainer>
          <ChoiceButton onClick={calculateResult}>계산하기</ChoiceButton>
        </ButtonContainer>
        <ResultContainer>
          <Result>{result}</Result>
        </ResultContainer>
      </div>
      <ProbabilitiesContainer>
        <div>
          <h3>{selectedOpponent}의 다음 선택 확률</h3>
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
        <ChoiceButton onClick={() => setSelectedOpponent('상대방A')}>상대방A</ChoiceButton>
        <ChoiceButton onClick={() => setSelectedOpponent('상대방B')}>상대방B</ChoiceButton>
      </ButtonContainer>
      <ButtonContainer>
        <ChoiceButton onClick={restartGame}>다시하기</ChoiceButton>
      </ButtonContainer>
    </Container>
  );
};

export default App;
