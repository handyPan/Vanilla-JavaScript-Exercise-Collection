// https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _completedQuestion = document.getElementById('completed-question');
const _totalQuestion = document.getElementById('total-question');
const _result = document.getElementById('result');
const _checkBtn = document.getElementById('check-answer');
const _nextBtn = document.getElementById('next-question');
const _playAgainBtn = document.getElementById('play-again');

let correctAnswer = "";
// askedCount is also the index of the current question
let correctScore = askedCount = 0, totalQuestion = 0;
let loadedQuestions;

// methods

function setCount() {
    _completedQuestion.textContent = askedCount + 1;
    _totalQuestion.textContent = totalQuestion;
}

async function loadQuestion() {
    let min = 5;
    let max = 15;
    num = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(num);
    const apiUrl = `https://opentdb.com/api.php?amount=${num}`;
    const result = await fetch(apiUrl);
    loadedQuestions = await result.json();
    totalQuestion = loadedQuestions.results.length;
    console.log(totalQuestion);
    _result.innerHTML = "";
    showQuestion(loadedQuestions.results[askedCount]);
}

function showQuestion(question) {
    _checkBtn.disabled = false;
    _nextBtn.disabled = true;
    _playAgainBtn.disabled = true;
    _checkBtn.style.display = "block";
    _nextBtn.style.display = "none";
    _playAgainBtn.style.display = "none";

    correctAnswer = question.correct_answer;
    let incorrectAnswer = question.incorrect_answers;
    let optionList = incorrectAnswer;
    // inserting correct answer in random position in the options list
    optionList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `
        ${question.question}
        <br>
        <span class = "category">${question.category}</span>
    `;
    _options.innerHTML = `
        ${optionList.map((option, index) => {
            return `<li> ${index + 1}. <span>${option}</span></li>`;
        }).join('')}
    `;
    
    // has to be invokded in the async function
    addEventListenerForOption();

    setCount();

}

// function addEventListenerForOption() {
//     _options.querySelectorAll('li').forEach((option) => {
//         option.addEventListener('click', () => {
//             if(_options.querySelector('.selected')) {
//                 const activeOption = _options.querySelector('.selected');
//                 activeOption.classList.remove('selected');
//             }
//             option.classList.add('selected');
//         });
//         console.log("event listener added");
//     });
// }

function optionClickHandler(event) {
    if(_options.querySelector('.selected')) {
        const activeOption = _options.querySelector('.selected');
        activeOption.classList.remove('selected');
    }
    event.currentTarget.classList.add('selected');
}

function addEventListenerForOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', optionClickHandler);
        option.classList.add('enable-hover-active');
        console.log("event listener added");
    });
}

function removeEventListenerForOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.removeEventListener('click', optionClickHandler);
        option.classList.remove('enable-hover-active');
        console.log("event listener removed");
    });
}

// to convert html entities to normal text of correct answer
function htmlDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkAnswer() {
    _checkBtn.disabled = true;
    _nextBtn.disabled = false;
    if(_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() === htmlDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `
                <p>
                    <i class="fas fa-check"></i>
                    Correct Answer!
                </p>
            `;
        } else {
            _result.innerHTML = `
                <p>
                    <i class="fas fa-times"></i>
                    Incorrect Answer!
                </p>
                <p>
                <small><b>Correct Answer:</b>${correctAnswer}</small>
                </p>
            `;
        }
        checkCount();
        removeEventListenerForOption();
    } else {
        _result.innerHTML = `
            <p>
                <i class="fas fa-question"></i>
                Please select an option!
            </p>
        `;
        _checkBtn.disabled = false;
        _nextBtn.disabled = true;
    }

    
}

function nextQuestion() {
    _result.innerHTML = "";
    showQuestion(loadedQuestions.results[askedCount]);
}

function restartQuiz() {
    correctScore = askedCount = 0;
    loadQuestion();
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    _nextBtn.style.display = "none";
    _playAgainBtn.style.display = "none";
}

function addEventListenerForBtn() {
    _checkBtn.addEventListener('click', checkAnswer);
    _nextBtn.addEventListener('click', nextQuestion);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

function checkCount() {
    askedCount++;
    if(askedCount === totalQuestion) {
        _result.innerHTML += `
            <br>
            <p>Your score is ${correctScore}.</p>
        `;
        _checkBtn.style.display = "none";
        _nextBtn.style.display = "none";
        _playAgainBtn.style.display = "block";
        _playAgainBtn.disabled = false;
    } else {
        _checkBtn.style.display = "none";
        _nextBtn.style.display = "block";
        _playAgainBtn.style.display = "none";
    }
}

// event listener
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    addEventListenerForBtn();
});


