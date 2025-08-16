let questions = [];
let selectedQuestions = [];
let score = 0;
let currentQuestionIndex = 0;
const QUESTIONS_PER_TEST = 30;

function loadQuestionsFromCSV() {
    Papa.parse("questions.csv", {
        download: true,
        header: true,
        complete: function(results) {
            // Remove blank rows
            questions = results.data.filter(q => q.question && q.option1);

            // Shuffle all questions
            shuffleArray(questions);

            // Pick first 30 for this quiz
            selectedQuestions = questions.slice(0, QUESTIONS_PER_TEST);

            // Start quiz
            loadQuestion();
        }
    });
}

function loadQuestion() {
    if (currentQuestionIndex >= selectedQuestions.length) {
        // Quiz finished
        document.getElementById("quiz-container").innerHTML = `<h2>Quiz Finished!</h2>
        <p>Your score: ${score}/${selectedQuestions.length}</p>`;
        return;
    }

    const q = selectedQuestions[currentQuestionIndex];
    document.getElementById("question").innerText = q.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    [q.option1, q.option2, q.option3, q.option4].forEach((answer, index) => {
        if (answer) {
            const btn = document.createElement("button");
            btn.innerText = answer;
            btn.onclick = () => checkAnswer(index + 1);
            answersDiv.appendChild(btn);
        }
    });

    document.getElementById("score").innerText = `Score: ${score}/${selectedQuestions.length}`;
    document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(selectedIndex) {
    const q = selectedQuestions[currentQuestionIndex];
    const correctIndex = parseInt(q.correct);

    const answerButtons = document.querySelectorAll("#answers button");
    answerButtons.forEach((btn, index) => {
        if (index + 1 === correctIndex) btn.classList.add("correct");
        else if (index + 1 === selectedIndex) btn.classList.add("wrong");
        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) score++;

    document.getElementById("score").innerText = `Score: ${score}/${selectedQuestions.length}`;
    document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Shuffle helper
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start
loadQuestionsFromCSV();
