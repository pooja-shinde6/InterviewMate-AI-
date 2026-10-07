/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 1
   Basic Variables + Navigation + Login/Register
   ===================================================== */


/* ---------- GLOBAL VARIABLES ---------- */

let currentUser = null;

let interviewData = {
    name: "",
    role: "",
    type: "",
    difficulty: "",
    totalQuestions: 5,
    currentQuestion: 0,
    answers: [],
    totalAnswerScore: 0,
    totalCommunicationScore: 0
};

let currentAnswer = "";

let isSpeaking = false;

let recognition = null;

let timerInterval = null;

let answerTimerInterval = null;

let interviewSeconds = 0;

let answerSeconds = 0;


/* ---------- PAGE NAVIGATION ---------- */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    closeMobileMenu();
}


/* ---------- NAVIGATION FUNCTION ---------- */

function goTo(pageId) {
    showPage(pageId);
}


/* ---------- MOBILE MENU ---------- */

function toggleMobileMenu() {

    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
        navLinks.classList.toggle("show");
    }
}


function closeMobileMenu() {

    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
        navLinks.classList.remove("show");
    }
}


/* ---------- LOGIN ---------- */

function loginUser() {

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }

    const savedUser = JSON.parse(
        localStorage.getItem("interviewMateUser")
    );

    if (savedUser) {

        if (
            savedUser.email === email &&
            savedUser.password === password
        ) {

            currentUser = savedUser;

            localStorage.setItem(
                "interviewMateLoggedIn",
                "true"
            );

            updateUserName();

            alert("Login successful!");

            showPage("home");

        } else {

            alert("Invalid email or password.");

        }

    } else {

        alert("No account found. Please register first.");

    }
}


/* ---------- REGISTER ---------- */

function registerUser() {

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");

    if (!nameInput || !emailInput || !passwordInput) {
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (name === "" || email === "" || password === "") {

        alert("Please fill all fields.");

        return;
    }

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;
    }

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        "interviewMateUser",
        JSON.stringify(user)
    );

    currentUser = user;

    updateUserName();

    alert("Registration successful!");

    showPage("home");
}


/* ---------- UPDATE USER NAME ---------- */

function updateUserName() {

    const profileName = document.getElementById("profileName");
    const profileNameInfo =
        document.getElementById("profileNameInfo");

    if (!currentUser) {
        return;
    }

    if (profileName) {
        profileName.textContent = currentUser.name;
    }

    if (profileNameInfo) {
        profileNameInfo.textContent = currentUser.email;
    }

    const finalGreeting =
        document.getElementById("finalGreeting");

    if (finalGreeting) {
        finalGreeting.textContent =
            "Great job, " + currentUser.name + "!";
    }
}


/* ---------- LOGOUT ---------- */

function logoutUser() {

    localStorage.removeItem("interviewMateLoggedIn");

    currentUser = null;

    alert("You have been logged out.");

    showPage("home");
}


/* ---------- CHECK LOGIN ---------- */

function checkLogin() {

    const loggedIn =
        localStorage.getItem("interviewMateLoggedIn");

    const savedUser =
        JSON.parse(
            localStorage.getItem("interviewMateUser")
        );

    if (loggedIn === "true" && savedUser) {

        currentUser = savedUser;

        updateUserName();
    }
}


/* ---------- INITIAL LOAD ---------- */

document.addEventListener("DOMContentLoaded", function() {

    checkLogin();

    showPage("home");

});
/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 2
   Interview Setup + Question Bank + Start Interview
   ===================================================== */


/* ---------- QUESTION BANK ---------- */

const questionBank = {

    HR: [
        "Tell me about yourself.",
        "What are your strengths and weaknesses?",
        "Why should we hire you?",
        "Where do you see yourself in five years?",
        "Why do you want to join our company?",
        "How do you handle pressure?",
        "Tell me about a challenge you faced and how you solved it.",
        "What are your career goals?",
        "How do you work in a team?",
        "Why did you choose this career?"
    ],

    Technical: [
        "What is HTML and why is it used?",
        "What is the difference between HTML and CSS?",
        "What is JavaScript?",
        "What is the difference between let, const and var?",
        "What is the DOM in JavaScript?",
        "What is an API?",
        "What is Node.js?",
        "What is the difference between frontend and backend?",
        "What is Git and why is it useful?",
        "Explain the difference between synchronous and asynchronous JavaScript."
    ]

};


/* ---------- DIFFICULTY QUESTIONS ---------- */

const difficultyQuestions = {

    Easy: [
        "What is your favorite programming language?",
        "Why did you choose computer science?",
        "What is a website?",
        "What is HTML?",
        "What is CSS?"
    ],

    Medium: [
        "Explain one project you have created.",
        "How does JavaScript interact with HTML?",
        "What is the difference between frontend and backend?",
        "What is an API and where is it used?",
        "How do you debug a JavaScript program?"
    ],

    Hard: [
        "How would you improve the performance of a web application?",
        "Explain how asynchronous JavaScript works.",
        "How would you design a scalable web application?",
        "How would you handle an API failure in a frontend application?",
        "Explain how you would secure a web application."
    ]

};


/* ---------- GET SETUP VALUES ---------- */

function getSetupValues() {

    const name =
        document.getElementById("userName")?.value.trim();

    const role =
        document.getElementById("jobRole")?.value.trim();

    const type =
        document.getElementById("interviewType")?.value;

    const difficulty =
        document.getElementById("difficulty")?.value;

    const questionNumber =
        document.getElementById("questionNumber")?.value;

    return {
        name,
        role,
        type,
        difficulty,
        questionNumber
    };
}


/* ---------- START INTERVIEW ---------- */

function startInterview() {

    const setup = getSetupValues();

    if (!setup.name) {
        alert("Please enter your name.");
        return;
    }

    if (!setup.role) {
        alert("Please enter your job role.");
        return;
    }

    if (!setup.type) {
        alert("Please select interview type.");
        return;
    }

    if (!setup.difficulty) {
        alert("Please select difficulty.");
        return;
    }

    interviewData.name = setup.name;

    interviewData.role = setup.role;

    interviewData.type = setup.type;

    interviewData.difficulty = setup.difficulty;

    interviewData.totalQuestions =
        Number(setup.questionNumber) || 5;

    interviewData.currentQuestion = 0;

    interviewData.answers = [];

    interviewData.totalAnswerScore = 0;

    interviewData.totalCommunicationScore = 0;

    currentAnswer = "";

    stopSpeechRecognition();

    stopInterviewTimer();

    stopAnswerTimer();

    loadInterviewQuestion();

    updateInterviewBadges();

    showPage("interview");

    startInterviewTimer();

    startAnswerTimer();
}


/* ---------- UPDATE INTERVIEW BADGES ---------- */

function updateInterviewBadges() {

    const roleBadge =
        document.getElementById("roleBadge");

    const typeBadge =
        document.getElementById("typeBadge");

    const difficultyBadge =
        document.getElementById("difficultyBadge");

    const questionCount =
        document.getElementById("questionCount");

    if (roleBadge) {
        roleBadge.textContent = interviewData.role;
    }

    if (typeBadge) {
        typeBadge.textContent = interviewData.type;
    }

    if (difficultyBadge) {
        difficultyBadge.textContent =
            interviewData.difficulty;
    }

    if (questionCount) {
        questionCount.textContent =
            "Question " +
            (interviewData.currentQuestion + 1) +
            " / " +
            interviewData.totalQuestions;
    }
}


/* ---------- GET QUESTIONS ---------- */

function getQuestions() {

    let questions = [];

    const type =
        interviewData.type;

    const difficulty =
        interviewData.difficulty;

    if (type === "HR") {

        questions =
            [...questionBank.HR];

    } else if (type === "Technical") {

        questions =
            [...questionBank.Technical];

    } else {

        questions =
            [...questionBank.HR];
    }


    /*
       Add difficulty-based questions
       if required.
    */

    if (difficultyQuestions[difficulty]) {

        questions = [
            ...questions,
            ...difficultyQuestions[difficulty]
        ];
    }


    /* Shuffle questions */

    questions.sort(function() {
        return Math.random() - 0.5;
    });


    return questions.slice(
        0,
        interviewData.totalQuestions
    );
}


/* ---------- STORE CURRENT QUESTIONS ---------- */

let currentQuestions = [];


/* ---------- LOAD QUESTION ---------- */

function loadInterviewQuestion() {

    if (currentQuestions.length === 0) {

        currentQuestions = getQuestions();
    }

    const index =
        interviewData.currentQuestion;

    const question =
        currentQuestions[index];

    if (!question) {

        finishInterview();

        return;
    }

    const questionText =
        document.getElementById("questionText");

    const questionCount =
        document.getElementById("questionCount");

    if (questionText) {
        questionText.textContent = question;
    }

    if (questionCount) {
        questionCount.textContent =
            "Question " +
            (index + 1) +
            " / " +
            interviewData.totalQuestions;
    }


    /* Clear previous answer */

    currentAnswer = "";

    const answerBox =
        document.getElementById("answerBox");

    const transcriptText =
        document.getElementById("transcriptText");

    if (answerBox) {
        answerBox.value = "";
    }

    if (transcriptText) {
        transcriptText.textContent =
            "Your spoken answer will appear here...";
    }


    /* Reset timer */

    stopAnswerTimer();

    answerSeconds = 0;

    updateAnswerTimer();

    startAnswerTimer();


    /* Default answer mode */

    setAnswerMode("type");
}


/* ---------- NEXT QUESTION ---------- */

function nextQuestion() {

    saveCurrentAnswer();

    interviewData.currentQuestion++;

    if (
        interviewData.currentQuestion >=
        interviewData.totalQuestions
    ) {

        finishInterview();

        return;
    }

    loadInterviewQuestion();
}


/* ---------- SAVE CURRENT ANSWER ---------- */

function saveCurrentAnswer() {

    const answerBox =
        document.getElementById("answerBox");

    let answer = currentAnswer;

    if (answerBox && answerBox.value.trim()) {
        answer = answerBox.value.trim();
    }

    if (!answer) {
        answer = "No answer provided.";
    }

    const question =
        currentQuestions[
            interviewData.currentQuestion
        ];

    interviewData.answers.push({
        question: question,
        answer: answer,
        answerScore: 0,
        communicationScore: 0,
        strengths: [],
        improvements: [],
        communicationFeedback: "",
        suggestedAnswer: ""
    });
}


/* ---------- FINISH INTERVIEW ---------- */

function finishInterview() {

    stopSpeechRecognition();

    stopInterviewTimer();

    stopAnswerTimer();

    showPage("final");

    generateFinalReport();

}
/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 3
   Answer Mode + Speech Recognition + Timers
   ===================================================== */


/* ---------- ANSWER MODE ---------- */

function setAnswerMode(mode) {

    const typeTab =
        document.getElementById("typeTab");

    const speakTab =
        document.getElementById("speakTab");

    const typeAnswerBox =
        document.getElementById("typeAnswerBox");

    const voiceBox =
        document.getElementById("voiceBox");


    if (mode === "type") {

        if (typeTab) {
            typeTab.classList.add("active");
        }

        if (speakTab) {
            speakTab.classList.remove("active");
        }

        if (typeAnswerBox) {
            typeAnswerBox.classList.remove("hidden");
        }

        if (voiceBox) {
            voiceBox.classList.add("hidden");
        }

        stopSpeechRecognition();

    } else if (mode === "speak") {

        if (speakTab) {
            speakTab.classList.add("active");
        }

        if (typeTab) {
            typeTab.classList.remove("active");
        }

        if (typeAnswerBox) {
            typeAnswerBox.classList.add("hidden");
        }

        if (voiceBox) {
            voiceBox.classList.remove("hidden");
        }

    }
}


/* ---------- SPEECH RECOGNITION SETUP ---------- */
function setupSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        recognition = null;

        return false;
    }

    recognition = new SpeechRecognition();

    /*
     * Use one speech session at a time.
     * This prevents repeated transcript results.
     */

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";


    recognition.onstart = function() {

        isSpeaking = true;

        updateSpeechUI(true);
    };


    recognition.onresult = function(event) {

        if (!event.results || event.results.length === 0) {
            return;
        }

        const transcript =
            event.results[0][0].transcript.trim();

        if (!transcript) {
            return;
        }

        /*
         * Add only the new final speech result.
         */

        if (currentAnswer.trim()) {

            currentAnswer =
                currentAnswer.trim() +
                " " +
                transcript;

        } else {

            currentAnswer = transcript;
        }


        updateTranscript(currentAnswer);
    };


    recognition.onerror = function(event) {

        console.log(
            "Speech recognition error:",
            event.error
        );


        if (event.error === "not-allowed") {

            alert(
                "Microphone permission is required for speaking mode."
            );
        }


        updateSpeechUI(false);
    };


    recognition.onend = function() {

        isSpeaking = false;

        updateSpeechUI(false);
    };


    return true;
}





/* ---------- START / STOP SPEECH ---------- */

function toggleSpeech() {

    if (!recognition) {

        const supported =
            setupSpeechRecognition();

        if (!supported) {

            alert(
                "Speech recognition is not supported in this browser. Please use Chrome."
            );

            return;
        }
    }


    if (isSpeaking) {

        stopSpeechRecognition();

    } else {

        startSpeechRecognition();
    }
}


/* ---------- START SPEECH ---------- */

function startSpeechRecognition() {

    if (!recognition) {

        if (!setupSpeechRecognition()) {

            alert(
                "Speech recognition is not supported in this browser."
            );

            return;
        }
    }


    try {

        recognition.start();

    } catch (error) {

        console.log(
            "Speech recognition already running."
        );
    }
}


/* ---------- STOP SPEECH ---------- */

function stopSpeechRecognition() {

    if (recognition && isSpeaking) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(error);
        }
    }

    isSpeaking = false;

    updateSpeechUI(false);
}


/* ---------- SPEECH UI ---------- */

function updateSpeechUI(recording) {

    const micBtn =
        document.getElementById("micBtn");

    const speechStatus =
        document.getElementById("speechStatus");


    if (recording) {

        if (micBtn) {

            micBtn.classList.add("recording");

            micBtn.textContent = "⏹";
        }

        if (speechStatus) {

            speechStatus.textContent =
                "Listening... Speak your answer clearly.";
        }

    } else {

        if (micBtn) {

            micBtn.classList.remove("recording");

            micBtn.textContent = "🎤";
        }

        if (speechStatus) {

            speechStatus.textContent =
                "Click the microphone and start speaking.";
        }
    }
}


/* ---------- UPDATE TRANSCRIPT ---------- */

function updateTranscript(text) {

    const transcriptText =
        document.getElementById("transcriptText");

    if (transcriptText) {

        if (text.trim()) {

            transcriptText.textContent =
                text.trim();

        } else {

            transcriptText.textContent =
                "Your spoken answer will appear here...";
        }
    }
}


/* ---------- CLEAR ANSWER ---------- */

function clearAnswer() {

    currentAnswer = "";

    const answerBox =
        document.getElementById("answerBox");

    const transcriptText =
        document.getElementById("transcriptText");


    if (answerBox) {

        answerBox.value = "";
    }

    if (transcriptText) {

        transcriptText.textContent =
            "Your spoken answer will appear here...";
    }
}


/* ---------- GET CURRENT ANSWER ---------- */

function getCurrentAnswer() {

    const answerBox =
        document.getElementById("answerBox");

    let answer = "";


    if (answerBox && !answerBox.closest(".hidden")) {

        answer = answerBox.value.trim();
    }


    if (!answer && currentAnswer) {

        answer = currentAnswer.trim();
    }


    return answer;
}


/* ---------- INTERVIEW TIMER ---------- */

function startInterviewTimer() {

    stopInterviewTimer();

    interviewSeconds = 0;

    updateInterviewTimer();


    timerInterval =
        setInterval(function() {

            interviewSeconds++;

            updateInterviewTimer();

        }, 1000);
}


function stopInterviewTimer() {

    if (timerInterval) {

        clearInterval(timerInterval);

        timerInterval = null;
    }
}


function updateInterviewTimer() {

    const timer =
        document.getElementById("timer");

    if (!timer) {
        return;
    }


    const minutes =
        Math.floor(interviewSeconds / 60);

    const seconds =
        interviewSeconds % 60;


    timer.textContent =
        formatTime(minutes, seconds);
}


/* ---------- ANSWER TIMER ---------- */

function startAnswerTimer() {

    stopAnswerTimer();

    answerSeconds = 0;

    updateAnswerTimer();


    answerTimerInterval =
        setInterval(function() {

            answerSeconds++;

            updateAnswerTimer();

        }, 1000);
}


function stopAnswerTimer() {

    if (answerTimerInterval) {

        clearInterval(answerTimerInterval);

        answerTimerInterval = null;
    }
}


function updateAnswerTimer() {

    const answerTimer =
        document.getElementById("answerTimer");

    if (!answerTimer) {
        return;
    }


    const minutes =
        Math.floor(answerSeconds / 60);

    const seconds =
        answerSeconds % 60;


    answerTimer.textContent =
        "Answer time: " +
        formatTime(minutes, seconds);
}


/* ---------- FORMAT TIME ---------- */

function formatTime(minutes, seconds) {

    const min =
        String(minutes).padStart(2, "0");

    const sec =
        String(seconds).padStart(2, "0");

    return min + ":" + sec;
}


/* ---------- SUBMIT ANSWER ---------- */

function submitAnswer() {

    stopSpeechRecognition();

    stopAnswerTimer();

    const answer =
        getCurrentAnswer();


    if (!answer) {

        alert(
            "Please type or speak an answer before submitting."
        );

        startAnswerTimer();

        return;
    }


    currentAnswer = answer;

    analyzeCurrentAnswer();
}
/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 4
   Answer Analysis + Scores + Communication Feedback
   ===================================================== */


/* ---------- ANALYZE CURRENT ANSWER ---------- */

async function analyzeCurrentAnswer() {

    const answer = getCurrentAnswer();

    const question =
        currentQuestions[
            interviewData.currentQuestion
        ];


    if (!answer || answer.trim() === "") {

        alert("Please provide an answer.");

        return;
    }


    /* Stop speech and timer */

    stopSpeechRecognition();

    stopAnswerTimer();


    /* Show loading message */

    const questionText =
        document.getElementById("questionText");

    if (questionText) {

        questionText.textContent =
            "Analyzing your answer...";
    }


    try {

        /* =========================================
           SEND ANSWER TO NODE.JS BACKEND
           ========================================= */

        const response = await fetch(
            "http://localhost:3000/api/analyze",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    question: question,

                    answer: answer

                })
            }
        );


        /* =========================================
           GET BACKEND RESPONSE
           ========================================= */

        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Answer analysis failed."
            );

            return;
        }


        /* =========================================
           GET ANALYSIS RESULT
           ========================================= */

        const result =
            data.analysis;


        const answerData = {

            question: question,

            answer: answer,

            answerScore:
                result.answerScore,

            communicationScore:
                result.communicationScore,

            strengths:
                result.strengths,

            improvements:
                result.improvements,

            communicationFeedback:
                result.communicationFeedback,

            suggestedAnswer:
                result.suggestedAnswer,

            mode:
                currentAnswerMode
        };


        /* =========================================
           SAVE ANSWER
           ========================================= */

        interviewData.answers.push(
            answerData
        );


        interviewData.totalAnswerScore +=
            result.answerScore;


        interviewData.totalCommunicationScore +=
            result.communicationScore;


        /* =========================================
           DISPLAY RESULT
           ========================================= */

        displayAnswerResult(
            answerData
        );


        /* =========================================
           OPEN RESULT PAGE
           ========================================= */

        showPage("result");


    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );


        alert(
            "Backend server is not connected. " +
            "Please start Node.js server."
        );

    }

}


/* ---------- ANSWER SCORE ---------- */

function calculateAnswerScore(answer, question) {

    let score = 40;

    const words =
        answer.trim().split(/\s+/);

    const wordCount =
        words.length;


    /* Length check */

    if (wordCount >= 10) {
        score += 10;
    }

    if (wordCount >= 25) {
        score += 10;
    }

    if (wordCount >= 45) {
        score += 5;
    }


    /* Relevant keywords */

    const questionWords =
        question
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .split(" ")
            .filter(function(word) {

                return word.length > 3;
            });


    const answerLower =
        answer.toLowerCase();


    let matchedWords = 0;


    questionWords.forEach(function(word) {

        if (answerLower.includes(word)) {

            matchedWords++;
        }
    });


    if (matchedWords >= 1) {
        score += 8;
    }

    if (matchedWords >= 2) {
        score += 7;
    }


    /* Positive interview words */

    const usefulWords = [
        "project",
        "experience",
        "skill",
        "team",
        "learn",
        "problem",
        "solution",
        "improve",
        "develop",
        "javascript",
        "html",
        "css",
        "communication",
        "goal",
        "responsibility"
    ];


    let usefulCount = 0;


    usefulWords.forEach(function(word) {

        if (answerLower.includes(word)) {

            usefulCount++;
        }
    });


    score += Math.min(
        usefulCount * 2,
        10
    );


    /* Avoid extremely short answers */

    if (wordCount < 5) {

        score -= 15;
    }


    /* Maximum and minimum */

    score =
        Math.max(10, Math.min(100, score));


    return score;
}


/* ---------- COMMUNICATION SCORE ---------- */

function calculateCommunicationScore(answer) {

    let score = 70;

    const words =
        answer.trim().split(/\s+/);

    const wordCount =
        words.length;


    /* Very short answer */

    if (wordCount < 8) {

        score -= 15;
    }


    /* Good answer length */

    if (
        wordCount >= 15 &&
        wordCount <= 100
    ) {

        score += 8;
    }


    /* Filler words */

    const fillerWords = [
        "um",
        "uh",
        "like",
        "actually",
        "basically",
        "you know",
        "hmm"
    ];


    let fillerCount = 0;

    const lowerAnswer =
        answer.toLowerCase();


    fillerWords.forEach(function(word) {

        if (lowerAnswer.includes(word)) {

            fillerCount++;
        }
    });


    score -= fillerCount * 4;


    /* Repeated punctuation / unclear writing */

    if (
        answer.includes("...") ||
        answer.includes("???")
    ) {

        score -= 5;
    }


    /* Structured answer indicators */

    const structureWords = [
        "first",
        "second",
        "because",
        "therefore",
        "finally",
        "for example",
        "however"
    ];


    let structureCount = 0;


    structureWords.forEach(function(word) {

        if (lowerAnswer.includes(word)) {

            structureCount++;
        }
    });


    score += Math.min(
        structureCount * 3,
        9
    );


    score =
        Math.max(10, Math.min(100, score));


    return score;
}


/* ---------- GENERATE FEEDBACK ---------- */

function generateFeedback(
    answer,
    question,
    answerScore,
    communicationScore
) {

    const strengths = [];

    const improvements = [];

    const lowerAnswer =
        answer.toLowerCase();


    const wordCount =
        answer.trim().split(/\s+/).length;


    /* ---------- STRENGTHS ---------- */

    if (wordCount >= 20) {

        strengths.push(
            "Your answer has a good amount of detail."
        );

    } else {

        strengths.push(
            "You gave a direct answer."
        );
    }


    if (
        lowerAnswer.includes("project") ||
        lowerAnswer.includes("experience")
    ) {

        strengths.push(
            "You included practical experience or project information."
        );
    }


    if (
        lowerAnswer.includes("because") ||
        lowerAnswer.includes("example")
    ) {

        strengths.push(
            "You provided reasoning or an example."
        );
    }


    if (answerScore >= 75) {

        strengths.push(
            "Your answer is relevant to the interview question."
        );
    }


    if (strengths.length === 0) {

        strengths.push(
            "You attempted the interview question."
        );
    }


    /* ---------- IMPROVEMENTS ---------- */

    if (wordCount < 15) {

        improvements.push(
            "Give a more detailed answer with a suitable example."
        );
    }


    if (answerScore < 60) {

        improvements.push(
            "Try to connect your answer more directly with the question."
        );
    }


    if (communicationScore < 60) {

        improvements.push(
            "Improve clarity and avoid unnecessary filler words."
        );
    }


    if (
        !lowerAnswer.includes("example") &&
        !lowerAnswer.includes("for example")
    ) {

        improvements.push(
            "Add a real-life or project example when possible."
        );
    }


    improvements.push(
        "Use a simple structure: Point → Explanation → Example → Conclusion."
    );


    /* ---------- COMMUNICATION FEEDBACK ---------- */

    let communicationFeedback = "";


    if (communicationScore >= 80) {

        communicationFeedback =
            "Good communication. Your answer is clear, reasonably structured and easy to understand.";

    } else if (communicationScore >= 65) {

        communicationFeedback =
            "Good attempt. Try to speak more clearly and organize your points before answering.";

    } else {

        communicationFeedback =
            "Communication needs improvement. Speak slowly, use short clear sentences and avoid filler words.";
    }


    /* ---------- SPOKEN FEEDBACK ---------- */

    if (isSpeaking || currentAnswer.length > 0) {

        communicationFeedback +=
            " For spoken answers, focus on speaking speed, pronunciation, confidence and clear sentence structure.";
    }


    /* ---------- SUGGESTED ANSWER ---------- */

    const suggestedAnswer =
        createSuggestedAnswer(
            question,
            answer
        );


    return {

        strengths: strengths,

        improvements: improvements,

        communicationFeedback:
            communicationFeedback,

        suggestedAnswer:
            suggestedAnswer
    };
}


/* ---------- SUGGESTED ANSWER ---------- */

function createSuggestedAnswer(
    question,
    originalAnswer
) {

    const lowerQuestion =
        question.toLowerCase();


    if (
        lowerQuestion.includes(
            "tell me about yourself"
        )
    ) {

        return (
            "My name is " +
            interviewData.name +
            ". I am a BCS student interested in web development. " +
            "I have learned HTML, CSS and JavaScript and I am also learning Node.js. " +
            "I have created projects such as a portfolio website, to-do list and expense tracker. " +
            "I am a quick learner and I want to improve my technical and communication skills."
        );
    }


    if (
        lowerQuestion.includes("strength")
    ) {

        return (
            "My strengths are that I am a quick learner, " +
            "I am hardworking and I try to solve problems patiently. " +
            "I also enjoy learning new technologies and applying them through projects."
        );
    }


    if (
        lowerQuestion.includes("why should we hire")
    ) {

        return (
            "You should hire me because I am willing to learn, " +
            "I have a good foundation in web technologies and I am interested in practical development. " +
            "I am responsible, adaptable and ready to improve my skills through real projects."
        );
    }


    if (
        lowerQuestion.includes("html")
    ) {

        return (
            "HTML stands for HyperText Markup Language. " +
            "It is used to create the structure of web pages. " +
            "HTML uses elements and tags such as headings, paragraphs, links, images and forms."
        );
    }


    if (
        lowerQuestion.includes("css")
    ) {

        return (
            "CSS stands for Cascading Style Sheets. " +
            "It is used to design and style web pages. " +
            "With CSS we can control colors, fonts, spacing, layouts, animations and responsive design."
        );
    }


    if (
        lowerQuestion.includes("javascript")
    ) {

        return (
            "JavaScript is a programming language mainly used to make web pages interactive and dynamic. " +
            "It can handle events, manipulate the DOM, validate forms, communicate with APIs and perform many other tasks."
        );
    }


    if (
        lowerQuestion.includes("node.js")
    ) {

        return (
            "Node.js is a JavaScript runtime environment that allows JavaScript to run outside the browser. " +
            "It is commonly used for backend development, APIs and server-side applications."
        );
    }


    /* ---------- GENERAL ANSWER ---------- */

    return (
        "A good answer should directly address the question. " +
        "Start with the main point, explain it clearly, give a practical example " +
        "and finish with a short conclusion. " +
        "Your original answer can be improved by adding more specific details and examples."
    );
}


/* ---------- DISPLAY RESULT ---------- */

function displayAnswerResult(data) {

    const answerScore =
        document.getElementById("answerScore");

    const communicationScore =
        document.getElementById(
            "communicationScore"
        );

    const resultQuestionNo =
        document.getElementById(
            "resultQuestionNo"
        );

    const strengths =
        document.getElementById("strengths");

    const improvements =
        document.getElementById("improvements");

    const communicationFeedback =
        document.getElementById(
            "communicationFeedback"
        );

    const suggestedAnswer =
        document.getElementById(
            "suggestedAnswer"
        );


    if (answerScore) {

        answerScore.textContent =
            data.answerScore;
    }


    if (communicationScore) {

        communicationScore.textContent =
            data.communicationScore;
    }


    if (resultQuestionNo) {

        resultQuestionNo.textContent =
            "Question " +
            (
                interviewData.currentQuestion + 1
            );
    }


    if (strengths) {

        strengths.innerHTML =
            data.strengths
                .map(function(item) {

                    return "<li>" +
                        item +
                        "</li>";

                })
                .join("");
    }


    if (improvements) {

        improvements.innerHTML =
            data.improvements
                .map(function(item) {

                    return "<li>" +
                        item +
                        "</li>";

                })
                .join("");
    }


    if (communicationFeedback) {

        communicationFeedback.textContent =
            data.communicationFeedback;
    }


    if (suggestedAnswer) {

        suggestedAnswer.textContent =
            data.suggestedAnswer;
    }


    /* ---------- NEXT BUTTON ---------- */

    const nextBtn =
        document.getElementById("nextBtn");

    if (nextBtn) {

        if (
            interviewData.currentQuestion + 1 >=
            interviewData.totalQuestions
        ) {

            nextBtn.textContent =
                "View Final Report";

        } else {

            nextBtn.textContent =
                "Next Question";
        }
    }
}
/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 5
   Final Report + Dashboard + History + LocalStorage
   ===================================================== */


/* ---------- FINAL REPORT ---------- */

function generateFinalReport() {

    const answers =
        interviewData.answers;

    if (!answers || answers.length === 0) {
        return;
    }


    /* ---------- CALCULATE AVERAGES ---------- */

    let answerTotal = 0;

    let communicationTotal = 0;


    answers.forEach(function(item) {

        answerTotal +=
            Number(item.answerScore) || 0;

        communicationTotal +=
            Number(item.communicationScore) || 0;
    });


    const answerAverage =
        Math.round(
            answerTotal / answers.length
        );

    const communicationAverage =
        Math.round(
            communicationTotal / answers.length
        );


    const finalScore =
        Math.round(
            (answerAverage +
                communicationAverage) / 2
        );


    /* ---------- FINAL GREETING ---------- */

    const finalGreeting =
        document.getElementById("finalGreeting");

    if (finalGreeting) {

        finalGreeting.textContent =
            "Great job, " +
            interviewData.name +
            "!";
    }


    /* ---------- FINAL SCORE ---------- */

    const finalScoreElement =
        document.getElementById("finalScore");

    if (finalScoreElement) {

        finalScoreElement.textContent =
            finalScore;
    }


    /* ---------- TOTAL QUESTIONS ---------- */

    const totalQuestions =
        document.getElementById("totalQuestions");

    if (totalQuestions) {

        totalQuestions.textContent =
            answers.length;
    }


    /* ---------- ANSWER SCORE ---------- */

    const finalAnswerScore =
        document.getElementById(
            "finalAnswerScore"
        );

    if (finalAnswerScore) {

        finalAnswerScore.textContent =
            answerAverage;
    }


    /* ---------- COMMUNICATION SCORE ---------- */

    const finalCommScore =
        document.getElementById(
            "finalCommScore"
        );

    if (finalCommScore) {

        finalCommScore.textContent =
            communicationAverage;
    }


    /* ---------- GENERATE FEEDBACK ---------- */

    const strengths =
        collectStrengths(answers);

    const improvements =
        collectImprovements(answers);


    const finalSuggestions =
        generateFinalSuggestions(
            finalScore,
            communicationAverage
        );


    /* ---------- DISPLAY STRENGTHS ---------- */

    const finalStrengths =
        document.getElementById(
            "finalStrengths"
        );

    if (finalStrengths) {

        finalStrengths.innerHTML =
            strengths
                .map(function(item) {

                    return "<li>" +
                        item +
                        "</li>";

                })
                .join("");
    }


    /* ---------- DISPLAY IMPROVEMENTS ---------- */

    const finalImprovements =
        document.getElementById(
            "finalImprovements"
        );

    if (finalImprovements) {

        finalImprovements.innerHTML =
            improvements
                .map(function(item) {

                    return "<li>" +
                        item +
                        "</li>";

                })
                .join("");
    }


    /* ---------- DISPLAY SUGGESTIONS ---------- */

    const finalSuggestionsElement =
        document.getElementById(
            "finalSuggestions"
        );

    if (finalSuggestionsElement) {

        finalSuggestionsElement.innerHTML =
            finalSuggestions
                .map(function(item) {

                    return "<li>" +
                        item +
                        "</li>";

                })
                .join("");
    }


    /* ---------- SAVE HISTORY ---------- */

    saveInterviewHistory(
        finalScore,
        answerAverage,
        communicationAverage
    );


    /* ---------- UPDATE DASHBOARD ---------- */

    updateDashboard();
}


/* ---------- COLLECT STRENGTHS ---------- */

function collectStrengths(answers) {

    const allStrengths = [];


    answers.forEach(function(item) {

        if (item.strengths) {

            item.strengths.forEach(
                function(strength) {

                    if (
                        !allStrengths.includes(
                            strength
                        )
                    ) {

                        allStrengths.push(
                            strength
                        );
                    }
                }
            );
        }
    });


    if (allStrengths.length === 0) {

        allStrengths.push(
            "You completed the interview."
        );
    }


    return allStrengths.slice(0, 5);
}


/* ---------- COLLECT IMPROVEMENTS ---------- */

function collectImprovements(answers) {

    const allImprovements = [];


    answers.forEach(function(item) {

        if (item.improvements) {

            item.improvements.forEach(
                function(improvement) {

                    if (
                        !allImprovements.includes(
                            improvement
                        )
                    ) {

                        allImprovements.push(
                            improvement
                        );
                    }
                }
            );
        }
    });


    if (allImprovements.length === 0) {

        allImprovements.push(
            "Continue practicing mock interviews."
        );
    }


    return allImprovements.slice(0, 5);
}


/* ---------- FINAL SUGGESTIONS ---------- */

function generateFinalSuggestions(
    finalScore,
    communicationScore
) {

    const suggestions = [];


    if (finalScore >= 80) {

        suggestions.push(
            "Your overall performance is strong. Continue practicing to maintain your confidence."
        );

    } else if (finalScore >= 60) {

        suggestions.push(
            "Your performance is good. Practice more interview questions to improve consistency."
        );

    } else {

        suggestions.push(
            "Practice basic interview questions regularly and improve the structure of your answers."
        );
    }


    if (communicationScore < 70) {

        suggestions.push(
            "Work on communication by speaking slowly, clearly and confidently."
        );

    } else {

        suggestions.push(
            "Your communication is developing well. Continue speaking practice."
        );
    }


    suggestions.push(
        "Use real project examples whenever possible."
    );

    suggestions.push(
        "Try the interview again with a different difficulty level."
    );

    suggestions.push(
        "Review your weak areas before attending a real interview."
    );


    return suggestions;
}


/* ---------- SAVE INTERVIEW HISTORY ---------- */

function saveInterviewHistory(
    finalScore,
    answerAverage,
    communicationAverage
) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "interviewMateHistory"
            )
        ) || [];


    const record = {

        name: interviewData.name,

        role: interviewData.role,

        type: interviewData.type,

        difficulty:
            interviewData.difficulty,

        totalQuestions:
            interviewData.totalQuestions,

        finalScore: finalScore,

        answerScore: answerAverage,

        communicationScore:
            communicationAverage,

        date:
            new Date().toLocaleString(),

        answers:
            interviewData.answers
    };


    history.unshift(record);


    /* Keep latest 20 interviews */

    const limitedHistory =
        history.slice(0, 20);


    localStorage.setItem(
        "interviewMateHistory",
        JSON.stringify(
            limitedHistory
        )
    );


    updateHistoryList();
}


/* ---------- GET HISTORY ---------- */

function getInterviewHistory() {

    return JSON.parse(
        localStorage.getItem(
            "interviewMateHistory"
        )
    ) || [];
}


/* ---------- UPDATE DASHBOARD ---------- */

function updateDashboard() {

    const history =
        getInterviewHistory();


    const dashTotal =
        document.getElementById(
            "dashTotal"
        );

    const dashAvg =
        document.getElementById(
            "dashAvg"
        );

    const dashComm =
        document.getElementById(
            "dashComm"
        );

    const recentList =
        document.getElementById(
            "recentList"
        );


    if (dashTotal) {

        dashTotal.textContent =
            history.length;
    }


    if (history.length === 0) {

        if (dashAvg) {
            dashAvg.textContent = "0";
        }

        if (dashComm) {
            dashComm.textContent = "0";
        }

        if (recentList) {

            recentList.innerHTML =
                "<div class='empty-state'>" +
                "<div class='empty-state-icon'>📊</div>" +
                "<h3>No interviews yet</h3>" +
                "<p>Complete your first mock interview to see your progress.</p>" +
                "</div>";
        }

        return;
    }


    let scoreTotal = 0;

    let communicationTotal = 0;


    history.forEach(function(item) {

        scoreTotal +=
            Number(item.finalScore) || 0;

        communicationTotal +=
            Number(item.communicationScore) || 0;
    });


    const averageScore =
        Math.round(
            scoreTotal / history.length
        );

    const averageCommunication =
        Math.round(
            communicationTotal /
            history.length
        );


    if (dashAvg) {

        dashAvg.textContent =
            averageScore;
    }


    if (dashComm) {

        dashComm.textContent =
            averageCommunication;
    }


    /* ---------- RECENT INTERVIEWS ---------- */

    if (recentList) {

        recentList.innerHTML =
            history
                .slice(0, 5)
                .map(function(item) {

                    return `
                        <div class="recent-item">

                            <div class="recent-info">

                                <h4>
                                    ${escapeHTML(item.role)}
                                </h4>

                                <p>
                                    ${escapeHTML(item.type)}
                                    •
                                    ${escapeHTML(item.difficulty)}
                                    •
                                    ${escapeHTML(item.date)}
                                </p>

                            </div>

                            <div class="list-score">
                                ${item.finalScore}/100
                            </div>

                        </div>
                    `;

                })
                .join("");
    }
}


/* ---------- UPDATE HISTORY LIST ---------- */

function updateHistoryList() {

    const historyList =
        document.getElementById(
            "historyList"
        );

    if (!historyList) {
        return;
    }


    const history =
        getInterviewHistory();


    if (history.length === 0) {

        historyList.innerHTML =
            `
            <div class="empty-state">

                <div class="empty-state-icon">
                    📋
                </div>

                <h3>
                    No interview history
                </h3>

                <p>
                    Your completed interviews will appear here.
                </p>

            </div>
            `;

        return;
    }


    historyList.innerHTML =
        history
            .map(function(item, index) {

                return `
                    <div class="history-item">

                        <div class="history-info">

                            <h4>
                                ${escapeHTML(item.role)}
                            </h4>

                            <p>
                                ${escapeHTML(item.type)}
                                •
                                ${escapeHTML(item.difficulty)}
                                •
                                ${escapeHTML(item.date)}
                            </p>

                            <p>
                                Answer:
                                ${item.answerScore}/100
                                &nbsp; | &nbsp;
                                Communication:
                                ${item.communicationScore}/100
                            </p>

                        </div>

                        <div class="list-score">
                            ${item.finalScore}/100
                        </div>

                    </div>
                `;

            })
            .join("");
}


/* ---------- SAFE HTML ---------- */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ---------- LOAD DASHBOARD ---------- */

function loadDashboard() {

    updateDashboard();
}


/* ---------- LOAD HISTORY ---------- */

function loadHistory() {

    updateHistoryList();
}


/* ---------- CLEAR HISTORY ---------- */

function clearInterviewHistory() {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete all interview history?"
        );


    if (!confirmDelete) {
        return;
    }


    localStorage.removeItem(
        "interviewMateHistory"
    );


    updateDashboard();

    updateHistoryList();

    alert(
        "Interview history deleted."
    );
}
/* =====================================================
   InterviewMate AI
   SCRIPT.JS - PART 6
   Final Connection + Speaking Metrics + Bug Fixes
   ===================================================== */


/* =====================================================
   1. CURRENT ANSWER MODE
   ===================================================== */

let currentAnswerMode = "type";


/* =====================================================
   2. IMPROVED ANSWER MODE FUNCTION
   ===================================================== */

function setAnswerMode(mode) {

    currentAnswerMode = mode;

    const typeTab = document.getElementById("typeTab");
    const speakTab = document.getElementById("speakTab");

    const typeAnswerBox = document.getElementById("typeAnswerBox");
    const voiceBox = document.getElementById("voiceBox");

    if (!typeTab || !speakTab || !typeAnswerBox || !voiceBox) {
        return;
    }

    if (mode === "type") {

        typeTab.classList.add("active");
        speakTab.classList.remove("active");

        typeAnswerBox.classList.remove("hidden");
        voiceBox.classList.add("hidden");

        if (isSpeaking) {
            stopSpeechRecognition();
        }

    } else {

        speakTab.classList.add("active");
        typeTab.classList.remove("active");

        voiceBox.classList.remove("hidden");
        typeAnswerBox.classList.add("hidden");
    }
}


/* =====================================================
   3. FILLER WORD COUNT
   ===================================================== */

function countFillerWords(text) {

    if (!text) {
        return 0;
    }

    const fillerPattern =
        /\b(um|uh|hmm|like|actually|basically|you know|so|okay)\b/gi;

    const matches = text.match(fillerPattern);

    return matches ? matches.length : 0;
}


/* =====================================================
   4. SPEAKING SPEED CALCULATION
   ===================================================== */

function calculateSpeakingMetrics(answer, seconds) {

    const cleanAnswer = answer.trim();

    if (cleanAnswer === "") {
        return {
            wordCount: 0,
            speakingSpeed: 0,
            fillerCount: 0
        };
    }

    const words = cleanAnswer.split(/\s+/);

    const wordCount = words.length;

    const fillerCount = countFillerWords(cleanAnswer);

    let speakingSpeed = 0;

    if (seconds > 0) {

        const minutes = seconds / 60;

        speakingSpeed = Math.round(wordCount / minutes);
    }

    return {
        wordCount: wordCount,
        speakingSpeed: speakingSpeed,
        fillerCount: fillerCount
    };
}


/* =====================================================
   5. IMPROVED COMMUNICATION SCORE
   ===================================================== */

function calculateCommunicationScore(answer) {

    if (!answer || answer.trim() === "") {
        return 0;
    }

    const metrics = calculateSpeakingMetrics(
        answer,
        answerSeconds
    );

    let score = 50;

    const wordCount = metrics.wordCount;
    const fillerCount = metrics.fillerCount;

    /* Answer length */

    if (wordCount >= 20) {
        score += 10;
    }

    if (wordCount >= 40) {
        score += 10;
    }

    if (wordCount >= 70) {
        score += 5;
    }


    /* Filler words */

    if (fillerCount === 0) {
        score += 10;
    }

    if (fillerCount >= 3) {
        score -= 5;
    }

    if (fillerCount >= 6) {
        score -= 10;
    }


    /* Structure words */

    const structureWords =
        /\b(first|second|because|therefore|however|finally|also|for example)\b/gi;

    if (structureWords.test(answer)) {
        score += 10;
    }


    /* Sentence punctuation */

    if (/[.!?]/.test(answer)) {
        score += 5;
    }


    /* Spoken answer speed */

    if (currentAnswerMode === "speak" && metrics.speakingSpeed > 0) {

        /*
           Approximate speaking speed.
           Ideal range used for feedback:
           110 - 160 words per minute.
        */

        if (
            metrics.speakingSpeed >= 110 &&
            metrics.speakingSpeed <= 160
        ) {
            score += 10;
        }

        else if (
            metrics.speakingSpeed >= 90 &&
            metrics.speakingSpeed <= 180
        ) {
            score += 5;
        }

        else {
            score -= 5;
        }
    }

    score = Math.max(10, Math.min(100, score));

    return score;
}


/* =====================================================
   6. IMPROVED FEEDBACK
   ===================================================== */

function generateFeedback(answer, question, answerScore, communicationScore) {

    const metrics = calculateSpeakingMetrics(
        answer,
        answerSeconds
    );

    let strengths = [];
    let improvements = [];
    let communicationFeedback = "";


    /* -------------------------
       Answer strengths
       ------------------------- */

    if (answer.length >= 80) {

        strengths.push(
            "Your answer contains good detail."
        );

    } else if (answer.length >= 40) {

        strengths.push(
            "Your answer has a reasonable amount of detail."
        );

    } else {

        improvements.push(
            "Try to give a more detailed answer."
        );
    }


    /* -------------------------
       Score based feedback
       ------------------------- */

    if (answerScore >= 80) {

        strengths.push(
            "Your answer is relevant and well explained."
        );

    } else if (answerScore >= 60) {

        strengths.push(
            "Your answer covers some important points."
        );

    } else {

        improvements.push(
            "Try to include more relevant points related to the question."
        );
    }


    /* -------------------------
       Filler words
       ------------------------- */

    if (metrics.fillerCount === 0) {

        communicationFeedback +=
            "You used very few filler words. ";

    } else {

        communicationFeedback +=
            "Try to reduce filler words such as 'um', 'uh', 'like' and 'basically'. ";
    }


    /* -------------------------
       Speaking speed
       ------------------------- */

    if (
        currentAnswerMode === "speak" &&
        metrics.speakingSpeed > 0
    ) {

        communicationFeedback +=
            "Approximate speaking speed: " +
            metrics.speakingSpeed +
            " words per minute. ";

        if (metrics.speakingSpeed < 90) {

            improvements.push(
                "Your speaking pace appears slow. Try to speak a little more naturally."
            );

        } else if (metrics.speakingSpeed > 180) {

            improvements.push(
                "Your speaking pace appears fast. Try to slow down slightly."
            );

        } else {

            strengths.push(
                "Your speaking pace is in a good range."
            );
        }
    }


    /* -------------------------
       Communication score
       ------------------------- */

    if (communicationScore >= 80) {

        communicationFeedback +=
            "Your communication is clear and confident.";

    } else if (communicationScore >= 60) {

        communicationFeedback +=
            "Your communication is good, but you can improve clarity and structure.";

    } else {

        communicationFeedback +=
            "Focus on speaking clearly, using complete sentences and organizing your answer.";
    }


    /* -------------------------
       Default improvements
       ------------------------- */

    if (improvements.length === 0) {

        improvements.push(
            "Keep practicing to make your answers more confident and structured."
        );
    }


    /* -------------------------
       Final strings
       ------------------------- */

    return {

        strengths: strengths.join(" "),

        improvements: improvements.join(" "),

        communicationFeedback: communicationFeedback,

        suggestedAnswer: createSuggestedAnswer(question)
    };
}


/* =====================================================
   7. FIX NEXT QUESTION
   Prevent duplicate answer saving
   ===================================================== */

function nextQuestion() {

    interviewData.currentQuestion++;

    if (
        interviewData.currentQuestion >=
        interviewData.totalQuestions
    ) {

        finishInterview();

        return;
    }

    showPage("interview");

    loadInterviewQuestion();
}


/* =====================================================
   8. RESET INTERVIEW BEFORE STARTING NEW INTERVIEW
   ===================================================== */

const originalStartInterview = startInterview;

startInterview = function () {

    currentQuestions = [];

    interviewData.answers = [];

    interviewData.currentQuestion = 0;

    interviewData.totalAnswerScore = 0;

    interviewData.totalCommunicationScore = 0;

    currentAnswer = "";

    answerSeconds = 0;

    interviewSeconds = 0;

    currentAnswerMode = "type";

    originalStartInterview();
};


/* =====================================================
   9. PAGE CHANGE CONNECTION
   ===================================================== */

const originalShowPage = showPage;

showPage = function (pageId) {

    originalShowPage(pageId);


    if (pageId === "dashboard") {

        updateDashboard();
    }


    if (pageId === "history") {

        updateHistoryList();
    }


    if (pageId === "profile") {

        updateUserName();
    }
};


/* =====================================================
   10. MOBILE MENU BUTTON
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const mobileMenuBtn =
        document.querySelector(".mobile-menu-btn");

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            toggleMobileMenu
        );
    }
});


/* =====================================================
   11. INITIALIZE SPEECH RECOGNITION
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setupSpeechRecognition();

});


/* =====================================================
   12. UPDATE DASHBOARD WHEN PAGE OPENS
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    updateDashboard();

    updateHistoryList();

    updateUserName();

});


/* =====================================================
   13. STOP TIMERS WHEN PAGE IS CLOSED
   ===================================================== */

window.addEventListener("beforeunload", function () {

    if (timerInterval) {

        clearInterval(timerInterval);
    }

    if (answerTimerInterval) {

        clearInterval(answerTimerInterval);
    }

    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log("Speech recognition stopped.");
        }
    }
});


/* =====================================================
   14. CONSOLE MESSAGE
   ===================================================== */

console.log(
    "InterviewMate AI - script.js loaded successfully!"
);

console.log(
    "Frontend JavaScript completed: Part 1 to Part 6."
);
