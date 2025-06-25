// 25.06.17 , 3단계 : 계산기 버튼을 눌렀을때 디스플레이 또는 콘솔에 출력하기
const display = document.getElementById('display');       // display 변수 생성, 값이 변하는 동적요소로 get사용
const buttons = document.querySelectorAll('.buttons button');   // buttons내 button클래스들 전부 불러오기.

// 25.06.18 , 4단계 : firstOperand, operator, secondOperand 변수 선언
let firstOperand = null;            // 첫번째 피연산자를 저장할 변수
let operator = null;                // 연산자(+,-,*,/)를 저장할 변수
let secondOperand = null;           // 두번째 피연산자를 저장할 변수
let waitingForSecondOperand = false;        // 첫번째에서 다음 수를 입력하기 전의 수를 임시로 저장할 변수, 두번째 숫자 기다리는 중 x

// 이벤트 리스너 -> 클릭감지, 'AC', '±', '=' 제외의 버튼들은 눌러지는 값을 그대로 출력하기.
buttons.forEach(button =>{              // buttons내부에 있는 각 button에 반복작업, 이벤트 리스너를 하나씩 붙일거에유.
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value')     // getAttribute통해 'data-value' 속성 불러오기
        switch(value){
            case 'clearDisplay':        // 초기화
                clearDisplay();
            break;
            case 'toggleSign':           // 부호변경
                toggleSign();
            break;
            case 'calculateResult':     // 결과
                calculateResult();
            break;  
            case '^':                   // 제곱근 추가
                handOperator('^');
            break;
            case '+':                   
            case '-':
            case '*':
            case '/':
                handOperator(value);       // "+.-.*./" 연산자 처리
            break;
            default:
                if (isNumber(value) || value === '.') {
                    // 숫자나 소수점만 디스플레이에 출력
                    appendValue(value);
                } else {
                    // 연산자는 콘솔에만 출력
                    console.log('연산자 버튼 :', value);
                }
        }
    });
});

// val이 숫자인지, 아닌지 판단하는 함수
function isNumber(val) {               
    return !isNaN(val);
}

// 디스플레이에 값을 출력해봅시댱.!
function appendValue(val){          // val은 사용자가 누른 값이 입력됨
    if (waitingForSecondOperand) {          // 두 번째 숫자를 입력 시작할 때 디스플레이 초기화
        display.innerText = val === '.' ? '0.' : val;
        waitingForSecondOperand = false;
        return;
    } 
    const current = display.innerText;
     // 1. 디스플레이에 출력된 숫자가 0일 경우
        if (current === '0') {
            if (val === '.') {              // 0상태에서 .을 눌렀을 경우
            display.innerText = '0.'; // '0.' 출력
            } else if (val !== '0') {
                if (val.length > 16) return;
            display.innerText = val; // 0이 아닌 다른 숫자가 클릭되면 해당 숫자가 출력됨.
        }
        return;     // val이 0일 경우, 리턴만 함. 그래서 0을 누르면 무시됨.
    }

        // 2. 0이 아닌 다른 숫자가 있을 경우
        // 소수점이 이미 포함되어 있으면 또 추가하지 않음
            if (val === '.' && current.includes('.')) return;       // '.' 중복 입력 무시

            if ((current + val).length > 16) return;

        display.innerText += val;       // 이외의 값은 뒤에 이어서 출력
}

// 3단계 도전과제 : AC버튼 눌렀을때 디스플레이 창 초기화
// 4단계 : AC버튼 눌렀을때 모든 변수 초기화
function clearDisplay() {
    display.innerText = '0';        
    firstOperand = null;        
    secondOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// 연산자 눌렀을때 계산하게
function handOperator(nextOperator) {
    const inputValue = parseFloat(display.innerText);       // 현재 디스플레이에 있는 값

    if (firstOperand === null) {        // firstOperand : null, 즉 처음눌린 숫자라면
        firstOperand = inputValue;      // 현재 디스플레이에 있는 값을 숫자로 변환, 변수에 저장
        console.log('firstOperand:', firstOperand);  // firstOperand 값 출력

    } else if (operator && !waitingForSecondOperand) {          // '+-*/'가 눌린 뒤, 다음 피연산자를 눌렀을 경우
        secondOperand = inputValue;     //  눌러진 값을 숫자로 변환, 변수에 저장
        const result = calculate(firstOperand, secondOperand, operator);    // calculate함수로 계산된 결과.
        display.innerText = String(result);     // 디스플레이에 결과를 출력해줌
        firstOperand = result;          // 이번 계산의 결과값이, 다음 계산의 시작점
    }   else {
        console.log('firstOperand:', firstOperand);  // 전 계산의 결과 값, firstOperand 값 출력

    }
    // 4단계 도전과제 : result값 새로운 연산자 저장, 다음 숫자 입력 대기
    operator = nextOperator;
    console.log('operator:', operator);  // operator 출력
    waitingForSecondOperand = true;
}

// 4단계 : 실제로 계산 처리 하는 부분
function calculate(a, b, op) {
    switch(op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error';     // 0으로 나뉘게 될 경우 에러 반환.
        case '^': return Math.pow(a, b);                // 제곱근 연산추가
        default: return b;      // 잘못된 연산자가 올 경우, 두번째 숫자가 반환되게함
    }
}

function toggleSign() {
    const currentValue = display.innerText;         // currentValue변수 선언, 디스플레이에 입력된 값을 저장.

    if ((currentValue === '0' && firstOperand === null && operator === null) ||
        (operator !== null && waitingForSecondOperand)) {
        display.innerText = '-'; // '-' 시작 표시
        waitingForSecondOperand = false; // 두 번째 숫자 입력 시작
        return;
    }

    if (currentValue === '0') return;               // 숫자가 0이면 무시        
    let newValue;                                    // newValue 변수 생성
    if (currentValue.startsWith('-')) {             // 문자열이 '-'로 시작하는지 ?
        newValue = currentValue.slice(1);      // '-' 시작이 맞다면, 문자열의 첫번째 '-' 잘라내기 
    } else {
        newValue = '-' + currentValue;         // '-' 시작이 아니라면, 문자열 앞에 '-' 붙이기.
    }
    display.innerText = newValue;         // 부호가 바뀐 숫자가 출력됨

    if (operator === null){             // 연산자가 없을 경우
        firstOperand = parseFloat(newValue);        // firstOperand를 newValue로 변경
    } else if (waitingForSecondOperand === false){      // 연산자 선택 후, 두번째 숫자를 입력중이라면?
        secondOperand = parseFloat(newValue);       // secondOperand에 저장
    } else {                                // 둘다 아니라면
        firstOperand = parseFloat(newValue);        // firstOperand에 저장.
    }
}


// 계산 결과 
function calculateResult() {
    // 첫번째 값이나, 연산자가 아직 없을 경우 함수 종료.
    if (firstOperand === null || operator === null) return;
    //화면에 표시된 값을 숫자로 변환하여 secondOperand에 저장
    secondOperand = parseFloat(display.innerText);
    // 결과값 호출
    let result = calculate(firstOperand, secondOperand, operator);
    result = parseFloat(result.toFixed(2));

    // 계산된 결과를 문자열로 변환하여 호출.
    display.innerText = String(result);

    // 상태 초기화
    firstOperand = result;
    operator = null;
    secondOperand = null;
    waitingForSecondOperand = true;
}

// 키보드 입력 이벤트리스너 추가
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key)) {              // 숫자가 눌린다면
        appendValue(key);           // 숫자 추가
        pressButtonByValue(key);       // 해당버튼 눌림
    } else if (key === '.') {       // . 이 눌린다면
        appendValue('.');           // 점 추가
        pressButtonByValue('.');
    } else if (key === '-') {         // 지옥의 뺄셈(마이너스)
    const current = display.innerText;
        // 음수 * 음수인 상황도 배제할수 없음.
        // 입력시작x, 0일 경우
    if ((current === '0' && firstOperand === null && operator === null)) {
        display.innerText = '-'; // 부호 변경 대신, "-"만 출력
    }
        // 연산자(+,*,/) 선택 직후라면 → 두 번째 음수도 입력 가능하게!
    else if (operator !== null && waitingForSecondOperand) {
        display.innerText = '-';    // 두 번째 숫자도 음수로 시작
        waitingForSecondOperand = false;
    }
        // 그 외에는 '-' 뺄셈으로 처리.
    else {
        handOperator('-');
    }
        pressButtonByValue('-');
    } else if (['+', '*', '/'].includes(key)) {     // 기타연산자
        handOperator(key);
        pressButtonByValue(key);
    } else if (key === 'Enter' || key === '=') {        // 계산 실행
        calculateResult();
        pressButtonByValue('calculateResult');
    } else if (key === '^') {                   // 제곱근 연산자 추가
        handOperator('^');
        pressButtonByValue('^');
    } else if (key === 'Escape') {              // exe키
        clearDisplay();
        pressButtonByValue('clearDisplay');
    } else if (key === 'Backspace') {           // 백스페이스키
        const current = display.innerText;
        if (current.length > 1) {
            display.innerText = current.slice(0, -1);
        } else {
            display.innerText = '0';
        }
    }
});

// 눌림 상태을 나타내는 코드.
function pressButtonByValue(value) {
    const button = document.querySelector(`[data-value="${value}"]`);
    if (!button) return;

    // 눌림 효과 추가
    button.classList.add('active');

    // 잠깐만 보여주고 사라지기.
    setTimeout(() => {
        button.classList.remove('active');
    }, 50);
}
