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
    const hasMinusSign = expression.startsWith('-');
    showcase.value = hasMinusSign ? expression.substring(1) : '-' + expression;
  } else if (value === '.' || value === 'Decimal') {
    const lastNumber = getLastNumber(showcase.value);

    if (!lastNumber.includes('.')) {
      showcase.value += '.';
    }
  }
}

function calculate() {
  const expression = document.getElementById("showcase").value;
  const result = evaluateExpression(expression);
  document.getElementById("showcase").value = result;
}

function clearScreen() {
  document.getElementById("showcase").value = "";
}

function evaluateExpression(expression) {
  const tokens = expression.split(' ');
  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const num = parseFloat(tokens[i + 1]);

    if (operator === '+') {
      result += num;
    } else if (operator === '-') {
      result -= num;
    } else if (operator === '*') {
      result *= num;
    } else if (operator === '/') {
      result /= num;
    } else if (operator === '%') {
      result %= num;
    }
  }

  return result;
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
  const allowedKeysRegex = /^[\d+\-*/%]$/;
  const keyPressed = event.key;

  if (keyPressed === 'Backspace') {
    removeLastElement();
    event.preventDefault();
  } else if (keyPressed === 'Enter') {
    calculate();
    event.preventDefault();
  } else if (!allowedKeysRegex.test(keyPressed) && keyPressed !== '.') { // Check for decimal key
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


document.getElementById("equals-button").addEventListener("click", calculate);





