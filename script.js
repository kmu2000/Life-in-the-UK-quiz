let questions = [];
let score = 0;
let currentQuestionIndex = 0;

function loadQuestionsFromCSV() {
    Papa.parse("QB.csv", {
        download: true,
        header: true,
        complete: function(results) {
            questions = results.data.filter(q => q.question && q.option1); // remove blank rows
            shuffleArray(questions);
            loadQuestion();
        }
    });
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById("question").innerText = q.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    [q.option1, q.option2, q.option3, q.option4].forEach((answer, index) => {
        if (answer) { // only show non-empty options
            const btn = document.createElement("button");
            btn.innerText = answer;
            btn.onclick = () => checkAnswer(index + 1); // 1-based
            answersDiv.appendChild(btn);
        }
    });
}

function checkAnswer(selectedIndex) {
    const q = questions[currentQuestionIndex];
    const correctIndex = parseInt(q.correct);

    const answerButtons = document.querySelectorAll("#answers button");
    answerButtons.forEach((btn, index) => {
        if (index + 1 === correctIndex) btn.classList.add("correct");
        else if (index + 1 === selectedIndex) btn.classList.add("wrong");
        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) score++;

    document.getElementById("score").innerText = `Score: ${score}/${questions.length}`;
    document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    document.getElementById("next-btn").style.display = "none";
    loadQuestion();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start
loadQuestionsFromCSV();
