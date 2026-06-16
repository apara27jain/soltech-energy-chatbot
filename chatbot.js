// ==========================================================================
// Soltech Energy Chatbot Engine
// chatbot.js [STRUCTURALLY RECONCILED & REPAIRED]
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

const MAIN_HOMEPAGE_ACTIONS = ["Get a Solar Cost Estimate", "Calculate Savings", "Residential Solar", "Commercial Solar", "Solar for Industries", "Request a Site Visit", "Financing & Subsidies", "Talk to an Expert"];

const KEYWORD_OPTIONS = ["Subsidy Info", "Net Metering", "Residential Setup", "Commercial Setup", "Maintenance & AMC", "Warranty & Life", "Weather Safety", "Connect Live"];

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
// DEFAULT WELCOME INITIALIZER & BACK FUNCTION
// ==========================================================================
function initializeWelcomeGreeting() {
    currentFlow = null;
    currentStep = 0;
    flowData = {};

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) {
        progressNode.classList.add("hidden");
    }

    // Safely clearing the box clean
    chatBox.innerHTML = "";

    // Build the outer message container securely
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message";

    const messageContentDiv = document.createElement("div");
    messageContentDiv.className = "message-content";

    // Build the logo block safely
    const logoContainer = document.createElement("div");
    logoContainer.className = "company-logo-container";
    logoContainer.style.marginBottom = "12px";
    logoContainer.style.display = "flex";
    logoContainer.style.alignItems = "center";

    const logoImg = document.createElement("img");
    logoImg.src = "logo.jpg";
    logoImg.alt = "Soltech Energy Logo";
    logoImg.className = "chat-company-logo";
    logoImg.style.maxHeight = "40px";
    logoImg.style.width = "auto";
    logoImg.style.objectFit = "contain";
    logoImg.onerror = function() { logoContainer.style.display = "none"; };

    logoContainer.appendChild(logoImg);
    messageContentDiv.appendChild(logoContainer);

    // Add text instructions safely via innerHTML to process formatting tags
    const textInstructions = document.createElement("span");
    textInstructions.innerHTML = `
        <strong>Welcome! I'm your Solar Assistant. How can I help you today?</strong>
        <br><br>
        We are Jaipur's premier solar engineering firm, designing high-yield systems for residential rooftops and commercial enterprises.
        <br><br>
        🤖 Solar system costs vary continuously based on your roof space, shadows, and shifting JVVNL net-metering regulations. Feel free to use our quick calculators below!
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

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) progressNode.classList.remove("hidden");
    updateProgressBar(1, 6);

    if (flowName === "ESTIMATOR") {
        addBotMessage("1️⃣ <strong>What type of property are you looking to solarize?</strong>", false);
        injectActionMenuButtons(["Home", "Commercial Building", "Factory/Industry", "School/Institution"], true);
    } else if (flowName === "FINANCING") {
        updateProgressBar(1, 3);
        addBotMessage("1️⃣ <strong>Please specify your project deployment type:</strong>", false);
        injectActionMenuButtons(["Residential Rooftop", "Commercial Enterprise", "Industrial Facility"], true);
    } else if (flowName === "CI_QUALIFY") {
        updateProgressBar(1, 5);
        addBotMessage("1️⃣ <strong>What is your specific industry or business sector type?</strong>", false);
        injectActionMenuButtons(["Manufacturing", "Textiles", "Cold Storage", "Warehousing", "Other Commercial"], true);
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
        
        // FLOW A: SOLAR COST ESTIMATOR
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
                    addBotMessage("⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit Jaipur Pincode (e.g., 302018) to accurately calculate baseline logistics.", false);
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
                injectActionMenuButtons(["RCC Roof", "Metal Shed", "Ground Mounted", "Not Sure"], true);
            } else if (currentStep === 4) {
                flowData.roofType = userInputText;
                currentStep = 5;
                updateProgressBar(5, 6);
                addBotMessage("5️⃣ <strong>What is the approximate shadow-free roof area available?</strong>", false);
                injectActionMenuButtons(["<500 sq ft", "500–1000 sq ft", "1000–5000 sq ft", "5000+ sq ft"], true);
            } else if (currentStep === 5) {
                flowData.roofArea = userInputText;
                currentStep = 6;
                updateProgressBar(6, 6);
                addBotMessage("6️⃣ <strong>Do you own the property?</strong>", false);
                injectActionMenuButtons(["Yes", "No"], true);
            } else if (currentStep === 6) {
                flowData.ownership = userInputText;
                if (document.getElementById("lead-progress")) {
                    document.getElementById("lead-progress").classList.add("hidden");
                }
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
                injectActionMenuButtons(["Under ₹3 Lakhs", "₹3 Lakhs to ₹7 Lakhs", "Above ₹7 Lakhs"], true);
            } else if (currentStep === 2) {
                flowData.budget = userInputText;
                currentStep = 3;
                updateProgressBar(3, 3);
                addBotMessage("3️⃣ <strong>Which financial deployment asset model are you looking to check?</strong>", false);
                injectActionMenuButtons(["EMI", "Loan", "CAPEX", "OPEX/PPA"], true);
            } else if (currentStep === 3) {
                flowData.modelChoice = userInputText;
                if (document.getElementById("lead-progress")) {
                    document.getElementById("lead-progress").classList.add("hidden");
                }
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
                injectActionMenuButtons([], true);
            } else if (currentStep === 2) {
                flowData.connectedLoad = userInputText;
                currentStep = 3;
                updateProgressBar(3, 5);
                addBotMessage("3️⃣ <strong>What is your typical monthly electricity expense corporate bracket?</strong>", false);
                injectActionMenuButtons(["₹50,000–₹1 Lakh", "₹1 Lakh–₹5 Lakhs", "₹5 Lakhs+"], true);
            } else if (currentStep === 3) {
                flowData.monthlyExpense = userInputText;
                currentStep = 4;
                updateProgressBar(4, 5);
                addBotMessage("4️⃣ <strong>What is the total estimated factory or roof area available?</strong>", false);
                injectActionMenuButtons(["1,000–5,000 sq ft", "5,000–10,000 sq ft", "10,000+ sq ft"], true);
            } else if (currentStep === 4) {
                flowData.roofArea = userInputText;
                currentStep = 5;
                updateProgressBar(5, 5);
                addBotMessage("5️⃣ <strong>How many independent production facilities do you operate?</strong>", false);
                injectActionMenuButtons([], true);
            } else if (currentStep === 5) {
                flowData.facilityCount = userInputText;
                if (document.getElementById("lead-progress")) {
                    document.getElementById("lead-progress").classList.add("hidden");
                }
                renderCIResults();
            }
        }

        // FLOW D: SITE VISIT
        else if (currentFlow === "SITE_VISIT") {
            if (currentStep === 1) {
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(userInputText.trim())) {
                    addBotMessage("⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit site Pincode to coordinate engineering schedules.", false);
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
// CORE CALCULATIONS ENGINE
// ==========================================================================
function renderEstimatorResults() {
    let sizeKw = 3; 
    let baseCost = 180000; 
    let subsidy = 78000; 
    let annualGen = 4380; 
    let monthlySavings = 3000;

    if (flowData.monthlyBill && flowData.monthlyBill.includes("< ₹2,000")) {
        sizeKw = 2; baseCost = 130000; subsidy = 60000; annualGen = 2920; monthlySavings = 1600;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹2,000–₹5,000")) {
        sizeKw = 4; baseCost = 240000; subsidy = 78000; annualGen = 5840; monthlySavings = 4000;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹5,000–₹10,000")) {
        sizeKw = 7; baseCost = 410000; subsidy = 78000; annualGen = 10220; monthlySavings = 7500;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("₹10,000+")) {
        sizeKw = 10; baseCost = 550000; subsidy = 78000; annualGen = 14600; monthlySavings = 11000;
    }

    if (flowData.roofArea && flowData.roofArea.includes("<500 sq ft") && sizeKw > 4) {
        addBotMessage(`⚠️ <strong>Roof Constraints Identified:</strong> Your consumption requires a ${sizeKw}kW system, but your area fits up to 4kW. Our team will optimize placement using satellite mapping.`, false);
        sizeKw = 4;
    }

    let netCost = baseCost - subsidy;
    let paybackYears = (netCost / (monthlySavings * 12)).toFixed(1);

    let p = netCost;
    let r = 7.99 / 12 / 100;
    let n = 36;
    let emiResult = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    let outputHtml = `
📊 <strong>Your Custom Soltech System Design Blueprint:</strong><br><br>
• <strong>Target Coverage Pincode:</strong> ${flowData.pincode || "N/A"}<br>
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
// GATED LEAD SYSTEM INTERFACE DESIGN
// ==========================================================================
function injectGatedActionCTAs() {
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    const wrapper = document.createElement("div");
    wrapper.className = "gated-wrapper-panel";

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
    btnWhatsApp.innerHTML = "<i class='fab fa-whatsapp'></i> WhatsApp Expert Desk";
    btnWhatsApp.onclick = () => launchWhatsAppLeadGen();

    const btnHome = document.createElement("button");
    btnHome.className = "quick-btn back-btn";
    btnHome.innerHTML = "<i class='fas fa-arrow-left'></i> Back to Main Menu";
    btnHome.onclick = () => initializeWelcomeGreeting();

    wrapper.appendChild(btnConsult);
    wrapper.appendChild(btnBrochure);
    wrapper.appendChild(btnWhatsApp);
    wrapper.appendChild(btnHome);
    chatBox.appendChild(wrapper);
    scrollBottom();
}

// ==========================================================================
// UPDATED & ENHANCED VERIFICATION FORM GENERATOR
// ==========================================================================
// ==========================================================================
// UPDATED & USER-FRIENDLY VERIFICATION FORM GENERATOR WITH AUTO-CLEAR EXIT
// ==========================================================================
// ======================================================
// GLOBAL FORM CLEANUP & RETURN HOME
// ======================================================

function closeLeadFormAndReturnHome() {

    document.querySelectorAll(".lead-form-card").forEach(el => el.remove());

    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());

    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());

    currentFlow = null;
    currentStep = 0;
    flowData = {};

    const progressNode = document.getElementById("lead-progress");

    if (progressNode) {
        progressNode.classList.add("hidden");
    }

    initializeWelcomeGreeting();
}

function triggerGatedWall(targetActionGoal) {

    // Remove previous forms and buttons
    document.querySelectorAll(".gated-wrapper-panel").forEach(el => el.remove());
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
    document.querySelectorAll(".lead-form-card").forEach(el => el.remove());

    const formContainer = document.createElement("div");
    formContainer.className = "lead-form-card";

    formContainer.innerHTML = `
        <strong>📋 Identity Verification Required:</strong>
        <p>Please provide your details to continue.</p>

        <input type="text" class="lead-name" placeholder="Your Name *">
        <input type="tel" class="lead-phone" placeholder="Phone Number *">
        <input type="text" class="lead-company" placeholder="Company Name (Optional)">

        <button class="verify-btn">
            Verify to Access
        </button>

        <button type="button" class="exit-form-btn">
            ↩️ Cancel & Return to Main Menu
        </button>
    `;

    chatBox.appendChild(formContainer);
    scrollBottom();

    // Cancel Button
    const cancelBtn = formContainer.querySelector(".exit-form-btn");

    cancelBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        formContainer.remove();

        currentFlow = null;
        currentStep = 0;
        flowData = {};

        initializeWelcomeGreeting();
    });

    // Submit Button
    const submitBtn = formContainer.querySelector(".verify-btn");

    submitBtn.addEventListener("click", function(e) {

        e.preventDefault();

        const nameVal =
            formContainer.querySelector(".lead-name").value.trim();

        const phoneVal =
            formContainer.querySelector(".lead-phone").value.trim();

        const companyVal =
            formContainer.querySelector(".lead-company").value.trim();

        if (!nameVal || !phoneVal) {
            alert("Name and Phone Number are required.");
            return;
        }

        flowData.leadName = nameVal;
        flowData.leadPhone = phoneVal;
        flowData.leadCompany =
            companyVal || "Individual/Residential";

        flowData.actionContextTarget = targetActionGoal;

        formContainer.remove();

        processCompletedLeadCaptured();
    });
}
    
document.querySelectorAll(".lead-form-card").forEach((card, index) => {
    if(index !== document.querySelectorAll(".lead-form-card").length - 1){
        card.remove();
    }
});

const exitBtn = formContainer.querySelector("#exitFormBtn");
exitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    formContainer.remove();
    initializeWelcomeGreeting();
});
    document.getElementById("submitGatedLeadBtn").onclick = (e) => {
        e.preventDefault();
        const nameVal = document.getElementById("leadName").value.trim();
        const phoneVal = document.getElementById("leadPhone").value.trim();
        const companyVal = document.getElementById("leadCompany").value.trim();
        
        if (!nameVal || !phoneVal) {
            alert("Name and Phone Number are strictly required fields.");
            return;
        }
        
        flowData.leadName = nameVal;
        flowData.leadPhone = phoneVal;
        flowData.leadCompany = companyVal || "Individual/Residential";
        flowData.actionContextTarget = targetActionGoal;
        
        // Remove the visual form element now that the data is saved
        formContainer.remove();
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
        addBotMessage(`✅ <strong>Thank you, ${flowData.leadName}.</strong> Your request has been verified and processed by Soltech.`, false);
        
        if (flowData.actionContextTarget && flowData.actionContextTarget.includes("Brochure")) {
            addBotMessage(`🎉 <strong>Access Granted:</strong> <a href="#" onclick="alert('Starting your Soltech technical brochure download...'); return false;" class="download-link">Click here to download the brochure file</a>.`, false);
        } else {
            addBotMessage(`📞 Our engineering team will connect with you shortly at <strong>${flowData.leadPhone}</strong> to conduct your live system demo.`, false);
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

    if (cleanText === "↩️ Back to Main Menu" || cleanText.toLowerCase() === "back" || cleanText.toLowerCase() === "menu") {
        initializeWelcomeGreeting();
        return;
    }

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

    if (currentFlow !== null) {
        handleFlowStep(cleanText);
        return;
    }

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

function injectActionMenuButtons(buttonLabelList, includeBackButton = false) {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());
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
        backBtn.innerHTML = "<i class='fas fa-arrow-left'></i> Main Menu";
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
        injectActionMenuButtons(KEYWORD_OPTIONS, true);
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

// Global scope helpers for HTML element callbacks
window.initializeWelcomeGreeting = initializeWelcomeGreeting;

function scrollBottom() { if (chatBox) chatBox.scrollTop = chatBox.scrollHeight; }
function saveChat() { if (chatBox) localStorage.setItem("Soltech_chat", chatBox.innerHTML); }

function loadChat() {
    let chat = localStorage.getItem("Soltech_chat");
    if (chat) {
        if (chat.includes('logo.png')) {
            chat = chat.replace(/logo.png/g, 'logo.jpg');
            localStorage.setItem("Soltech_chat", chat);
        }
        chatBox.innerHTML = chat;
    } else {
        initializeWelcomeGreeting();
    }
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
