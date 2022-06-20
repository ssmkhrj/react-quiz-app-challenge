export function getRandom(array) {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
}

export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculateResult(firstOperand, secondOperand, operator) {
  const operatorsMap = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => a / b,
  };
  return operatorsMap[operator](firstOperand, secondOperand);
}

export function generateQuestion(minNumber, maxNumber, operators) {
  const operator = getRandom(operators);
  let firstOperand, secondOperand;
  if (operator === "÷") {
    /*
      Logic:
      Denominator: [minNumber, maxNumber]
      Numerator: Denominator * [1, maxNumber // Denominator]
    */
    secondOperand = getRandomInteger(
      minNumber + (minNumber === 0 ? 1 : 0),
      maxNumber
    );
    firstOperand =
      secondOperand *
      getRandomInteger(1, Math.floor(maxNumber / secondOperand));
  } else {
    firstOperand = getRandomInteger(minNumber, maxNumber);
    secondOperand = getRandomInteger(minNumber, maxNumber);
  }
  return {
    question: `${firstOperand} ${operator} ${secondOperand}`,
    answer: calculateResult(firstOperand, secondOperand, operator),
  };
}
