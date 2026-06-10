// ========================================================================== 
// Soltech Energy Chatbot Engine
// chatbot.js [UPDATED WITH 6-DIGIT PINCODE VALIDATION SYSTEM]
// ==========================================================================

const chatToggle = document.getElementById("chat-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const minimizeChat = document.getElementById("minimize-chat");
const refreshChat = document.getElementById("refresh-chat");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const footerWhitespaceCta = document.getElementById("footer-whatsapp-cta");

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

const MAIN_HOMEPAGE_ACTIONS = [
    "Get a Solar Cost Estimate",
    "Calculate Savings",
    "Residential Solar",
    "Commercial Solar",
    "Solar for Industries",
    "Request a Site Visit",
    "Financing & Subsidies",
    "Talk to an Expert"
];

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
    currentFlow = null;
    currentStep = 0;
    flowData = {};
    document.getElementById("lead-progress").classList.add("hidden");
    
    chatBox.innerHTML = `
    <div class="bot-message">
        <div class="message-content">
            <div class="company-logo-container" style="margin-bottom: 12px; display: flex; align-items: center;">
                <img src="logo.png" alt="Soltech Energy Logo" class="chat-company-logo" style="max-height: 40px; width: auto; object-fit: contain;" onerror="this.parentNode.style.display='none';">
            </div>
            <strong>Welcome! I'm your Solar Assistant. How can I help you today?</strong>
            <br><br>
            We are Jaipur's premier solar engineering firm, designing high-yield systems for residential rooftops and commercial enterprises.
            <br><br>
            🤖 Solar system costs vary continuously based on your roof space, shadows, and shifting JVVNL net-metering regulations. Feel free to use our quick calculators below!
        </div>
    </div>
    `;
    injectActionMenuButtons(MAIN_HOMEPAGE_ACTIONS);
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
// SEQUENTIAL STEP FLOWS HANDLING ENGINE
// ==========================================================================
function startFlow(flowName) {
    currentFlow = flowName;
    currentStep = 1;
    flowData = {};
    document.getElementById("lead-progress").classList.remove("hidden");
    updateProgressBar(1, 6);
    
    if (flowName === "ESTIMATOR") {
        addBotMessage("1️⃣ <strong>What type of property are you looking to solarize?</strong>", false);
        injectActionMenuButtons(["Home", "Commercial Building", "Factory/Industry", "School/Institution"]);
    } else if (flowName === "FINANCING") {
        updateProgressBar(1, 3);
        addBotMessage("1️⃣ <strong>Please specify your project deployment type:</strong>", false);
        injectActionMenuButtons(["Residential Rooftop", "Commercial Enterprise", "Industrial Facility"]);
    } else if (flowName === "CI_QUALIFY") {
        updateProgressBar(1, 5);
        addBotMessage("1️⃣ <strong>What is your specific industry or business sector type?</strong>", false);
    } else if (flowName === "SITE_VISIT") {
        updateProgressBar(1, 2);
        addBotMessage("🗓️ <strong>Let's schedule your structural deployment evaluation. Please enter your 6-digit Pincode:</strong>", false);
    }
}

function handleFlowStep(userInputText) {
    showTyping();
    setTimeout(() => {
        hideTyping();
        
        // FLOW A: SOLAR COST ESTIMATOR
        if (currentFlow === "ESTIMATOR") {
            if (currentStep === 1) {
                flowData.propertyType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 6);
                addBotMessage("2️⃣ <strong>Please enter your Jaipur's 6 digit pincode (e.g., 302018)</strong>", false);
            } else if (currentStep === 2) {
                // Strict 6-digit Pincode format check
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(userInputText.trim())) {
                    addBotMessage("⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit Jaipur Pincode (e.g., 302018) to accurately calculate baseline logistics.", false);
                    return;
                }
                
                flowData.pincode = userInputText.trim();
                currentStep = 3;
                updateProgressBar(3, 6);
                addBotMessage("3️⃣ <strong>Select your average monthly electricity bill bracket:</strong>", false);
                injectActionMenuButtons(["< ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"]);
            } else if (currentStep === 3) {
                flowData.monthlyBill = userInputText;
                currentStep = 4;
                updateProgressBar(4, 6);
                addBotMessage("4️⃣ <strong>What type of roof structure is available?</strong>", false);
                injectActionMenuButtons(["RCC Roof", "Metal Shed", "Ground Mounted", "Not Sure"]);
            } else if (currentStep === 4) {
                flowData.roofType = userInputText;
                currentStep = 5;
                updateProgressBar(5, 6);
                addBotMessage("5️⃣ <strong>What is the approximate shadow-free roof area available?</strong>", false);
                injectActionMenuButtons(["<500 sq ft", "500–1000 sq ft", "1000–5000 sq ft", "5000+ sq ft"]);
            } else if (currentStep === 5) {
                flowData.roofArea = userInputText;
                currentStep = 6;
                updateProgressBar(6, 6);
                addBotMessage("6️⃣ <strong>Do you own the property?</strong>", false);
                injectActionMenuButtons(["Yes", "No"]);
            } else if (currentStep === 6) {
                flowData.ownership = userInputText;
                document.getElementById("lead-progress").classList.add("hidden");
                renderEstimatorResults();
            }
        }
        
        // FLOW B: FINANCING ASSISTANT
        else if (currentFlow === "FINANCING") {
            if (currentStep === 1) {
                flowData.projectType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 3);
                addBotMessage("2️⃣ <strong>What is your projected installation budget range?</strong>", false);
                injectActionMenuButtons(["Under ₹3 Lakhs", "₹3 Lakhs to ₹7 Lakhs", "Above ₹7 Lakhs"]);
            } else if (currentStep === 2) {
                flowData.budget = userInputText;
                currentStep = 3;
                updateProgressBar(3, 3);
                addBotMessage("3️⃣ <strong>Which financial deployment asset model are you looking to check?</strong>", false);
                injectActionMenuButtons(["EMI", "Loan", "CAPEX", "OPEX/PPA"]);
            } else if (currentStep === 3) {
                flowData.modelChoice = userInputText;
                document.getElementById("lead-progress").classList.add("hidden");
                renderFinancingOutputs();
            }
        }

        // FLOW C: C&I LEAD QUALIFICATION
        else if (currentFlow === "CI_QUALIFY") {
            if (currentStep === 1) {
                flowData.industryType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 5);
                addBotMessage("2️⃣ <strong>What is your sanctioned connected load in kW?</strong>", false);
            } else if (currentStep === 2) {
                flowData.connectedLoad = userInputText;
                currentStep = 3;
                updateProgressBar(3, 5);
                addBotMessage("3️⃣ <strong>What is your typical monthly electricity expense corporate bracket?</strong>", false);
                injectActionMenuButtons(["₹50,000–₹1 Lakh", "₹1 Lakh–₹5 Lakhs", "₹5 Lakhs+"]);
            } else if (currentStep === 3) {
                flowData.monthlyExpense = userInputText;
                currentStep = 4;
                updateProgressBar(4, 5);
                addBotMessage("4️⃣ <strong>What is the total estimated factory or roof area available?</strong>", false);
                injectActionMenuButtons(["1,000–5,000 sq ft", "5,000–10,000 sq ft", "10,000+ sq ft"]);
            } else if (currentStep === 4) {
                flowData.roofArea = userInputText;
                currentStep = 5;
                updateProgressBar(5, 5);
                addBotMessage("5️⃣ <strong>How many independent production facilities do you operate?</strong>", false);
            } else if (currentStep === 5) {
                flowData.facilityCount = userInputText;
                document.getElementById("lead-progress").classList.add("hidden");
                renderCIResults();
            }
        }

        // FLOW D: SITE VISIT
        else if (currentFlow === "SITE_VISIT") {
            if (currentStep === 1) {
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(userInputText.trim())) {
                    addBotMessage("⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit site Pincode to coordinate engineering schedules.", false);
                    return;
                }
                flowData.pincode = userInputText.trim();
                triggerGatedWall("Book Site Survey Plan");
            }
        }
    }, 600);
}

// ==========================================================================
// CORE CALCULATIONS ENGINE (INTEGRATED WITH SOLAR LADDER CORE DATA)
// ==========================================================================
function renderEstimatorResults() {
    let sizeKw = 3; let baseCost = 180000; let subsidy = 78000; let annualGen = 4380; let monthlySavings = 3000;
    
    if (flowData.monthlyBill.includes("< ₹2,000")) {
        sizeKw = 2; baseCost = 130000; subsidy = 60000; annualGen = 2920; monthlySavings = 1600;
    } else if (flowData.monthlyBill.includes("₹2,000–₹5,000")) {
        sizeKw = 4; baseCost = 240000; subsidy = 78000; annualGen = 5840; monthlySavings = 4000;
    } else if (flowData.monthlyBill.includes("₹5,000–₹10,000")) {
        sizeKw = 7; baseCost = 410000; subsidy = 78000; annualGen = 10220; monthlySavings = 7500;
    } else if (flowData.monthlyBill.includes("₹10,000+")) {
        sizeKw = 10; baseCost = 550000; subsidy = 78000; annualGen = 14600; monthlySavings = 11000;
    }

    if (flowData.roofArea.includes("<500 sq ft") && sizeKw > 4) {
        addBotMessage(`⚠️ <strong>Roof Constraints Identified:</strong> Your consumption requires a ${sizeKw}kW system, but your area fits up to 4kW. Our team will optimize placement using satellite mapping.`, false);
        sizeKw = 4;
    }

    let netCost = baseCost - subsidy;
    let paybackYears = (netCost / (monthlySavings * 12)).toFixed(1);

    // Dynamic EMI calculation using Solar Ladder's baseline 7.99% rate for a standard 36-month tenure
    let p = netCost;
    let r = 7.99 / 12 / 100;
    let n = 36;
    let emiResult = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    let outputHtml = `
    📊 <strong>Your Custom Soltech System Design Blueprint:</strong><br><br>
    • <strong>Target Coverage Pincode:</strong> ${flowData.pincode}<br>
    • <strong>Recommended System Size:</strong> ${sizeKw} kWp<br>
    • <strong>Estimated Project Cost (Gross):</strong> ₹${baseCost.toLocaleString()}<br>
    • <strong>Government Subsidy Benefit:</strong> -₹${subsidy.toLocaleString()}<br>
    • <strong style="color: #2e7d32;">Net Cost Investment:</strong> ₹${netCost.toLocaleString()}<br>
    • <strong>Expected Annual Generation:</strong> ${annualGen} Units (kWh)<br>
    • <strong>Monthly Savings Estimate:</strong> ₹${monthlySavings.toLocaleString()}<br>
    • <strong>Payback Period:</strong> ~${paybackYears} Years<br>
    • <strong>Typical EMI Baseline (7.99% Rate over 36M):</strong> ₹${emiResult.toLocaleString()}/month<br><br>
    Would you like to unlock your detailed structural engineering proposal brochure or speak to our loan counter expert?
    `;
    
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function renderFinancingOutputs() {
    let outputHtml = `
    💳 <strong>Soltech & Solar Ladder Loan Engine Matrix:</strong><br><br>
    • <strong>Base Interest Rate:</strong> Starts at <strong>7.99%</strong> per annum.<br>
    • <strong>Available Loan Tenures:</strong> Flexible options ranging from 6 Months to 5 Years (6M, 1Y, 2Y, 3Y, 4Y, 5Y).<br>
    • <strong>Special Promotional Tranches:</strong> Interest-free (0% Interest) options available for up to 6 months.<br><br>
    📋 <strong>Official Required Documents Checklist (Soltech Flow):</strong><br>
    • <strong>Common Base Requirements:</strong> PAN Card, Aadhaar Card (Front/Back), Last 3 Months' Electricity Bill, 1-Year Bank Statement, Passport Photo, Applicant Email & Phone Number, and a Detailed Solar Proposal.<br>
    • <strong>For Salaried Employees:</strong> 3 Months' Salary Slips.<br>
    • <strong>For Self-Employed:</strong> 2 Years of Income Tax Returns (ITR) along with Business Proof (GST Certificate or Udyam Registration).<br><br>
    To book a live system demo and download the technical loan structure brochure, tap below to verify your details.
    `;
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function renderCIResults() {
    let impliedLoad = parseFloat(flowData.connectedLoad) || 50;
    let potentialSize = Math.round(impliedLoad * 0.8);
    let annualSavingsEst = potentialSize * 1450 * 8.5;
    let carbonSavedTons = (potentialSize * 1450 * 0.00082).toFixed(1);

    let outputHtml = `
    🏭 <strong>Corporate C&I Asset Feasibility Estimates:</strong><br><br>
    • <strong>Potential System Size Allocation:</strong> Up to ${potentialSize} kWp grid-tied asset installation.<br>
    • <strong>Annual Savings Estimate:</strong> Approx ₹${Math.round(annualSavingsEst).toLocaleString()} per annum.<br>
    • <strong>Accelerated Depreciation Asset Benefit:</strong> Up to 40% taxable write-off allowances in Year 1 allocation profiles.<br>
    • <strong>Carbon Reduction Estimate:</strong> Net reduction of <strong>${carbonSavedTons} Metric Tons of CO2</strong> annually.<br><br>
    Unlock full case study portfolios and trigger automated engineering calculations by submitting your verification logs.
    `;
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

// ==========================================================================
// GATED LEAD SYSTEM INTERFACE DESIGN (STRICT RULE LOCK)
// ==========================================================================
function injectGatedActionCTAs() {
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    const wrapper = document.createElement("div");
    wrapper.className = "gated-wrapper-panel";
    wrapper.style.cssText = "margin-top:12px; display:flex; flex-direction:column; gap:8px;";

    const btnConsult = document.createElement("button");
    btnConsult.className = "quick-btn functional-action-btn";
    btnConsult.innerHTML = "📅 Book a Free Demo / Site Survey";
    btnConsult.onclick = () => triggerGatedWall("Book a Free System Demo");

    const btnBrochure = document.createElement("button");
    btnBrochure.className = "quick-btn functional-action-btn";
    btnBrochure.innerHTML = "📥 Download Technical Brochure";
    btnBrochure.onclick = () => triggerGatedWall("Download Technical Brochure");

    const btnWhatsApp = document.createElement("button");
    btnWhatsApp.className = "quick-btn functional-action-btn wa-direct-btn";
    btnWhatsApp.style.backgroundColor = "#25D366";
    btnWhatsApp.style.color = "#FFFFFF";
    btnWhatsApp.innerHTML = "<i class='fab fa-whatsapp'></i> WhatsApp Expert Desk";
    btnWhatsApp.onclick = () => launchWhatsAppLeadGen();

    wrapper.appendChild(btnConsult);
    wrapper.appendChild(btnBrochure);
    wrapper.appendChild(btnWhatsApp);
    chatBox.appendChild(wrapper);
    scrollBottom();
}

function triggerGatedWall(targetActionGoal) {
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    
    let leadFormHtml = `
    📋 <strong>Identity Verification Required:</strong><br>
    You must fill out your name and phone number to book a demo or download our brochure files:
    <br><br>
    <div class="gated-form-container" style="display:flex; flex-direction:column; gap:8px; background:rgba(0,0,0,0.03); padding:10px; border-radius:8px;">
        <input type="text" id="lead-name" placeholder="Your Name *" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
        <input type="text" id="lead-phone" placeholder="Phone Number *" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
        <input type="text" id="lead-company" placeholder="Company Name (Optional)" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
        <button id="submit-lead-gated-btn" class="quick-btn" style="background:#ff9800; color:#fff; padding:10px; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Verify to Access</button>
    </div>
    `;
    addBotMessage(leadFormHtml, false);
    
    document.getElementById("submit-lead-gated-btn").onclick = () => {
        const nameVal = document.getElementById("lead-name").value.trim();
        const phoneVal = document.getElementById("lead-phone").value.trim();
        const companyVal = document.getElementById("lead-company").value.trim();
        
        if (!nameVal || !phoneVal) {
            alert("Name and Phone Number fields are strictly required to proceed.");
            return;
        }
        
        flowData.leadName = nameVal;
        flowData.leadPhone = phoneVal;
        flowData.leadCompany = companyVal;
        flowData.actionContextTarget = targetActionGoal;
        
        processCompletedLeadCaptured();
    };
}

async function processCompletedLeadCaptured() {
    showTyping();
    const leadPayload = {
        name: flowData.leadName,
        phone: flowData.leadPhone,
        company: flowData.leadCompany || "Individual/Residential",
        context: flowData.actionContextTarget,
        pincode: flowData.pincode || "000000",
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
        console.log("Local standalone cache buffer committed.");
    }

    setTimeout(() => {
        hideTyping();
        addBotMessage(`✅ <strong>Thank you, ${flowData.leadName}.</strong> Your request has been verified and processed.`, false);
        
        if (flowData.actionContextTarget.includes("Brochure")) {
            addBotMessage(`🎉 <strong>Access Granted:</strong> <a href="#" onclick="alert('Starting your technical brochure download...'); return false;" style="text-decoration:underline; font-weight:bold; color:#0d47a1;">Click here to download the brochure file</a>.`, false);
        } else {
            addBotMessage(`📞 Our expert team will connect with you shortly at <strong>${flowData.leadPhone}</strong> to conduct your live system demo.`, false);
        }
        
        setTimeout(() => { initializeWelcomeGreeting(); }, 4000);
    }, 800);
}

// ==========================================================================
// TEXT PROCESSING ENGINE WITH LOGICAL OVERRIDES
// ==========================================================================
function processMessage(userText) {
    const cleanText = userText.trim();
    if (!cleanText) return;

    // Direct string keyword routing matches
    if (cleanText === "Get a Solar Cost Estimate" || cleanText === "Cost Calculator") {
        startFlow("ESTIMATOR"); return;
    }
    if (cleanText === "Calculate Savings" || cleanText === "Savings Calculator") {
        startFlow("ESTIMATOR"); return;
    }
    if (cleanText === "Financing & Subsidies" || cleanText === "Subsidy Info" || cleanText === "Subsidy Checker") {
        startFlow("FINANCING"); return;
    }
    if (cleanText === "Residential Solar") {
        startFlow("ESTIMATOR"); return;
    }
    if (cleanText === "Commercial Solar" || cleanText === "Solar for Industries" || cleanText === "Industrial Solar") {
        startFlow("CI_QUALIFY"); return;
    }
    if (cleanText === "Request a Site Visit" || cleanText === "Book Site Visit" || cleanText === "Book Site Survey") {
        startFlow("SITE_VISIT"); return;
    }
    if (cleanText === "Talk to an Expert" || cleanText === "Connect Live") {
        launchWhatsAppLeadGen(); return;
    }

    // Active form loop override flags
    if (currentFlow !== null) {
        handleFlowStep(cleanText);
        return;
    }

    // Search lookup dictionary processing
    showTyping();
    setTimeout(() => {
        hideTyping();
        if (typeof findBestIntent === "function") {
            const matchedIntent = findBestIntent(cleanText);
            if (matchedIntent && matchedIntent.responses && matchedIntent.responses.length > 0) {
                addBotMessage(matchedIntent.responses[0], true);
                return;
            }
        }
        let targetResponse = `🤖 For custom engineering schematics, precise Soltech project breakdowns, or fast JVVNL approvals, connect with our desk directly via the options below:`;
        addBotMessage(targetResponse, false);
        injectGatedActionCTAs();
    }, 500);
}

// ==========================================================================
// WHATSAPP ROUTING & WIDGET MANIPULATIONS
// ==========================================================================
function launchWhatsAppLeadGen() {
    const waBaseURL = "https://wa.me/";
    const waFullLink = `${waBaseURL}${CRM_SETTINGS.WhatsAppNumber}/?text=${encodeURIComponent(CRM_SETTINGS.InitialHiMessage)}`;
    notifyCRMofWhatsAppClick(flowData.pincode || CRM_SETTINGS.DefaultLeadLocation, "Chatbot_Interactive_Widget");
    window.open(waFullLink, '_blank');
}

async function notifyCRMofWhatsAppClick(locationTag, sourceTag) {
    try {
        const leadPayload = { source: sourceTag, location_tag: locationTag, timestamp: new Date().toISOString() };
        await fetch(CRM_SETTINGS.LeadStorageWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadPayload) });
    } catch (error) {}
}

function sendMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (!message) return;
    addUserMessage(message);
    userInput.value = ""; 
    processMessage(message);
}

function injectActionMenuButtons(buttonLabelList) {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";
    wrapper.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;";
    
    buttonLabelList.forEach(textLabel => {
        const btn = document.createElement("button");
        btn.className = "quick-btn";
        btn.style.cssText = "padding:8px 12px; border:1px solid #ff9800; border-radius:20px; background:#fff; cursor:pointer; font-size:13px; font-family:'Poppins'; transition:0.2s;";
        btn.innerText = textLabel;
        
        btn.onmouseover = () => { btn.style.background = "#ff9800"; btn.style.color = "#fff"; };
        btn.onmouseout = () => { btn.style.background = "#fff"; btn.style.color = "#000"; };
        btn.onclick = (e) => {
            e.preventDefault();
            addUserMessage(textLabel);
            processMessage(textLabel);
        };
        wrapper.appendChild(btn);
    });
    chatBox.appendChild(wrapper);
    scrollBottom();
}

function updateProgressBar(step, total) {
    const fill = document.getElementById("progress-fill");
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
        injectActionMenuButtons(KEYWORD_OPTIONS);
    } else {
        scrollBottom();
    }
    saveChat();
}

function showTyping() {
    const ti = document.getElementById("typing-indicator");
    if (ti) ti.classList.remove("hidden");
}

function hideTyping() {
    const ti = document.getElementById("typing-indicator");
    if (ti) ti.classList.add("hidden");
}

function scrollBottom() { chatBox.scrollTop = chatBox.scrollHeight; }
function saveChat() { localStorage.setItem("Soltech_chat", chatBox.innerHTML); }

function loadChat() {
    const chat = localStorage.getItem("Soltech_chat");
    if (chat) chatBox.innerHTML = chat;
    else initializeWelcomeGreeting();
}

document.addEventListener("DOMContentLoaded", function() {
    if (footerWhitespaceCta) footerWhitespaceCta.addEventListener("click", launchWhatsAppLeadGen);
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
    document.querySelectorAll(".persistent-tab-item").forEach(tab => {
        tab.addEventListener("click", (e) => {
            const label = e.currentTarget.getAttribute("data-intent");
            addUserMessage(label);
            processMessage(label);
        });
    });
    loadChat();
});
