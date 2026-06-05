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
    "Government Subsidy", 
    "Net Metering Info", 
    "Solar for Home", 
    "Solar for Business", 
    "Cleaning & Service", 
    "Warranty & Panel Life", 
    "Rain & Weather Safety",
    "Talk to an Expert"
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
// ==========================================================================
// DEEP-CONVERSION TEXT PROCESSING ENGINE - ALL 8 BUTTON OPTIONS EXPLAINED
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.toLowerCase().trim();
    showTyping();
    
    setTimeout(() => {
        hideTyping();
        
        let targetResponse = "";
        
        // 1. Government Subsidy Button
        if (cleanText.includes("subsidy")) {
            targetResponse = `
                🏛️ <strong>The Complete Guide to Solar Subsidies (PM-Surya Ghar Scheme)</strong><br><br>
                Switching to solar is heavily supported by the government right now. Under the active <strong>PM-Surya Ghar Muft Bijli Yojana</strong>, residential homeowners receive substantial financial assistance directly credited to their bank accounts. Here is how the financial slabs work:
                <br>• <strong>1 kW System:</strong> Receives a fixed subsidy of ₹30,000.
                <br>• <strong>2 kW System:</strong> Receives a fixed subsidy of ₹60,000.
                <br>• <strong>3 kW to 10 kW Systems:</strong> Eligible for the maximum residential subsidy cap of ₹78,000.
                <br><br>
                <strong>The Process:</strong> Soltech Energy takes care of the entire end-to-end process for you—from uploading your documents on the national portal to technical inspections, net-metering setup, and finalizing your subsidy clearance. Please note that these government subsidies apply strictly to independent residential homes and housing societies, not commercial or industrial properties. 
                <br><br>
                Because subsidy slabs, local distribution board approvals, and application structural rules can change depending on your monthly power consumption, getting an expert to map your eligibility saves weeks of paperwork. For any queries or to check your property's direct subsidy layout, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 2. Net Metering Button
        else if (cleanText.includes("net metering") || cleanText.includes("jvvnl")) {
            targetResponse = `
                🔄 <strong>How JVVNL Net Metering Slashing Your Electricity Bills</strong><br><br>
                Net Metering is the secret to getting a zero-rupee electricity bill. It is a specialized, bi-directional meter installed at your property that links your solar plant directly with the JVVNL grid loop. 
                <br><br>
                <strong>How it works:</strong> During the day, your solar panels generate peak electricity. Your home or business consumes what it needs, and any surplus, unused solar energy is automatically exported back into the JVVNL grid. Your net meter records these exported units. At night, when your panels are resting, you draw electricity back from the grid normally. 
                <br><br>
                At the end of the monthly billing cycle, JVVNL subtracts your exported solar units from your imported consumption units. You only pay for the 'Net' difference! If you export more than you use, those credits roll over to the next month to cover future bills. Soltech Energy handles 100% of the complex load sanctions, government approvals, line-man testing, and physical meter replacement for you.
                <br><br>
                Every local substation transformer has a strict structural capacity limit for solar integration, meaning approvals are given on a first-come, first-served basis. For queries regarding your local area grid availability, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 3. Solar for Home Button
        else if (cleanText.includes("home") || cleanText.includes("residential")) {
            targetResponse = `
                🏡 <strong>Residential Solar: Securing Free Electricity for Your Family</strong><br><br>
                Installing a solar power system on your home is one of the smartest financial investments you can make today. It permanently shields your family from rising electricity rates and allows you to run heavy appliances like air conditioners, water geysers, and EV chargers completely guilt-free.
                <br><br>
                <strong>Financial Return:</strong> A premium residential solar system completely pays for itself within just 4 to 5 years through your electricity bill savings. After this brief payback window, the system continues to generate completely free power for the remaining 20+ years of its life, delivering a massive return on investment. 
                <br><br>
                At Soltech Energy, we customize our elevated structural engineering designs to match your rooftop perfectly. This ensures your panels get maximum sunlight exposure while keeping your terrace open, spacious, and fully usable for family activities. We handle everything from civil foundation anchoring to premium electrical safety grounding.
                <br><br>
                Because every home has unique shadow profiles from nearby trees or structures, your exact system capacity needs a custom engineering look. For queries regarding system sizing or structural roof layouts, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 4. Solar for Business Button
        else if (cleanText.includes("business") || cleanText.includes("commercial")) {
            targetResponse = `
                🏢 <strong>Commercial & Industrial Solar: Maximize Corporate Profitability</strong><br><br>
                For businesses, factories, warehouses, schools, and hospitals, day-time electricity is one of the highest fixed operational costs. Because businesses operate primarily during peak daylight hours, your energy consumption aligns perfectly with peak solar generation, making commercial solar an incredibly powerful asset.
                <br><br>
                <strong>The Corporate Benefits:</strong>
                <br>• <strong>Immediate Cost Reduction:</strong> Instantly slash your operational electricity tariff rates by up to 70% to 80%.
                <br>• <strong>Tax Incentives:</strong> Claim massive fiscal benefits through **Accelerated Depreciation** tax write-offs on renewable energy assets.
                <br>• <strong>ESG Compliance:</strong> Elevate your brand value by transitioning into a certified, carbon-neutral green enterprise.
                <br><br>
                Soltech Energy specializes in high-capacity commercial engineering. We utilize heavy-duty, wind-tested galvanized structures, high-efficiency tier-1 string inverters, and specialized data-logging tools so you can monitor your plant's performance in real time.
                <br><br>
                To provide a dependable ROI model, our commercial engineers evaluate your historical billing load profiles and contract demand rules. For queries or to request a formal technical feasibility proposal for your commercial asset, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 5. Cleaning & Service Button
        else if (cleanText.includes("cleaning") || cleanText.includes("service") || cleanText.includes("maintenance")) {
            targetResponse = `
                🔧 <strong>Zero Mechanical Hassle: Solar Maintenance and Cleaning Realities</strong><br><br>
                One of the best engineering features of a grid-tied solar system is that it has **absolutely zero moving parts**. There are no motors, gears, or mechanical components that wear out, break down, or require regular lubrication. This makes solar incredibly reliable and low-maintenance.
                <br><br>
                <strong>The Core Requirement:</strong> The only routine maintenance your system needs to stay at peak generation efficiency is keeping the top glass surface free of dust, dirt, and bird droppings. In a dry city like Jaipur, a simple rinse with clean water using a hose pipe once every two weeks is all it takes to keep your generation numbers high.
                <br><br>
                For customers who want complete peace of mind, Soltech Energy offers comprehensive Annual Maintenance Contracts (AMC). Our professional maintenance teams handle deep cleaning, structural tightness checks, inverter thermal logging, and specialized string-voltage testing to guarantee your plant operates smoothly year after year.
                <br><br>
                Whether you want to learn easy DIY cleaning tips or review our affordable professional AMC plans, we are here to assist. For queries or technical support options, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 6. Warranty & Panel Life Button
        else if (cleanText.includes("warranty") || cleanText.includes("life")) {
            targetResponse = `
                🛡️ <strong>Engineered for Decades: Premium Guarantees and Lifespan Realities</strong><br><br>
                A solar system is a long-term infrastructure investment designed to safeguard your energy security for a generation. Because of this, the components we use are built to premium industrial standards and backed by rock-solid corporate guarantees.
                <br><br>
                <strong>The Warranties You Receive:</strong>
                <br>• <strong>25-Year Linear Performance Warranty:</strong> Panels are guaranteed to maintain high-efficiency output for a quarter of a century, degrading at a minuscule rate of less than 0.7% per year.
                <br>• <strong>10 to 12-Year Product Warranty:</strong> Covers any rare manufacturing defects in the panel materials or glass layout.
                <br>• <strong>5 to 10-Year Inverter Warranty:</strong> Comprehensive coverage on the central solar inverter, with extended upgrade options available.
                <br>• <strong>Structural Warranty:</strong> Soltech provides a dedicated warranty on our hot-dip galvanized mounting structures against rust and environmental wear.
                <br><br>
                We source our materials strictly from Tier-1 globally certified manufacturers to ensure your financial asset delivers safe, consistent returns for decades. For queries regarding our component brands or to view official warranty datasheets, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 7. Rain & Weather Safety Button
        else if (cleanText.includes("weather") || cleanText.includes("rain") || cleanText.includes("safety") || cleanText.includes("cloud")) {
            targetResponse = `
                🌧️ <strong>Monsoons, Storms, and Winter: How Solar Handles Extreme Weather</strong><br><br>
                A very common misunderstanding is that solar panels require blistering hot heat to function, or that they break during monsoon storms. This is factually incorrect. Solar cells run entirely on **light intensity, not ambient heat**. In fact, panels actually operate more efficiently in cooler winter temperatures than in extreme summer peaks!
                <br><br>
                <strong>Monsoon Performance:</strong> During cloudy or rainy days, your panels continue to generate power by capturing diffused sunlight filtering through the cloud cover. While generation is naturally lower than on a bright summer day, it never drops to zero. Rain is actually beneficial because it naturally flushes away accumulated dust from the glass, boosting your generation as soon as the sun breaks through!
                <br><br>
                <strong>Structural Safety:</strong> Soltech Energy uses impact-resistant, tempered front glass designed to easily withstand heavy downpours. Our structural mounting frames are anchored using high-grade chemical fast-enablers or heavy concrete blocks engineered to comfortably withstand intense local dust storms and high wind speeds.
                <br><br>
                We prioritize structural safety above all else, ensuring your roof remains secure and leak-free. For queries regarding our weather-proof structures or safety earthing systems, feel free to contact us via WhatsApp by clicking the green box below!
            `;
        } 
        // 8. Talk to an Expert / Price / Catch-all Fallback Button
        else {
            targetResponse = `
                📞  <strong>Tailored Engineering: Get a Perfect Quote for Your Property</strong><br><br>
                Every rooftop is a unique engineering canvas. The right solar plant for you depends on several variables: your monthly electricity bill, your total shadow-free rooftop area, the orientation of your building, and the structural strength of your roof. 
                <br><br>
                Because solar is a precisely customized asset, static online price calculators are often inaccurate and misleading. Shifting market rates for hardware and updating regional grid policies mean that a personalized assessment is always the safest way to plan your investment.
                <br><br>
                Our engineering team offers free, remote desktop assessments. By looking at a copy of your electricity bill and a quick view of your roof, we can map out a precise blueprint showing exactly how many panels you need, your total investment cost, and your exact monthly financial savings.
                <br><br>
                Let’s fast-track your savings without making you fill out long website forms. For queries, layout designs, or to schedule a free property assessment, feel free to contact us via WhatsApp by clicking the green box below!
            `;
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
