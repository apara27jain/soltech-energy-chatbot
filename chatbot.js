// ==========================================================================
// Soltech Energy Chatbot Engine
// chatbot.js [RE-ENABLED TYPING + AUTOMATED WHATSAPP ROUTING]
// ==========================================================================

const chatToggle = document.getElementById("chat-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const minimizeChat = document.getElementById("minimize-chat");
const refreshChat = document.getElementById("refresh-chat");
const chatBox = document.getElementById("chat-box");

// Restored DOM Elements for Typing Input Box Context
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const footerWhitespaceCta = document.getElementById("footer-whatsapp-cta");

// =====================================
// STATE CONFIGURATION & SETTINGS
// =====================================
const CRM_SETTINGS = {
    // ⚡ SOLTECH CORPORATE WHATSAPP NUMBER
    WhatsAppNumber: "918239573979", 
    
    // ⚡ PRE-FILLED MESSAGE POPULATED ON USER'S PHONE
    InitialHiMessage: "Hi! I want to check solar details for my property.",
    
    // ⚡ JAIPUR LOCAL DATA TAGGING FOR GOOGLE SHEET CRM
    DefaultLeadLocation: "Jaipur", 
    
    LeadStorageWebhook: "http://localhost:5000/api/leads" 
};

const KEYWORD_OPTIONS = [
    "Subsidy Info", 
    "Net Metering", 
    "Residential Setup", 
    "Commercial Setup", 
    "Maintenance & AMC", 
    "Warranty & Life", 
    "Weather Safety",
    "Connect Live"
];

// =====================================
// WINDOW MANAGEMENT
// =====================================
if (chatToggle) {
    chatToggle.addEventListener("click", () => {
        chatbotContainer.classList.toggle("open");
    });
}

if (minimizeChat) {
    minimizeChat.addEventListener("click", () => {
        chatbotContainer.classList.remove("open");
    });
}

// ==========================================================================
// DEFAULT WELCOME INITIALIZER
// ==========================================================================
function initializeWelcomeGreeting() {
    chatBox.innerHTML = `
    <div class="bot-message">
        <div class="message-content">
            <div class="company-logo-container" style="margin-bottom: 12px; display: flex; align-items: center;">
                <img src="logo.png" alt="Soltech Energy Logo" class="chat-company-logo" style="max-height: 40px; width: auto; object-fit: contain;" onerror="this.parentNode.style.display='none';">
            </div>
            <strong>Welcome to Soltech Energy</strong>
            <br><br>
            We are Jaipur's premier solar engineering firm, designing high-yield systems for residential rooftops and commercial enterprises.
            <br><br>
            🤖 Solar system costs vary continuously based on your roof space, shadows, and shifting JVVNL net-metering regulations. To protect your financial accuracy, <strong>we do not display fixed estimates here</strong>. 
            <br><br>
            Feel free to type a question below, click a quick category, or tap the green <strong>WhatsApp button</strong> anytime to link directly with our engineering desk!
        </div>
    </div>
    `;
    injectDynamicInlineButtons();
    scrollBottom();
    saveChat();
}

if (refreshChat) {
    refreshChat.addEventListener("click", () => {
        localStorage.removeItem("Soltech_chat");
        initializeWelcomeGreeting();
    });
}

// ==========================================================================
// TEXT PROCESSING ENGINE (RE-ENABLED TYPING LOGIC)
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.toLowerCase().trim();
    showTyping();
    
    setTimeout(() => {
        hideTyping();
        
        let targetResponse = "";
        
        // Dynamic response parser matching keywords or custom user inputs
        if (cleanText.includes("subsidy")) {
            targetResponse = "🏛️ <strong>Subsidy Status:</strong> National solar subsidies apply strictly to residential grid connections. Because these structural rates alter regularly, tap the green WhatsApp banner above to lock in your verified quote with our team!";
        } else if (cleanText.includes("price") || cleanText.includes("cost") || cleanText.includes("calculator") || cleanText.includes("how much")) {
            targetResponse = "⚡ <strong>Custom Feasibility Pricing:</strong> Solar plant investment parameters rely on your property's shadow profiles and power habits. To generate an accurate engineering blueprint without hectic form-filling, click the green WhatsApp connection banner!";
        } else if (cleanText.includes("net metering") || cleanText.includes("jvvnl")) {
            targetResponse = "🔄 <strong>JVVNL Grid Integration:</strong> Net-metering structures send your extra daytime energy back to the local utility loop. We handle all documentation for this! Let's map your application directly over WhatsApp.";
        } else {
            targetResponse = `🤖 <strong>Query Processed:</strong> For specific system designs, commercial asset sheets, or warranty guidelines in Jaipur, tap the green <strong>WhatsApp banner</strong> to receive instant, verified answers directly on your phone.`;
        }

        addBotMessage(targetResponse, true);
    }, 700);
}

// ==========================================================================
// CORE WHATSAPP REDIRECT AND AUTOMATED HEADERS
// ==========================================================================
function launchWhatsAppLeadGen() {
    const waBaseURL = "https://wa.me/";
    const waFullLink = `${waBaseURL}${CRM_SETTINGS.WhatsAppNumber}/?text=${encodeURIComponent(CRM_SETTINGS.InitialHiMessage)}`;
    
    console.log(`⚡ CRM CORE: Launching auto-lead system to WhatsApp phone app.`);
    
    // Automatically tags incoming traffic background data as Jaipur before dispatching
    notifyCRMofWhatsAppClick(CRM_SETTINGS.DefaultLeadLocation, "Chatbot_Interactive_Widget");

    window.open(waFullLink, '_blank');
}

// Webhook dispatcher for automated CRM Dashboard storage and Google Sheets sync
async function notifyCRMofWhatsAppClick(locationTag, sourceTag) {
    try {
        const leadPayload = {
            source: sourceTag,
            location_tag: locationTag,
            timestamp: new Date().toISOString(),
            status: "WhatsApp Lead Triggered"
        };

        let localLeads = JSON.parse(localStorage.getItem("Soltech_whatsapp_clicks")) || [];
        localLeads.push(leadPayload);
        localStorage.setItem("Soltech_whatsapp_clicks", JSON.stringify(localLeads));

        await fetch(CRM_SETTINGS.LeadStorageWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadPayload)
        });
    } catch (error) {
        console.log("⚠️ Standalone local storage active: Lead buffered securely.");
    }
}

// ==========================================================================
// INTERACTIVE TYPING WIDGET COMPONENT UTILITIES
// ==========================================================================
function sendMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = ""; // Clear input box after typing completes

    processMessage(message);
}

function bindQuickButtons() {
    document.querySelectorAll(".quick-actions-wrapper .quick-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const selectedTopic = e.target.innerText;
            addUserMessage(selectedTopic);
            processMessage(selectedTopic);
        };
    });
}

function injectDynamicInlineButtons() {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());

    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";
    
    KEYWORD_OPTIONS.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quick-btn";
        btn.innerText = opt;
        wrapper.appendChild(btn);
    });

    chatBox.appendChild(wrapper);
    scrollBottom();
    bindQuickButtons();
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

function showTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) typingIndicator.classList.remove("hidden");
}

function hideTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) typingIndicator.classList.add("hidden");
}

function scrollBottom() { chatBox.scrollTop = chatBox.scrollHeight; }
function saveChat() { localStorage.setItem("Soltech_chat", chatBox.innerHTML); }

function loadChat() {
    const chat = localStorage.getItem("Soltech_chat");
    if (chat) { 
        chatBox.innerHTML = chat; 
        injectDynamicInlineButtons();
    } else {
        initializeWelcomeGreeting();
    }
}

// =====================================
// INITIALIZATION EVENT LISTENERS
// =====================================
document.addEventListener("DOMContentLoaded", function() {
    // 1. WhatsApp Button Click Handling
    if (footerWhitespaceCta) {
        footerWhitespaceCta.addEventListener("click", launchWhatsAppLeadGen);
    }

    // 2. Typing Input Event Listeners
    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }

    loadChat();
});
