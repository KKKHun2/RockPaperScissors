import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faHandPaper, faHandScissors } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  text-align: center;
  padding: 5px;
  background-color: #dcdde1;
  height: screen;
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
  background-color: ${props => (props.active ? '#004799' : '#007BFF')};
  color: white;
  border-radius: 5px;
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

const App = () => {
  const [playerChoice, setPlayerChoice] = useState(''); 
  const [opponentChoice, setOpponentChoice] = useState(''); 
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
  const [isButtonActiveOpponent, setButtonActiveOpponent] = useState(false);

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
    const isConfirmed = window.confirm('게임 기록을 리셋하시겠습니까?');
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
    for (let i = 0; i < 5; i++) {
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
      <Title>가위바위보 게임</Title>
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
        <ChoiceButton onClick={restartGame}>기록 리셋하기</ChoiceButton>
      </ButtonContainer>
    </Container>
  );
};

export default App;
