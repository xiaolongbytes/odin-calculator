// Initializing data structures for storing data
let buffer = [];
let currentlyHeldOperator = null;
let inputsForDisplay = [];
let reversePolishNotation = [];
let runningResult = 0;

// Constants
const NUMBERS = ["0", "1", "2", "3", '4', '5', "6", "7", "8", "9"];
const OPERATORS = ["+", "-", "*", "/"];
const DECIMAL_ACCURACY = 6;
const INITIAL_RESULT_DISPLAY_VALUE = "";
const DIVIDE_BY_ZERO_ERROR = "DIVIDEBYZERO"
const DIVIDE_BY_ZERO_MESSAGE = "STOP DIVIDING BY ZERO"
const SYNTAX_ERROR_MESSAGE = "SYNTAX ERROR, HIT CLEAR"
const MISSING_NUMBERS_MESSAGE = "Forgetting some numbers?"
const FINISHED_CALCULATION = "finished"


function add(a, b) {
    return Number(a) + Number(b);
}

function subtract(a, b) {
    return Number(a) - Number(b);
}

function multiply(a, b) {
    return Number(a) * Number(b);
}

function divide(a, b) {
    if (b === "0") {
        return DIVIDE_BY_ZERO_ERROR
    }
    // In order to round to a given decimal accuracy
    // Number.Epsilon is to ensure correct rounding per https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    return Math.round((Number(a)/Number(b) + Number.EPSILON) * 10**DECIMAL_ACCURACY)/(10**DECIMAL_ACCURACY);
}

function operate(symbol, a, b) {
    switch (symbol) {
        case "+":
            return add(a,b);
        case "-":
            return subtract(a,b);
        case "*":
            return multiply(a,b);
        case "/":
            return divide(a,b);
    }
}

function calculateFromReversePolishNotation(rpn) {
    workingRPN = [...rpn]
    while (workingRPN.length > 1) {
        [num1, num2, mathSymbol] = workingRPN.splice(0,3)
        runningResult = operate(mathSymbol, num1, num2)
        if (runningResult == DIVIDE_BY_ZERO_ERROR) {
            return DIVIDE_BY_ZERO_MESSAGE
            
        }
        workingRPN.unshift(runningResult)
    }
    return runningResult;
}

function updateInputDisplay(list) {
    const displayScreen = document.querySelector(`.input`);
    displayScreen.textContent = list.join("");
}

function addToInputDisplay(character, list) {
    list.push(character);
    updateInputDisplay(list);
}

function updateResultDisplay(value) {
    const displayScreen = document.querySelector(`.results`);
    displayScreen.textContent = value;
}

function clearAll() {
    buffer = [];
    currentlyHeldOperator = null;
    inputsForDisplay = [];
    reversePolishNotation = [];
    runningResult = 0;
    updateInputDisplay([])
    updateResultDisplay(INITIAL_RESULT_DISPLAY_VALUE)
}

function doesArrayContainOperator(array) {
    const [possibleOperator] = array;
    return OPERATORS.includes(possibleOperator);
}

// After calculation is done, clicking on another button will clear the previous information and also the display
const buttons = document.querySelectorAll("button");
buttons.forEach( (button) => {
    button.addEventListener("click", (e) => {
        if (currentlyHeldOperator === FINISHED_CALCULATION) {
            clearAll()
        }
    })
})

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", (e) => {
    clearAll();
})

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach( (digitButton) => {
    digitButton.addEventListener("click", (e) => {
        const digit = e.target.getAttribute("data-value")
        if (doesArrayContainOperator(buffer)) {
            buffer = [digit]
            addToInputDisplay(digit, inputsForDisplay);
        } else if (buffer.length == 0 || NUMBERS.includes(buffer[buffer.length-1])) {
            buffer.push(digit);
            addToInputDisplay(digit, inputsForDisplay);
        }

    })
})

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach( (operatorButton) => {
    operatorButton.addEventListener("click", (e) => {
        const symbol = e.target.getAttribute("data-value")
        if (buffer.length === 0) {
            // If no numbers were chosen before hitting operator button, display syntax error
            clearAll();
            updateResultDisplay(SYNTAX_ERROR_MESSAGE);
        } else if (doesArrayContainOperator(buffer)) {
            // If "characters" includes an operator, update chosen operator
            buffer = [symbol];
            currentlyHeldOperator = symbol;
            inputsForDisplay.splice(-1,1,` ${symbol} `)
            updateInputDisplay(inputsForDisplay)
        } else if (currentlyHeldOperator) {
            // For the nth operator selection (when there is an operator in the currentlyHeldOperator)
            reversePolishNotation.push(buffer.join(""));
            reversePolishNotation.push(currentlyHeldOperator);
            buffer = [symbol];
            currentlyHeldOperator = symbol;
            addToInputDisplay(` ${symbol} `, inputsForDisplay);
        } else {
            // The first operator selection (aka when currentlyHeldOperator = null)
            reversePolishNotation.push(buffer.join(""));
            buffer = [symbol];
            currentlyHeldOperator = symbol;
            addToInputDisplay(` ${symbol} `, inputsForDisplay);
        }
    })
})

const equalButton = document.querySelector(".equal");
equalButton.addEventListener("click", (e) => {
    if (doesArrayContainOperator(buffer)) {
        updateResultDisplay(MISSING_NUMBERS_MESSAGE)
        return
    }
    reversePolishNotation.push(buffer.join(""));
    reversePolishNotation.push(currentlyHeldOperator);
    // Signals that calculation is finished so next keystroke after "=" starts new calculation
    currentlyHeldOperator = FINISHED_CALCULATION;
    const output = calculateFromReversePolishNotation(reversePolishNotation)
    updateResultDisplay(output)
})

// Initializes calculator result display
document.querySelector(`.results`).textContent = INITIAL_RESULT_DISPLAY_VALUE