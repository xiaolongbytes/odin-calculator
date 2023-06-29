let characters = [];
let operator = [];
let inputsForDisplay = [];
let reversePolishNotation = [];
let runningResult = 0;

const NUMBERS = ["0", "1", "2", "3", '4', '5', "6", "7", "8", "9"];
const OPERATORS = ["+", "-", "*", "/"];
const DECIMALACCURACY = 6


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
    if (b == 0) {
        return "DIVIDEBYZERO"
    }
    return Math.round((Number(a)/Number(b) + Number.EPSILON) * 10**DECIMALACCURACY)/(10**DECIMALACCURACY);
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

function updateInputDisplay(list) {
    displayScreen = document.querySelector(`.input`);
    displayScreen.textContent = list.join("");
}

function updateResultDisplay(value) {
    displayScreen = document.querySelector(`.results`);
    displayScreen.textContent = value;
}

function clearAll() {
    characters = [];
    operator = [];
    inputsForDisplay = [];
    reversePolishNotation = [];
    runningResult = 0;
    updateInputDisplay([])
    updateResultDisplay("0")
}

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", (e) => {
    clearAll()
    console.log(characters, reversePolishNotation, operator);
})

const digitButtons = document.querySelectorAll(".digit");
digitButtons.forEach( (digitButton) => {
    digitButton.addEventListener("click", (e) => {
        digit = e.target.getAttribute("data-value")
        if (OPERATORS.includes(characters.toString())) {
            characters = [digit]
            inputsForDisplay.push(digit);
            updateInputDisplay(inputsForDisplay);
            console.log(characters, reversePolishNotation, operator);
        } else if (characters.length == 0 || NUMBERS.includes(characters[characters.length-1])) {
            characters.push(digit);
            inputsForDisplay.push(digit);
            updateInputDisplay(inputsForDisplay);
            console.log(characters, reversePolishNotation, operator);
        }

    })
})

const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach( (operatorButton) => {
    operatorButton.addEventListener("click", (e) => {
        symbol = e.target.getAttribute("data-value")
        if (characters.length === 0) {
            clearAll();
            updateResultDisplay("SYNTAX ERROR, HIT CLEAR");
        } else if (OPERATORS.includes(characters.toString())) {
            characters = [symbol];
            operator = [symbol];
            inputsForDisplay.splice(-1,1,` ${symbol} `)
            updateInputDisplay(inputsForDisplay)
        } else if (operator.length) {
            reversePolishNotation.push(characters.join(""));
            reversePolishNotation.push(...operator);
            characters = [symbol];
            operator = [symbol];
            inputsForDisplay.push(` ${symbol} `)
            updateInputDisplay(inputsForDisplay)
        } else {
            reversePolishNotation.push(characters.join(""));
            characters = [symbol]
            operator = [symbol]
            inputsForDisplay.push(` ${symbol} `)
            updateInputDisplay(inputsForDisplay)
        }
        console.log(characters, reversePolishNotation, operator);
    })
})

const equalButton = document.querySelector(".equal");
equalButton.addEventListener("click", (e) => {
    if (OPERATORS.includes(characters.toString())) {
        updateResultDisplay("Forgetting some numbers?")
        return
    }
    reversePolishNotation.push(characters.join(""));
    reversePolishNotation.push(...operator);
    console.log(characters, reversePolishNotation, operator);
    while (reversePolishNotation.length > 1) {
        [num1, num2, mathSymbol] = reversePolishNotation.splice(0,3)
        runningResult = operate(mathSymbol, num1, num2)
        if (runningResult == "DIVIDEBYZERO") {
            reversePolishNotation = ["STOP DIVIDING BY ZERO"];
            break
        }
        reversePolishNotation.unshift(runningResult)
    }
    updateResultDisplay(reversePolishNotation[0])
})
