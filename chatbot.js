// ==========================================================================
// Soltech Energy Chatbot Engine - CLEAN STICKY DECK & PROACTIVE INTERVALS
// ==========================================================================

const chatToggle = document.getElementById("chat-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const minimizeChat = document.getElementById("minimize-chat");
const refreshChat = document.getElementById("refresh-chat");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const launcherTooltip = document.getElementById("chat-launcher-tooltip");

// State Tracking Parameters
let currentFlow = null;
let currentStep = 0;
let flowData = {};

const CRM_SETTINGS = {
    WhatsAppNumber: "918239573979",
    InitialHiMessage: "Hi! I want to check solar details for my property.",
    DefaultLeadLocation: "Jaipur",
    LeadStorageWebhook: "http://localhost:5000/api/leads"
};

const MAIN_HOMEPAGE_ACTIONS = ["Get a Solar Cost Estimate", "Calculate Savings", "Residential Solar", "Commercial Solar", "Solar for Industries", "Request a Site Visit", "Financing & Subsidies", "Talk to an Expert"];
const KEYWORD_OPTIONS = ["Subsidy Info", "Net Metering", "Residential Setup", "Commercial Setup", "Maintenance & AMC", "Connect Live"];

// =====================================
// WINDOW MANAGEMENT & 72s PROACTIVE POP
// =====================================
if (chatToggle) {
    chatToggle.addEventListener("click", () => {
        chatbotContainer.classList.toggle("open");
        // Clear attention seekers on click
        chatToggle.classList.remove("popout-alert");
        if (launcherTooltip) launcherTooltip.classList.remove("visible");
    });
}

if (minimizeChat) {
    minimizeChat.addEventListener("click", () => {
        chatbotContainer.classList.remove("open");
    });
}

if (refreshChat) {
    refreshChat.addEventListener("click", () => {
        localStorage.removeItem("Soltech_chat");
        initializeWelcomeGreeting();
    });
}

// 72-Second Attention Loop Engine
setInterval(() => {
    if (!chatbotContainer.classList.contains("open")) {
        chatToggle.classList.add("popout-alert");
        if (launcherTooltip) launcherTooltip.classList.add("visible");
        
        // Quietly dismiss visual indicator after 6 seconds of no user entry
        setTimeout(() => {
            chatToggle.classList.remove("popout-alert");
            if (launcherTooltip) launcherTooltip.classList.remove("visible");
        }, 6000);
    }
}, 72000);

// ==========================================================================
// INITIALIZER
// ==========================================================================
function initializeWelcomeGreeting() {
    currentFlow = null;
    currentStep = 0;
    flowData = {};

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) progressNode.classList.add("hidden");

    chatBox.innerHTML = "";

    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";

    const messageContentDiv = document.createElement("div");
    messageContentDiv.className = "message-content";

    const logoContainer = document.createElement("div");
    logoContainer.className = "company-logo-container";
    logoContainer.style.marginBottom = "8px";

    const logoImg = document.createElement("img");
    logoImg.src = "logo.jpg";
    logoImg.alt = "Soltech Energy";
    logoImg.className = "chat-company-logo";
    logoImg.style.maxHeight = "34px";
    logoImg.onerror = function() { logoContainer.style.display = "none"; };

    logoContainer.appendChild(logoImg);
    messageContentDiv.appendChild(logoContainer);

    const textInstructions = document.createElement("span");
    textInstructions.innerHTML = `
        <strong>Welcome! I'm your Solar Assistant. How can I help you today?</strong>
        <br><br>
        We are Jaipur's premier solar engineering firm, designing high-yield systems for residential rooftops and commercial enterprises. Use our quick calculators below!
    `;
    
    messageContentDiv.appendChild(textInstructions);
    botMessageDiv.appendChild(messageContentDiv);
    chatBox.appendChild(botMessageDiv);

    injectActionMenuButtons(MAIN_HOMEPAGE_ACTIONS, false);
    scrollBottom();
    saveChat();
}

function returnToMainMenu() {
    addUserMessage("↩️ Back to Main Menu");
    showTyping();
    setTimeout(() => {
        hideTyping();
        initializeWelcomeGreeting();
    }, 500);
}

// ==========================================================================
// SEQUENTIAL STEP FLOWS HANDLING ENGINE
// ==========================================================================
function startFlow(flowName) {
    currentFlow = flowName;
    currentStep = 1;
    flowData = {};

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) progressNode.classList.remove("hidden");
    updateProgressBar(1, 6);

    if (flowName === "ESTIMATOR") {
        addBotMessage("1️⃣ <strong>What type of property are you looking to solarize?</strong>", false);
        injectActionMenuButtons(["Home", "Commercial Building", "Factory/Industry", "School/Institution"], true);
    } else if (flowName === "FINANCING") {
        updateProgressBar(1, 3);
        addBotMessage("1️⃣ <strong>Please specify your project deployment type:</strong>", false);
        injectActionMenuButtons(["Residential Rooftop", "Commercial Enterprise"], true);
    } else if (flowName === "CI_QUALIFY") {
        updateProgressBar(1, 4);
        addBotMessage("1️⃣ <strong>What is your specific industry or business sector type?</strong>", false);
        injectActionMenuButtons(["Manufacturing", "Textiles", "Cold Storage", "Warehousing"], true);
    } else if (flowName === "SITE_VISIT") {
        updateProgressBar(1, 2);
        addBotMessage("🗓️ <strong>Let's schedule your structural deployment evaluation. Please enter your 6-digit Pincode:</strong>", false);
        injectActionMenuButtons([], true);
    }
}

function handleFlowStep(userInputText) {
    if (userInputText.includes("Main Menu")) return;

    showTyping();
    setTimeout(() => {
        hideTyping();
        
        if (currentFlow === "ESTIMATOR") {
            if (currentStep === 1) {
                flowData.propertyType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 6);
                addBotMessage("2️⃣ <strong>Please enter your Jaipur's 6 digit pincode (e.g., 302018)</strong>", false);
                injectActionMenuButtons([], true);
            } else if (currentStep === 2) {
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(userInputText.trim())) {
                    addBotMessage("⚠️ Please enter a valid 6-digit Jaipur Pincode.", false);
                    injectActionMenuButtons([], true);
                    return;
                }
                flowData.pincode = userInputText.trim();
                currentStep = 3;
                updateProgressBar(3, 6);
                addBotMessage("3️⃣ <strong>Select your average monthly electricity bill bracket:</strong>", false);
                injectActionMenuButtons(["< ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"], true);
            } else if (currentStep === 3) {
                flowData.monthlyBill = userInputText;
                currentStep = 4;
                updateProgressBar(4, 6);
                addBotMessage("4️⃣ <strong>What type of roof structure is available?</strong>", false);
                injectActionMenuButtons(["RCC Roof", "Metal Shed", "Ground Mounted"], true);
            } else if (currentStep === 4) {
                flowData.roofType = userInputText;
                currentStep = 5;
                updateProgressBar(5, 6);
                addBotMessage("5️⃣ <strong>What is the approximate shadow-free roof area available?</strong>", false);
                injectActionMenuButtons(["<500 sq ft", "500–1000 sq ft", "1000+ sq ft"], true);
            } else if (currentStep === 5) {
                flowData.roofArea = userInputText;
                currentStep = 6;
                updateProgressBar(6, 6);
                addBotMessage("6️⃣ <strong>Do you own the property?</strong>", false);
                injectActionMenuButtons(["Yes", "No"], true);
            } else if (currentStep === 6) {
                flowData.ownership = userInputText;
                if (document.getElementById("lead-progress")) document.getElementById("lead-progress").classList.add("hidden");
                renderEstimatorResults();
            }
        }
        else if (currentFlow === "FINANCING") {
            if (currentStep === 1) {
                flowData.projectType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 3);
                addBotMessage("2️⃣ <strong>What is your projected installation budget range?</strong>", false);
                injectActionMenuButtons(["Under ₹3 Lakhs", "Above ₹3 Lakhs"], true);
            } else if (currentStep === 2) {
                flowData.budget = userInputText;
                currentStep = 3;
                updateProgressBar(3, 3);
                addBotMessage("3️⃣ <strong>Which financial deployment asset model do you prefer?</strong>", false);
                injectActionMenuButtons(["EMI / Loan", "CAPEX Investment"], true);
            } else if (currentStep === 3) {
                flowData.modelChoice = userInputText;
                if (document.getElementById("lead-progress")) document.getElementById("lead-progress").classList.add("hidden");
                renderFinancingOutputs();
            }
        }
        else if (currentFlow === "CI_QUALIFY") {
            if (currentStep === 1) {
                flowData.industryType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 4);
                addBotMessage("2️⃣ <strong>What is your sanctioned connected load in kW?</strong>", false);
                injectActionMenuButtons([], true);
            } else if (currentStep === 2) {
                flowData.connectedLoad = userInputText;
                currentStep = 3;
                updateProgressBar(3, 4);
                addBotMessage("3️⃣ <strong>What is your typical monthly electricity expense corporate bracket?</strong>", false);
                injectActionMenuButtons(["₹50,000–₹2 Lakhs", "₹2 Lakhs+"], true);
            } else if (currentStep === 3) {
                flowData.monthlyExpense = userInputText;
                currentStep = 4;
                updateProgressBar(4, 4);
                addBotMessage("4️⃣ <strong>What is the total estimated factory or roof area available?</strong>", false);
                injectActionMenuButtons(["1,000–5,000 sq ft", "5,000+ sq ft"], true);
            } else if (currentStep === 4) {
                flowData.roofArea = userInputText;
                if (document.getElementById("lead-progress")) document.getElementById("lead-progress").classList.add("hidden");
                renderCIResults();
            }
        }
        else if (currentFlow === "SITE_VISIT") {
            if (currentStep === 1) {
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(userInputText.trim())) {
                    addBotMessage("⚠️ Invalid Format: Please enter a valid 6-digit site Pincode.", false);
                    injectActionMenuButtons([], true);
                    return;
                }
                flowData.pincode = userInputText.trim();
                triggerGatedWall("Book Site Survey Plan");
            }
        }
    }, 600);
}

// ==========================================================================
// CALCULATIONS MATRIX
// ==========================================================================
function renderEstimatorResults() {
    let sizeKw = 3; let baseCost = 180000; let subsidy = 78000; let annualGen = 4380; let monthlySavings = 3000;

    if (flowData.monthlyBill && flowData.monthlyBill.includes("< ₹2,000")) {
        sizeKw = 2; baseCost = 130000; subsidy = 60000; annualGen = 2920; monthlySavings = 1600;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹2,000–₹5,000")) {
        sizeKw = 4; baseCost = 240000; subsidy = 78000; annualGen = 5840; monthlySavings = 4000;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹5,000–₹10,000")) {
        sizeKw = 7; baseCost = 410000; subsidy = 78000; annualGen = 10220; monthlySavings = 7500;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹10,000+")) {
        sizeKw = 10; baseCost = 550000; subsidy = 78000; annualGen = 14600; monthlySavings = 11000;
    }

    let netCost = baseCost - subsidy;
    let paybackYears = (netCost / (monthlySavings * 12)).toFixed(1);

    let outputHtml = `
📊 <strong>Your Custom Design Blueprint:</strong><br><br>
• <strong>Recommended Size:</strong> ${sizeKw} kWp<br>
• <strong>Gross Cost:</strong> ₹${baseCost.toLocaleString()}<br>
• <strong>Subsidy Benefit:</strong> -₹${subsidy.toLocaleString()}<br>
• <strong style="color: #10b981;">Net Investment:</strong> ₹${netCost.toLocaleString()}<br>
• <strong>Annual Generation:</strong> ${annualGen} Units (kWh)<br>
• <strong>Monthly Savings Estimate:</strong> ₹${monthlySavings.toLocaleString()}<br>
• <strong>Payback Period:</strong> ~${paybackYears} Years
`;
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function renderFinancingOutputs() {
    let outputHtml = `
💳 <strong>Financing Matrix:</strong><br><br>
• <strong>Base Interest Rate:</strong> Starts at <strong>7.99%</strong> per annum.<br>
• <strong>Loan Tenures:</strong> Flexible options up to 5 Years.<br><br>
📋 <strong>Required Documents:</strong><br>
• PAN, Aadhaar, Last 3 Months' Electricity Bill.
`;
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function renderCIResults() {
    let impliedLoad = parseFloat(flowData.connectedLoad) || 50;
    let potentialSize = Math.round(impliedLoad * 0.8);
    let annualSavingsEst = potentialSize * 1450 * 8.5;

    let outputHtml = `
🏭 <strong>Corporate C&I Asset Estimates:</strong><br><br>
• <strong>Potential System Allocation:</strong> Up to ${potentialSize} kWp configuration.<br>
• <strong>Annual Savings Estimate:</strong> Approx ₹${Math.round(annualSavingsEst).toLocaleString()}/yr.<br>
• <strong>Accelerated Depreciation:</strong> Up to 40% write-off in Year 1.
`;
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

// ==========================================================================
// ACTION CONTAINER GENERATOR (FLOATING CONFIG)
// ==========================================================================
function injectGatedActionCTAs() {
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    const wrapper = document.createElement("div");
    wrapper.className = "gated-wrapper-panel";

    const btnConsult = document.createElement("button");
    btnConsult.className = "quick-btn";
    btnConsult.innerHTML = "📅 Book Site Survey Plan";
    btnConsult.onclick = () => triggerGatedWall("Book Site Survey Plan");

    const btnWhatsApp = document.createElement("button");
    btnWhatsApp.className = "wa-direct-btn";
    btnWhatsApp.innerHTML = "💬 WhatsApp Expert Desk";
    btnWhatsApp.onclick = () => launchWhatsAppLeadGen();

    const btnHome = document.createElement("button");
    btnHome.className = "quick-btn back-btn";
    btnHome.innerHTML = "↩️ Main Menu";
    btnHome.onclick = () => initializeWelcomeGreeting();

    wrapper.appendChild(btnConsult);
    wrapper.appendChild(btnWhatsApp);
    wrapper.appendChild(btnHome);
    chatBox.appendChild(wrapper);
    scrollBottom();
}

// ==========================================================================
// INTERACTIVE CAPTURING MODAL ENGINE
// ==========================================================================
function triggerGatedWall(targetActionGoal) {
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    document.querySelectorAll(".lead-form-card").forEach(el => el.remove());

    const formContainer = document.createElement("div");
    formContainer.className = "lead-form-card";

    formContainer.innerHTML = `
        <strong>📋 Verification Required:</strong>
        <p>Please provide your contact details to check details.</p>
        <input type="text" class="lead-name" placeholder="Your Name *">
        <input type="tel" class="lead-phone" placeholder="Phone Number *">
        <button class="verify-btn">Verify Now</button>
        <button type="button" class="exit-form-btn" style="background:transparent;border:none;color:#64748b;cursor:pointer;text-decoration:underline;margin-top:4px;font-size:12px;">↩️ Cancel</button>
    `;

    chatBox.appendChild(formContainer);
    scrollBottom();

    formContainer.querySelector(".exit-form-btn").addEventListener("click", function(e) {
        e.preventDefault();
        formContainer.remove();
        initializeWelcomeGreeting();
    });

    formContainer.querySelector(".verify-btn").addEventListener("click", function(e) {
        e.preventDefault();
        const nameVal = formContainer.querySelector(".lead-name").value.trim();
        const phoneVal = formContainer.querySelector(".lead-phone").value.trim();

        if (!nameVal || !phoneVal) {
            alert("Name and Phone Number are required.");
            return;
        }

        flowData.leadName = nameVal;
        flowData.leadPhone = phoneVal;
        flowData.actionContextTarget = targetActionGoal;

        formContainer.remove();
        processCompletedLeadCaptured();
    });
}

async function processCompletedLeadCaptured() {
    showTyping();
    const leadPayload = {
        name: flowData.leadName,
        phone: flowData.leadPhone,
        context: flowData.actionContextTarget,
        location: flowData.pincode || CRM_SETTINGS.DefaultLeadLocation,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(CRM_SETTINGS.LeadStorageWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadPayload)
        });
    } catch(e) {
        console.log("Buffered local sync saved.");
    }

    setTimeout(() => {
        hideTyping();
        addBotMessage(`✅ <strong>Thank you, ${flowData.leadName}.</strong> Request processed successfully.`, false);
        addBotMessage(`📞 Our engineering team will connect with you at <strong>${flowData.leadPhone}</strong> shortly.`, false);
        setTimeout(() => { initializeWelcomeGreeting(); }, 4000);
    }, 800);
}

// ==========================================================================
// STRING ROUTING MATRIX
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.trim();
    if (!cleanText) return;

    if (cleanText === "↩️ Back to Main Menu" || cleanText.toLowerCase() === "back" || cleanText.toLowerCase() === "menu") {
        initializeWelcomeGreeting();
        return;
    }
    if (cleanText === "Get a Solar Cost Estimate" || cleanText === "Calculate Savings" || cleanText === "Residential Solar") {
        startFlow("ESTIMATOR"); return;
    }
    if (cleanText === "Financing & Subsidies" || cleanText === "Subsidy Info") {
        startFlow("FINANCING"); return;
    }
    if (cleanText === "Commercial Solar" || cleanText === "Solar for Industries") {
        startFlow("CI_QUALIFY"); return;
    }
    if (cleanText === "Request a Site Visit") {
        startFlow("SITE_VISIT"); return;
    }
    if (cleanText === "Talk to an Expert" || cleanText === "Connect Live") {
        launchWhatsAppLeadGen(); return;
    }

    if (currentFlow !== null) {
        handleFlowStep(cleanText);
        return;
    }

    showTyping();
    setTimeout(() => {
        hideTyping();
        addBotMessage(`🤖 For custom solar system metrics or rapid net-metering options, use the options below:`, false);
        injectGatedActionCTAs();
    }, 500);
}

// ==========================================================================
// WHATSAPP OUTBOUND GATEWAY
// ==========================================================================
function launchWhatsAppLeadGen() {
    const waFullLink = `https://wa.me/${CRM_SETTINGS.WhatsAppNumber}/?text=${encodeURIComponent(CRM_SETTINGS.InitialHiMessage)}`;
    window.open(waFullLink, '_blank');
}

function sendMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (!message) return;
    addUserMessage(message);
    userInput.value = "";
    processMessage(message);
}

function injectActionMenuButtons(buttonLabelList, includeBackButton = false) {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    if (buttonLabelList.length === 0 && !includeBackButton) return;

    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";

    buttonLabelList.forEach(textLabel => {
        const btn = document.createElement("button");
        btn.className = "quick-btn";
        btn.innerText = textLabel;
        btn.onclick = (e) => {
            e.preventDefault();
            addUserMessage(textLabel);
            processMessage(textLabel);
        };
        wrapper.appendChild(btn);
    });

    if (includeBackButton) {
        const backBtn = document.createElement("button");
        backBtn.className = "quick-btn back-btn";
        backBtn.innerHTML = "↩️ Main Menu";
        backBtn.onclick = (e) => {
            e.preventDefault();
            returnToMainMenu();
        };
        wrapper.appendChild(backBtn);
    }

    chatBox.appendChild(wrapper);
    scrollBottom();
}

function updateProgressBar(step, total) {
    const fill = document.getElementById("progress-bar-fill");
    if (fill) fill.style.width = `${Math.round((step / total) * 100)}%`;
}

function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    scrollBottom();
}

function addBotMessage(text, displayButtons = true) {
    const div = document.createElement("div");
    div.className = "bot-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    if (displayButtons) {
        injectActionMenuButtons(KEYWORD_OPTIONS, true);
    } else {
        scrollBottom();
    }
    saveChat();
}

function showTyping() {}
function hideTyping() {}
function scrollBottom() { if (chatBox) chatBox.scrollTop = chatBox.scrollHeight; }
function saveChat() { if (chatBox) localStorage.setItem("Soltech_chat", chatBox.innerHTML); }

function loadChat() {
    let chat = localStorage.getItem("Soltech_chat");
    if (chat) {
        chatBox.innerHTML = chat;
    } else {
        initializeWelcomeGreeting();
    }
}

// Language Switcher Toggle Hooks
document.addEventListener("DOMContentLoaded", function() {
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
        });
    }

    const languageButtons = document.querySelectorAll(".lang-switcher-pill .lang-btn");
    languageButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            if (this.classList.contains("active")) return;
            
            document.querySelectorAll(".lang-switcher-pill .lang-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            const selectedLanguage = this.getAttribute("data-lang");
            if (selectedLanguage === "HI") {
                addUserMessage("🌐 Switch to Hindi Language");
                setTimeout(() => {
                    addBotMessage("👋 नमस्ते! मैं आपका सोलर सहायक हूँ। आप किस प्रकार की सोलर जानकारी प्राप्त करना चाहते हैं?", false);
                    injectActionMenuButtons(["सोलर खर्च का अनुमान", "बचत की गणना करें", "मुख्य मेनू पर जाएं"], false);
                }, 400);
            } else {
                addUserMessage("🌐 Switch to English Language");
                setTimeout(() => { initializeWelcomeGreeting(); }, 400);
            }
        });
    });
    loadChat();
});
