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
    "Government Subsidy 🏛️", 
    "Net Metering Info 🔄", 
    "Solar for Home 🏡", 
    "Solar for Business 🏢", 
    "Cleaning & Service 🔧", 
    "Warranty & Panel Life 🛡️", 
    "Rain & Weather Safety 🌧️",
    "Talk to an Expert 📞"
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
// NATURAL, CUSTOMER-FIRST WELCOME GREETING
// ==========================================================================
function initializeWelcomeGreeting() {
    chatBox.innerHTML = `
    <div class="bot-message">
        <div class="message-content">
            <div class="company-logo-container" style="margin-bottom: 12px; display: flex; align-items: center;">
                <img src="logo.png" alt="Soltech Energy Logo" class="chat-company-logo" style="max-height: 40px; width: auto; object-fit: contain;" onerror="this.parentNode.style.display='none';">
            </div>
            <strong>Hi there! Welcome to Soltech Energy. 👋</strong>
            <br><br>
            We are Jaipur's leading solar team, helping families and businesses switch to clean energy and clear out those heavy monthly power bills. 
            <br><br>
            💡 <strong>A quick note on pricing:</strong> Every roof gets a different amount of sunlight, shadow, and needs a specific system size. To make sure you get an 100% accurate price tailored to your roof, we don't use generic calculators here. Instead, our engineers share direct, real-time quotes over a quick WhatsApp chat!
            <br><br>
            Feel free to type any question below, click one of our popular topics, or tap the green <strong>WhatsApp button</strong> at the bottom to talk to our team right away!
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
// REALISTIC TEXT PROCESSING ENGINE (REMOVED STIFF REPLIES)
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.toLowerCase().trim();
    showTyping();
    
    setTimeout(() => {
        hideTyping();
        
        let targetResponse = "";
        
        // Conversational responses tailored to what users actually mean
        if (cleanText.includes("subsidy")) {
            targetResponse = "🏛️ <strong>How do solar subsidies work?</strong><br><br>Great question! The government offers great financial subsidies to help lower the upfront cost of your solar panels, but these strictly apply to residential homes. Since government slabs and application rules can update, tap the green <strong>WhatsApp button</strong> above so our team can check the exact current subsidy discount available for your home setup!";
        } else if (cleanText.includes("price") || cleanText.includes("cost") || cleanText.includes("calculator") || cleanText.includes("how much") || cleanText.includes("quote")) {
            targetResponse = "💰 <strong>Looking for a price estimate?</strong><br><br>The exact investment depends entirely on your daily electricity usage and how much open space you have on your roof. Rather than giving you a generic online guess that turns out wrong, we'd love to calculate a free, precise savings report for you. Tap the green <strong>WhatsApp button</strong> above to connect directly with our local engineering desk!";
        } else if (cleanText.includes("net metering") || cleanText.includes("jvvnl") || cleanText.includes("meter")) {
            targetResponse = "🔄 <strong>What is Net Metering?</strong><br><br>Net metering is a system where your extra solar power goes back to the JVVNL grid layout. At the end of the month, JVVNL subtracts that from your bill! Our team handles 100% of the paperwork and permissions for this. Tap the green WhatsApp bar to see how we set this up for your property.";
        } else if (cleanText.includes("weather") || cleanText.includes("rain") || cleanText.includes("cloud")) {
            targetResponse = "🌧️ <strong>Do panels work during monsoons or winters?</strong><br><br>Yes, they absolutely do! Modern solar systems run on light, not heat, so they keep producing clean energy even when it is cloudy or rainy. Plus, the structure acts like a protective shield for your roof. Want to see past installation examples here in Jaipur? Tap the green WhatsApp button above to chat with us!";
        } else {
            targetResponse = `🤖 <strong>Got your message!</strong><br><br>To give you the most detailed answer about system sizes, warranties, or custom installation options for your property here in Jaipur, please tap the green <strong>WhatsApp button</strong> above. A real expert from our team will take over and answer you instantly!`;
        }

        addBotMessage(targetResponse, true);
    }, 700);
}

// ==========================================================================
// CORE WHATSAPP REDIRECT AND AUTOMATED BACKEND INTEGRATION
// ==========================================================================
function launchWhatsAppLeadGen() {
    const waBaseURL = "https://wa.me/";
    const waFullLink = `${waBaseURL}${CRM_SETTINGS.WhatsAppNumber}/?text=${encodeURIComponent(CRM_SETTINGS.InitialHiMessage)}`;
    
    console.log(`⚡ CRM CORE: Opening WhatsApp channel.`);
    notifyCRMofWhatsAppClick(CRM_SETTINGS.DefaultLeadLocation, "Chatbot_Friendly_Widget");
    window.open(waFullLink, '_blank');
}

async function notifyCRMofWhatsAppClick(locationTag, sourceTag) {
    try {
        const leadPayload = {
            source: sourceTag,
            location_tag: locationTag,
            timestamp: new Date().toISOString(),
            status: "WhatsApp Chat Started"
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
        console.log("⚡ Note: Lead data stored safely in local browser memory.");
    }
}

// ==========================================================================
// INTERACTIVE COMPONENT UTILITIES
// ==========================================================================
function sendMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    userInput.value = ""; 
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
    if (footerWhitespaceCta) {
        footerWhitespaceCta.addEventListener("click", launchWhatsAppLeadGen);
    }

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
