/* =====================================================
   InterviewMate AI
   SERVER.JS - PART 1/6
   Basic Node.js Server
   ===================================================== */

const http = require("http");

const PORT = 3000;
/* =====================================================
   SERVER.JS - PART 5/6
   API Routes
   ===================================================== */


/* =====================================================
   REQUEST HANDLER
   ===================================================== */

async function requestHandler(req, res) {

    /* ---------------------------------------------
       CORS
       --------------------------------------------- */

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    /* ---------------------------------------------
       OPTIONS
       --------------------------------------------- */

    if (req.method === "OPTIONS") {

        res.writeHead(204);

        res.end();

        return;
    }


    /* ---------------------------------------------
       HOME API
       --------------------------------------------- */

    if (
        req.url === "/" &&
        req.method === "GET"
    ) {

        sendJSON(res, 200, {

            success: true,

            message:
                "InterviewMate AI Backend is running!"

        });

        return;
    }


    /* ---------------------------------------------
       ANALYZE ANSWER API
       --------------------------------------------- */

    if (
        req.url === "/api/analyze" &&
        req.method === "POST"
    ) {

        try {

            const data =
                await getRequestBody(req);


            /* Validate */

            const validation =
                validateAnswerData(data);


            if (!validation.valid) {

                sendJSON(res, 400, {

                    success: false,

                    message:
                        validation.message

                });

                return;
            }


            /* Analyze */

            const result =
                createAnalysisResponse(
                    data.question,
                    data.answer
                );


            /* Send result */

            sendJSON(
                res,
                200,
                result
            );


        } catch (error) {

            console.error(
                "Analysis Error:",
                error
            );


            sendJSON(res, 500, {

                success: false,

                message:
                    "Unable to analyze answer."

            });

        }

        return;
    }


    /* ---------------------------------------------
       404
       --------------------------------------------- */

    sendJSON(res, 404, {

        success: false,

        message:
            "Route not found"

    });

}


/* =====================================================
   CREATE SERVER
   ===================================================== */

const server =
    http.createServer(
        requestHandler
    );


/* =====================================================
   NOTE
   =====================================================

   पुढील Parts मध्ये:
   Part 2 → Request Data
   Part 3 → Answer Analysis
   Part 4 → AI Analysis
   Part 5 → API Routes
   Part 6 → Server Start
   ===================================================== */
/* =====================================================
   SERVER.JS - PART 2/6
   Request Data Helper
   ===================================================== */


/* =====================================================
   READ REQUEST BODY
   ===================================================== */

function getRequestBody(req) {

    return new Promise(function(resolve, reject) {

        let body = "";

        req.on("data", function(chunk) {

            body += chunk.toString();

        });

        req.on("end", function() {

            try {

                if (body === "") {

                    resolve({});

                    return;
                }

                const data = JSON.parse(body);

                resolve(data);

            } catch (error) {

                reject(error);

            }

        });

        req.on("error", function(error) {

            reject(error);

        });

    });

}


/* =====================================================
   SEND JSON RESPONSE
   ===================================================== */

function sendJSON(res, statusCode, data) {

    res.writeHead(statusCode, {

        "Content-Type":
            "application/json"

    });

    res.end(
        JSON.stringify(data)
    );

}
/* =====================================================
   SERVER.JS - PART 3/6
   Answer Analysis
   ===================================================== */


/* =====================================================
   FILLER WORDS
   ===================================================== */

function countFillerWords(answer) {

    const fillers = [
        "um",
        "uh",
        "like",
        "actually",
        "basically",
        "you know",
        "hmm"
    ];

    const text = answer.toLowerCase();

    let count = 0;

    fillers.forEach(function(word) {

        const regex =
            new RegExp("\\b" + word + "\\b", "g");

        const matches =
            text.match(regex);

        if (matches) {

            count += matches.length;

        }

    });

    return count;
}


/* =====================================================
   ANSWER SCORE
   ===================================================== */

function calculateAnswerScore(answer, question) {

    const words =
        answer.trim().split(/\s+/);

    const wordCount = words.length;

    let score = 30;


    /* Answer length */

    if (wordCount >= 20) {

        score += 20;

    }

    if (wordCount >= 40) {

        score += 15;

    }

    if (wordCount >= 60) {

        score += 10;

    }


    /* Question keyword matching */

    const questionWords =
        question
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .split(/\s+/)
            .filter(function(word) {

                return word.length > 3;

            });


    const answerText =
        answer.toLowerCase();


    let matchedKeywords = 0;


    questionWords.forEach(function(word) {

        if (answerText.includes(word)) {

            matchedKeywords++;

        }

    });


    if (matchedKeywords >= 1) {

        score += 10;

    }

    if (matchedKeywords >= 2) {

        score += 10;

    }


    /* Short answer penalty */

    if (wordCount < 8) {

        score -= 20;

    }


    /* Limit score */

    if (score > 100) {

        score = 100;

    }

    if (score < 10) {

        score = 10;

    }


    return score;

}


/* =====================================================
   COMMUNICATION SCORE
   ===================================================== */

function calculateCommunicationScore(answer) {

    const words =
        answer.trim().split(/\s+/);

    const wordCount = words.length;

    const fillerCount =
        countFillerWords(answer);


    let score = 70;


    /* Good answer length */

    if (wordCount >= 20) {

        score += 10;

    }


    /* Very good length */

    if (wordCount >= 40) {

        score += 10;

    }


    /* Too short */

    if (wordCount < 8) {

        score -= 25;

    }


    /* Filler words */

    score -= fillerCount * 3;


    /* Structure words */

    const structureWords = [
        "first",
        "second",
        "because",
        "therefore",
        "finally",
        "for example",
        "however"
    ];


    structureWords.forEach(function(word) {

        if (
            answer
                .toLowerCase()
                .includes(word)
        ) {

            score += 2;

        }

    });


    /* Limit */

    if (score > 100) {

        score = 100;

    }

    if (score < 10) {

        score = 10;

    }


    return score;

}


/* =====================================================
   STRENGTHS
   ===================================================== */

function generateStrengths(answer) {

    const strengths = [];

    const wordCount =
        answer.trim().split(/\s+/).length;

    const fillerCount =
        countFillerWords(answer);


    if (wordCount >= 30) {

        strengths.push(
            "You provided a detailed answer."
        );

    } else if (wordCount >= 15) {

        strengths.push(
            "Your answer has reasonable detail."
        );

    }


    if (fillerCount === 0) {

        strengths.push(
            "Good use of clear language with no major filler words."
        );

    }


    if (
        answer.toLowerCase().includes("because") ||
        answer.toLowerCase().includes("for example")
    ) {

        strengths.push(
            "You supported your answer with explanation or example."
        );

    }


    if (strengths.length === 0) {

        strengths.push(
            "You attempted the question and expressed your idea."
        );

    }


    return strengths;

}


/* =====================================================
   IMPROVEMENTS
   ===================================================== */

function generateImprovements(answer) {

    const improvements = [];

    const wordCount =
        answer.trim().split(/\s+/).length;

    const fillerCount =
        countFillerWords(answer);


    if (wordCount < 15) {

        improvements.push(
            "Try to give a more detailed answer."
        );

    }


    if (fillerCount > 0) {

        improvements.push(
            "Reduce filler words such as um, uh, like and basically."
        );

    }


    if (
        !answer.toLowerCase().includes("because") &&
        !answer.toLowerCase().includes("example")
    ) {

        improvements.push(
            "Add a reason or a simple example to make your answer stronger."
        );

    }


    improvements.push(
        "Keep your answer structured and easy to understand."
    );


    return improvements;

}


/* =====================================================
   COMMUNICATION FEEDBACK
   ===================================================== */

function generateCommunicationFeedback(answer) {

    const fillerCount =
        countFillerWords(answer);

    const wordCount =
        answer.trim().split(/\s+/).length;


    let feedback = "";


    if (fillerCount === 0) {

        feedback +=
            "Your answer has good fluency. ";

    } else {

        feedback +=
            "Try to reduce filler words. ";

    }


    if (wordCount < 15) {

        feedback +=
            "Speak in slightly more detail. ";

    } else {

        feedback +=
            "Your answer has a reasonable amount of detail. ";

    }


    feedback +=
        "Use a clear beginning, main point and conclusion.";


    return feedback;

}


/* =====================================================
   SUGGESTED ANSWER
   ===================================================== */

function createSuggestedAnswer(question) {

    const q =
        question.toLowerCase();


    if (q.includes("tell me about yourself")) {

        return "My name is Pooja. I am a BCS student interested in web development. I have learned HTML, CSS and JavaScript, and I am also learning Node.js. I have created projects such as a portfolio website, to-do list and expense tracker. I am a quick learner and I want to improve my technical and communication skills.";

    }


    if (q.includes("strength")) {

        return "My strengths are that I am a quick learner, hardworking and willing to learn new technologies. I stay focused on my work and try to improve my skills through practice.";

    }


    if (q.includes("why should we hire")) {

        return "You should hire me because I am willing to learn, I have a strong interest in web development and I am ready to work hard. I can use my existing skills and continue learning new technologies.";

    }


    if (q.includes("html")) {

        return "HTML stands for HyperText Markup Language. It is used to create the structure of web pages using elements such as headings, paragraphs, links, images and forms.";

    }


    if (q.includes("css")) {

        return "CSS stands for Cascading Style Sheets. It is used to style and design web pages. CSS can control colors, fonts, spacing, layouts, responsiveness and animations.";

    }


    if (
        q.includes("javascript") ||
        q.includes("java script")
    ) {

        return "JavaScript is a programming language mainly used to make web pages interactive and dynamic. It can handle events, manipulate the DOM, validate forms and communicate with backend APIs.";

    }


    if (q.includes("node")) {

        return "Node.js is a JavaScript runtime environment that allows JavaScript to run outside the browser. It is commonly used to build backend servers and APIs.";

    }


    return "A good answer should directly address the question, explain the main point clearly, provide a relevant example and finish with a short conclusion.";

}
/* =====================================================
   SERVER.JS - PART 4/6
   AI Analysis Function
   ===================================================== */


/* =====================================================
   COMPLETE ANSWER ANALYSIS
   ===================================================== */

function analyzeAnswer(question, answer) {

    const answerScore =
        calculateAnswerScore(
            answer,
            question
        );

    const communicationScore =
        calculateCommunicationScore(
            answer
        );

    const strengths =
        generateStrengths(answer);

    const improvements =
        generateImprovements(answer);

    const communicationFeedback =
        generateCommunicationFeedback(
            answer
        );

    const suggestedAnswer =
        createSuggestedAnswer(
            question
        );

    const fillerWords =
        countFillerWords(answer);

    return {

        answerScore:
            answerScore,

        communicationScore:
            communicationScore,

        strengths:
            strengths,

        improvements:
            improvements,

        communicationFeedback:
            communicationFeedback,

        suggestedAnswer:
            suggestedAnswer,

        fillerWords:
            fillerWords

    };

}


/* =====================================================
   VALIDATE ANSWER DATA
   ===================================================== */

function validateAnswerData(data) {

    if (!data) {

        return {
            valid: false,
            message:
                "Request data is missing."
        };

    }


    if (
        !data.question ||
        typeof data.question !== "string"
    ) {

        return {
            valid: false,
            message:
                "Question is required."
        };

    }


    if (
        !data.answer ||
        typeof data.answer !== "string"
    ) {

        return {
            valid: false,
            message:
                "Answer is required."
        };

    }


    if (
        data.answer.trim().length === 0
    ) {

        return {
            valid: false,
            message:
                "Answer cannot be empty."
        };

    }


    return {
        valid: true
    };

}


/* =====================================================
   AI ANALYSIS RESPONSE
   ===================================================== */

function createAnalysisResponse(
    question,
    answer
) {

    const analysis =
        analyzeAnswer(
            question,
            answer
        );


    return {

        success: true,

        message:
            "Answer analyzed successfully.",

        analysis: analysis

    };

}
/* =====================================================
   SERVER.JS - PART 6/6
   Start Server
   ===================================================== */


/* =====================================================
   START SERVER
   ===================================================== */

server.listen(
    PORT,
    function() {

        console.log(
            "================================="
        );

        console.log(
            "InterviewMate AI Backend"
        );

        console.log(
            "Server running on:"
        );

        console.log(
            "http://localhost:" + PORT
        );

        console.log(
            "================================="
        );

    }
);