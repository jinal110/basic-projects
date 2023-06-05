document.addEventListener("paste", function(event) {
  const element = event.target;

  if (element.tagName === "INPUT" && element.type === "text") {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text/plain").trim();

    if (!/^[0-9+\-*/%.]+$/.test(pastedText)) {
      event.preventDefault();
    } else {
      const currentValue = element.value;
      const selectionStart = element.selectionStart;
      const selectionEnd = element.selectionEnd;

      const newValue =
        currentValue.substring(0, selectionStart) +
        pastedText +
        currentValue.substring(selectionEnd);

      element.value = newValue;
      element.setSelectionRange(
        selectionStart + pastedText.length,
        selectionStart + pastedText.length
      );

      event.preventDefault();
    }
  }
});

function display(value) {
  const isNumber = /^\d+$/.test(value);
  const showcase = document.getElementById("showcase");
  const lastChar = showcase.value.slice(-1);

  if (isNumber) {
    showcase.value += value;
  } else if (value === '+' || value === '-' || value === '*' || value === '/' || value === '%') {
    if (lastChar !== ' ' && lastChar !== '') {
      showcase.value += ' ' + value + ' ';
    }
  } else if (value === '+/-') {
    const expression = showcase.value.trim();
    const tokens = expression.split(' ');
    let foundNumber = false;

    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];

      if (/^-?\d/.test(token)) {
        if (token.startsWith('-')) {
          tokens[i] = token.substring(1);
        } else {
          tokens[i] = '-' + token;
        }
        foundNumber = true;
        break;
      }
    }

    if (!foundNumber) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (/^-?\d/.test(token)) {
          if (token.startsWith('-')) {
            tokens[i] = token.substring(1);
          } else {
            tokens[i] = '-' + token;
          }
          break;
        }
      }
    }

    showcase.value = tokens.join(' ');
  } else if (value === '.' || value === 'Decimal') {
    const expression = showcase.value.trim();
    const lastNumber = getLastNumber(expression);

    // Check if lastNumber already contains a decimal point
    if (!lastNumber.includes('.') && lastNumber !== '') {
      showcase.value += '.';
    }
  }
}


function clearScreen() {
  document.getElementById("showcase").value = "";
}

function calculate() {
  const expression = document.getElementById("showcase").value;
  const result = evaluateExpression(expression);
  document.getElementById("showcase").value = result;
}

function evaluateExpression(expression) {
  const tokens = expression.split(' ');

  // Convert '-' to '@' to handle negative numbers
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '-') {
      tokens[i] = '@';
    }
  }

  let result = parseFloat(tokens[0]);
  let incompleteExpression = false;

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i].replace('@', '-');
    const num = parseFloat(tokens[i + 1]);

    if (operator === '+' && !isNaN(num)) {
      result += num;
      incompleteExpression = false;
    } else if (operator === '-' && !isNaN(num)) {
      result -= num;
      incompleteExpression = false;
    } else if (operator === '*' && !isNaN(num)) {
      result *= num;
      incompleteExpression = false;
    } else if (operator === '/' && !isNaN(num)) {
      result /= num;
      incompleteExpression = false;
    } else if (operator === '%') {
      if (isNaN(num)) {
        result /= 100;
      } else {
        result = (result * num) / 100;
      }
      incompleteExpression = false;
    } else {
      incompleteExpression = true;
    }
  }

  if (incompleteExpression) {
    return expression;
  } else {
    return result;
  }
}
 

function getLastNumber(expression) {
  const tokens = expression.split(' ');
  const reversedTokens = tokens.reverse();

  for (const token of reversedTokens) {
    if (/^\d/.test(token)) {
      return token;
    }
  }

  return '';
}

function removeLastElement() {
  const showcase = document.getElementById("showcase");
  const expression = showcase.value.trim();

  if (expression.length === 0) {
    return; // No expression, nothing to remove
  }

  showcase.value = expression.slice(0, -1);
}

document.getElementById("showcase").addEventListener("keydown", function(event) {
  const keyPressed = event.key;

  if (keyPressed === 'Backspace') {
    removeLastElement();
    event.preventDefault();
  } else if (keyPressed === 'Enter') {
    calculate();
    event.preventDefault();
  } else {
    if (keyPressed === '+') {
      display('+');
      event.preventDefault();
    } else if (keyPressed === '-') {
      display('-');
      event.preventDefault();
    } else if (keyPressed === '*') {
      display('*');
      event.preventDefault();
    } else if (keyPressed === '/') {
      display('/');
      event.preventDefault();
    } else if (keyPressed === '%') {
      display('%');
      event.preventDefault();
    } else if (keyPressed === '+/-') {
      display('+/-');
      event.preventDefault();
    } else if (keyPressed === '.' || keyPressed === 'Decimal') {
      display('.');
      event.preventDefault();
    }
  }
});