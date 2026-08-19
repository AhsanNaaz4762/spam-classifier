// ============================================
// SPAMGUARD AI - FRONTEND LOGIC
// ============================================

// FastAPI backend URL
const API_URL = "http://127.0.0.1:8000";


// ============================================
// DOM ELEMENTS
// ============================================

const messageInput = document.getElementById("message");

const analyzeBtn = document.getElementById("analyze-btn");
const clearBtn = document.getElementById("clear-btn");

const characterCount = document.getElementById("character-count");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const resultIcon = document.getElementById("result-icon");
const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");

const confidence = document.getElementById("confidence");
const progress = document.getElementById("progress");

const totalMessages = document.getElementById("total-messages");
const spamCount = document.getElementById("spam-count");
const safeCount = document.getElementById("safe-count");

const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");


// ============================================
// STATISTICS
// ============================================

let stats = {
    total: 0,
    spam: 0,
    safe: 0
};


// ============================================
// LOAD SAVED DATA
// ============================================

function loadStats() {

    const savedStats = localStorage.getItem("spamguard_stats");

    if (savedStats) {
        stats = JSON.parse(savedStats);
    }

    updateStats();
}


// ============================================
// SAVE STATISTICS
// ============================================

function saveStats() {

    localStorage.setItem(
        "spamguard_stats",
        JSON.stringify(stats)
    );
}


// ============================================
// UPDATE STATISTICS UI
// ============================================

function updateStats() {

    totalMessages.textContent = stats.total;
    spamCount.textContent = stats.spam;
    safeCount.textContent = stats.safe;
}


// ============================================
// CHARACTER COUNTER
// ============================================

messageInput.addEventListener("input", () => {

    const length = messageInput.value.length;

    characterCount.textContent = `${length} / 1000`;

});


// ============================================
// CLEAR INPUT
// ============================================

clearBtn.addEventListener("click", () => {

    messageInput.value = "";

    characterCount.textContent = "0 / 1000";

    result.classList.add("hidden");

    messageInput.focus();

});


// ============================================
// ANALYZE MESSAGE
// ============================================

analyzeBtn.addEventListener("click", analyzeMessage);


async function analyzeMessage() {

    const message = messageInput.value.trim();


    // Empty message check
    if (!message) {

        messageInput.focus();

        alert("Please enter a message first.");

        return;
    }


    // Show loading
    result.classList.add("hidden");

    loading.classList.remove("hidden");

    analyzeBtn.disabled = true;

    analyzeBtn.style.opacity = "0.6";


    try {

        // Send message to FastAPI
        const response = await fetch(
            `${API_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            }
        );


        // Check API response
        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();


        console.log("API Response:", data);


        // Hide loading
        loading.classList.add("hidden");

        // Show result
        showResult(data);


        // Update statistics
        updateStatistics(data);


        // Add history
        addToHistory(
            message,
            data
        );


    } catch (error) {

        console.error(
            "Prediction Error:",
            error
        );

        loading.classList.add("hidden");

        alert(
            "Unable to connect to the AI server.\n\n" +
            "Make sure your FastAPI backend is running."
        );

    }


    // Restore button
    analyzeBtn.disabled = false;

    analyzeBtn.style.opacity = "1";

}


// ============================================
// SHOW RESULT
// ============================================

function showResult(data) {

    result.classList.remove("hidden");


    /*
        Expected backend response:

        {
            "prediction": "spam",
            "confidence": 0.98
        }

        OR

        {
            "prediction": "ham",
            "confidence": 0.95
        }
    */


    const prediction =
        String(data.prediction).toLowerCase();


    let confidenceValue =
        Number(data.confidence);


    // If backend returns 0.98
    if (confidenceValue <= 1) {
        confidenceValue *= 100;
    }


    confidenceValue =
        Math.round(confidenceValue * 10) / 10;


    confidence.textContent =
        `${confidenceValue}%`;

    progress.style.width =
        `${confidenceValue}%`;


    // ========================================
    // SPAM
    // ========================================

    if (
        prediction === "spam" ||
        prediction === "1"
    ) {

        resultIcon.textContent = "⚠";

        resultIcon.style.background =
            "rgba(255, 93, 108, 0.1)";

        resultIcon.style.color =
            "#ff5d6c";

        resultTitle.textContent =
            "Spam Detected";

        resultTitle.style.color =
            "#ff6b78";

        progress.style.background =
            "#ff5d6c";

        resultDescription.textContent =
            "This message appears to be spam or an unsolicited message. Be careful before interacting with links or sharing personal information.";

    }


    // ========================================
    // HAM / SAFE
    // ========================================

    else {

        resultIcon.textContent = "✓";

        resultIcon.style.background =
            "rgba(40, 209, 124, 0.1)";

        resultIcon.style.color =
            "#28d17c";

        resultTitle.textContent =
            "Not Spam";

        resultTitle.style.color =
            "#28d17c";

        progress.style.background =
            "#28d17c";

        resultDescription.textContent =
            "This message appears to be a legitimate message and was classified as safe by the AI model.";

    }

}


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics(data) {

    const prediction =
        String(data.prediction).toLowerCase();


    stats.total++;


    if (
        prediction === "spam" ||
        prediction === "1"
    ) {

        stats.spam++;

    } else {

        stats.safe++;

    }


    saveStats();

    updateStats();

}


// ============================================
// HISTORY
// ============================================

function addToHistory(message, data) {

    const prediction =
        String(data.prediction).toLowerCase();


    const historyItem =
        document.createElement("div");

    historyItem.className =
        "history-item";


    const messageElement =
        document.createElement("div");

    messageElement.className =
        "history-message";

    messageElement.textContent =
        message;


    const badge =
        document.createElement("span");

    badge.className =
        "history-badge";


    if (
        prediction === "spam" ||
        prediction === "1"
    ) {

        badge.classList.add("spam");

        badge.textContent =
            "SPAM";

    } else {

        badge.classList.add("ham");

        badge.textContent =
            "SAFE";

    }


    historyItem.appendChild(
        messageElement
    );

    historyItem.appendChild(
        badge
    );


    // Remove empty history message
    const empty =
        historyList.querySelector(
            ".empty-history"
        );

    if (empty) {
        empty.remove();
    }


    historyList.prepend(
        historyItem
    );


    // Keep only latest 10
    while (
        historyList.children.length > 10
    ) {

        historyList.removeChild(
            historyList.lastChild
        );

    }

}


// ============================================
// CLEAR HISTORY
// ============================================

clearHistoryBtn.addEventListener(
    "click",
    () => {

        historyList.innerHTML = `
            <div class="empty-history">
                <div>📭</div>
                <p>No messages analyzed yet.</p>
                <span>
                    Your analysis history will appear here.
                </span>
            </div>
        `;

    }
);


// ============================================
// ENTER KEY SHORTCUT
// ============================================

messageInput.addEventListener(
    "keydown",
    (event) => {

        // Ctrl + Enter
        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            analyzeMessage();

        }

    }
);


// ============================================
// INITIALIZE
// ============================================

loadStats();