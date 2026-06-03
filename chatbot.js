// ==========================================================================
// Soltech Energy Chatbot Engine
// chatbot.js [EXPANDED CONVERSION VERSION - FIXED]
// ==========================================================================

const chatToggle = document.getElementById("chat-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const minimizeChat = document.getElementById("minimize-chat");
const refreshChat = document.getElementById("refresh-chat");

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const typingIndicator = document.getElementById("typing-indicator");
const progressFill = document.getElementById("progress-fill");
const leadProgress = document.getElementById("lead-progress");

const calculatorBtn = document.getElementById("calculate-btn");
const calculatorInput = document.getElementById("monthly-bill");
const calculatorResult = document.getElementById("calculator-result");

const calculatorModal = document.getElementById("calculator-modal");
const closeCalculator = document.getElementById("close-calculator");

// =====================================
// STATE CONFIGURATION & SESSION DATA
// =====================================
let currentStep = null;

let leadData = {
    name: "",
    phone: "",
    pincode: "",
    bill: "",
    interest: "",
    leadScore: 0
};

// Expanded array to include the new intuitive buyer assessment pathways seamlessly
const KEYWORD_OPTIONS = [
    "Subsidy", 
    "Net Metering", 
    "Residential Solar", 
    "Commercial Solar", 
    "Maintenance & AMC", 
    "Warranty & Life", 
    "Weather Safety",
    "Get Quote"
];

// =====================================
// WINDOW MANAGEMENT & EVENT HOOKS
// =====================================
chatToggle.addEventListener("click", () => {
    chatbotContainer.classList.toggle("open");
});

minimizeChat.addEventListener("click", () => {
    chatbotContainer.classList.remove("open");
});

// ==========================================================================
// STANDARD DEFAULT GREETING MESSAGE FUNCTION (RUNNING NAME FORMAT)
// ==========================================================================
function initializeWelcomeGreeting() {
    chatBox.innerHTML = `
    <div class="bot-message">
        <div class="message-content">
            <div class="company-logo-container" style="margin-bottom: 12px; display: flex; align-items: center;">
                <img src="logo.png" alt="Soltech Energy Logo" class="chat-company-logo" style="max-height: 40px; width: auto; object-fit: contain;" onerror="this.parentNode.style.display='none';">
            </div>
            <strong>About Soltech Energy</strong>
            <br><br>
            Soltech Energy is Jaipur's premier solar engineering firm, dedicated to transitioning residential rooftops and commercial enterprises toward sustainable, independent power. We specialize in end-to-end solar grid integration, maximizing your environmental impact while drastically optimizing your long-term returns.
            <br><br>
            🤖 I am your dedicated <strong>Soltech Virtual Assistant</strong>, engineered to map out your feasibility metrics, review regional JVVNL net-metering rules, and guide you through state subsidy frameworks.
            <br><br>
            Please select an optimization track below to begin your evaluation:
        </div>
    </div>
    `;
    injectDynamicInlineButtons();
    saveChat();
}

// Reset/Refresh handler explicitly calls our standard layout initializer
refreshChat.addEventListener("click", () => {
    localStorage.removeItem("Soltech_chat");
    leadProgress.classList.add("hidden");
    currentStep = null;
    initializeWelcomeGreeting();
});

// ==========================================================================
// ROUTE HIGH-INTENT INQUIRIES DIRECTLY TO SALES TEAM
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.toLowerCase().trim();
    
    if (cleanText.includes("price") || cleanText.includes("cost") || cleanText.includes("investment") || cleanText.includes("calculator")) {
        addBotMessage(`
            🤖 <strong>Custom Commercial & Residential Evaluations:</strong><br><br>
            Solar investments depend heavily on your specific rooftop structural layout, shadow profiles, and monthly power consumption structural profiles.<br><br>
            To ensure complete financial accuracy, <strong>Soltech Energy does not provide generalized online estimates.</strong><br><br>
            Please click the orange <strong>Get Quote</strong> button below to leave your contact parameters, and our engineering team will calculate a tailored engineering pricing breakdown for your property.
        `, true);
        return;
    }
    
    showTyping();
    setTimeout(() => {
        hideTyping();
        
        const intent = (typeof findBestIntent === "function") ? findBestIntent(userText) : null;

        if (intent) {
            addBotMessage(intent.responses[0], true);
            detectLeadOpportunity(userText);
        } else {
            addBotMessage(`
                🤖 Soltech Knowledge Engine Update:<br><br>
                I could not map that specific phrase accurately. For custom system design metrics, use the orange **Get Quote** button choices.<br><br>
                To speak directly with an execution engineer right now, follow the connection track below:<br>
                📞 <a href="https://wa.me/919999999999?text=Hi%20Soltech,%20I%20need%20custom%20solar%20assistance" target="_blank" style="color: #3b82f6; font-weight: 600; text-decoration: underline;">Connect via WhatsApp Chat</a>
            `, true);
        }
    }, 800);
}

// =====================================
// CORE INPUT UTILITIES
// =====================================
sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function bindQuickButtons() {
    document.querySelectorAll(".quick-actions-wrapper .quick-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            userInput.value = e.target.innerText;
            sendMessage();
        };
    });
}

function injectDynamicInlineButtons() {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());

    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";
    
    KEYWORD_OPTIONS.forEach(opt => {
        const btn = document.createElement("button");
        
        if (opt.toLowerCase() === "get quote") {
            btn.className = "quick-btn orange-quote-btn";
        } else {
            btn.className = "quick-btn";
        }
        
        btn.innerText = opt;
        wrapper.appendChild(btn);
    });

    chatBox.appendChild(wrapper);
    scrollBottom();
    bindQuickButtons();
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = "";

    if (currentStep && KEYWORD_OPTIONS.map(v => v.toLowerCase()).includes(message.toLowerCase()) && message.toLowerCase() !== "get quote") {
        currentStep = null;
        leadProgress.classList.add("hidden");
        addBotMessage("🔄 Redirecting your session context to the requested topic parameter...", true);
    }

    if (handleLeadFlow(message)) {
        return;
    }

    processMessage(message);
}

function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    
    scrollBottom();
    saveChat();
}

function addBotMessage(text, displayButtons = true) {
    const div = document.createElement("div");
    div.className = "bot-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    
    if (displayButtons) {
        injectDynamicInlineButtons();
    } else {
        scrollBottom();
    }
    saveChat();
}

function showTyping() { typingIndicator.classList.remove("hidden"); }
function hideTyping() { typingIndicator.classList.add("hidden"); }

function detectLeadOpportunity(message) {
    const msg = message.toLowerCase();
    const hotWords = ["quote", "quotation", "subsidy", "desktop assessment", "residential", "commercial"];

    if (hotWords.some(word => msg.includes(word)) && !msg.includes("get quote")) {
        setTimeout(() => {
            addBotMessage(`
                📊 Authorized Engineering Estimate Required?<br><br>
                Let's construct your custom savings matrix report right now. Click the orange **Get Quote** button below to map parameters!
            `, true);
        }, 1400);
    }
}

// =====================================
// SYSTEMATIC LEAD FLOW MANAGEMENT
// =====================================
function handleLeadFlow(message) {
    const cleanMsg = message.toLowerCase().trim();
    if (cleanMsg === "get quote" && !currentStep) {
        startLeadFlow();
        return true;
    }

    switch (currentStep) {
        case "name":
            leadData.name = message.trim();
            updateProgress(25);
            currentStep = "phone";
            addBotMessage("📱 Step 2 of 4: Please enter your 10-digit primary mobile contact number.", false);
            return true;

        case "phone":
            if (!/^[6-9]\d{9}$/.test(message.replace(/\s/g, ''))) {
                addBotMessage("⚠️ Validation Failure: Please input a verified 10-digit Indian cellular number starting between digits 6-9.", false);
                return true;
            }
            leadData.phone = message.replace(/\s/g, '');
            updateProgress(50);
            currentStep = "pincode";
            addBotMessage("📍 Step 3 of 4: Enter your 6-digit Jaipur Region Pincode (e.g., 302020) to analyze JVVNL substation allotment.", false);
            return true;

        case "pincode":
            if (!/^(302|303)\d{3}$/.test(message.trim())) {
                addBotMessage("⚠️ Out-of-Service Boundaries: Soltech direct localized setups are currently configured for Jaipur district zone areas. Please input a matching 6-digit pincode starting with 302 / 303.", false);
                return true;
            }
            leadData.pincode = message.trim();
            updateProgress(75);
            currentStep = "bill";
            addBotMessage("⚡ Step 4 of 4: What is your standard average monthly grid electricity consumption bill (in ₹)?", false);
            return true;

        case "bill":
            leadData.bill = message;
            updateProgress(100);
            generateRecommendation();
            return true;
    }
    return false;
}

function startLeadFlow() {
    currentStep = "name";
    leadProgress.classList.remove("hidden");
    updateProgress(0);
    addBotMessage(`
        📋 Initiating Solar Assessment Sequence:<br><br>
        Let's construct your plant sizing matrix. First, please provide your Full Name.
    `, false);
}

function updateProgress(value) {
    progressFill.style.width = value + "%";
}

// =====================================
// ANALYTICAL RECOMMENDATION CALCULATION
// =====================================
function generateRecommendation() {
    const bill = parseInt(leadData.bill.replace(/[^\d]/g, '')) || 0;
    
    let size = "2kW";
    let baseSubsidy = "₹60,000";
    if (bill > 3000) { size = "3kW"; baseSubsidy = "₹78,000"; }
    if (bill > 5000) { size = "5kW"; baseSubsidy = "₹78,000 (Max Residential Cap)"; }
    if (bill > 8000) { size = "8kW"; baseSubsidy = "₹78,000 (Max Residential Cap)"; }
    if (bill > 12000) { size = "10kW+ Commercial Setup"; baseSubsidy = "Commercial Framework (No Residential Subsidy)"; }

    const monthlySaving = Math.round(bill * 0.85);
    leadData.interest = size;
    leadData.leadScore = calculateLeadScore(bill);

    saveLead();

    addBotMessage(`
        🎉 Solar Feasibility Profile Synthesized Successfully!<br><br>
        • Account Holder Name: ${leadData.name}<br>
        • Target Region Pincode: ${leadData.pincode} (Jaipur, RJ)<br>
        • Bill Baseline Metric: ₹${bill}/month<br>
        • ──────────────────────<br>
        ⚡ Recommended Solar Allocation: ${size} Plant System<br>
        📉 Estimated Generation Savings Yield: ~₹${monthlySaving}/month<br>
        🏛️ Estimated Gov Subsidy Offset: ${baseSubsidy}<br><br>
        *An expert solar distribution engineer from Soltech Energy will compile a precise roof capacity analysis and reach out to you within 24 working hours.*
    `, true);

    setTimeout(() => {
        leadProgress.classList.add("hidden");
    }, 4000);
    
    currentStep = null;
}

function calculateLeadScore(bill) {
    let score = 40; 
    if (bill > 3000) score += 20;
    if (bill > 6000) score += 40;
    return score;
}

// =====================================
// SERVER PERSISTENCE DATA POST ROUTE
// =====================================
function saveLead() {
    let leads = JSON.parse(localStorage.getItem("Soltech_leads")) || [];
    leads.push({
        ...leadData,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem("Soltech_leads", JSON.stringify(leads));

    fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
    })
    .then(res => res.json())
    .then(data => console.log("✅ API Success: Balanced dataset pushed to Mongoose model records.", data))
    .catch((err) => {
        console.log("⚠️ Standalone mode: Database offline, buffered lead safely in local context.", err);
    });
}

// =====================================
// CLOSURE MODULE UTILITY BINDINGS
// =====================================
if (closeCalculator && calculatorModal) {
    closeCalculator.addEventListener("click", (e) => {
        e.preventDefault();
        calculatorModal.classList.add("hidden");
        calculatorModal.style.display = "none";
        console.log("Overlay context detached cleanly.");
    });
}

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function saveChat() {
    localStorage.setItem("Soltech_chat", chatBox.innerHTML);
}

function loadChat() {
    const chat = localStorage.getItem("Soltech_chat");
    if (chat) { 
        chatBox.innerHTML = chat; 
        injectDynamicInlineButtons();
    } else {
        // If local storage is empty, initialize the new welcome message automatically!
        initializeWelcomeGreeting();
    }
}

// Initialize application properly
loadChat();