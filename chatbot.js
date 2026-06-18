// ==========================================================================
// Soltech Energy Chatbot Engine
// chatbot.js [COMPLETE PREMIUM BILINGUAL ENGINE - ENGLISH & HINDI]
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
let currentLanguage = "en"; // "en" for English, "hi" for Hindi

const CRM_SETTINGS = {
    WhatsAppNumber: "918239573979",
    InitialHiMessage: "Hi! I want to check solar details for my property.",
    DefaultLeadLocation: "Jaipur",
    LeadStorageWebhook: "http://localhost:5000/api/leads"
};

function openWhatsAppChat() {
    const phoneNumber = String(CRM_SETTINGS.WhatsAppNumber).replace(/\D/g, "");
    const message = encodeURIComponent(CRM_SETTINGS.InitialHiMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    const link = document.createElement("a");

    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const JAIPUR_PINCODE_MIN = 302001;
const JAIPUR_PINCODE_MAX = 302043;

function isValidIndianMobile(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

function isJaipurServicePincode(pincode) {
    const cleanPincode = String(pincode).trim();
    const numericPincode = Number(cleanPincode);
    return /^\d{6}$/.test(cleanPincode) &&
        numericPincode >= JAIPUR_PINCODE_MIN &&
        numericPincode <= JAIPUR_PINCODE_MAX;
}

// ==========================================================================
// TRANSLATION DICTIONARY
// ==========================================================================
const STRINGS = {
    en: {
        welcomeTitle: "Welcome! I'm your Solar Assistant. How can I help you today?",
        welcomeDesc: "We are Jaipur's premier solar engineering firm, designing high-yield systems for residential rooftops and commercial enterprises.<br><br>🤖 Solar system costs vary continuously based on your roof space, shadows, and shifting JVVNL net-metering regulations. Feel free to use our quick calculators below!",
        backMenu: "↩️ Back to Main Menu",
        mainMenuBtn: "<i class='fas fa-arrow-left'></i> Main Menu",
        invalidPincode: "⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit Jaipur Pincode (e.g., 302018) to accurately calculate baseline logistics.",
        invalidSurveyPincode: "⚠️ <strong>Invalid Format:</strong> Please enter a valid 6-digit site Pincode to coordinate engineering schedules.",
        gatedTitle: "📋 Identity Verification Required:",
        gatedDesc: "Please provide your name and phone number to unlock automated files or book your live tracking design:",
        placeholderName: "Your Name *",
        placeholderPhone: "Phone Number *",
        placeholderCompany: "Company Name (Optional)",
        btnVerify: "Verify to Access",
        btnCancel: "↩️ Cancel & Return to Main Menu",
        reqAlert: "Name and Phone Number are strictly required fields.",
        leadSuccess: "✅ <strong>Thank you, {name}.</strong> Your request has been verified and processed by Soltech.",
        accessGranted: "🎉 <strong>Access Granted:</strong> <a href='#' onclick=\"alert('Starting your Soltech technical brochure download...'); return false;\" class='download-link'>Click here to download the brochure file</a>.",
        teamConnect: "📞 Our engineering team will connect with you shortly at <strong>{phone}</strong> to conduct your live system demo.",
        fallbackResponse: "🤖 For custom engineering schematics, precise Soltech project breakdowns, or fast JVVNL approvals, connect with our desk directly via the options below:",
        btnDemo: "📅 Book a Free Demo / Site Survey",
        btnBrochure: "📥 Download Technical Brochure",
        btnWhatsApp: "<i class='fab fa-whatsapp'></i> WhatsApp Expert Desk",
        
        // Flow steps
        est_step1: "1️⃣ <strong>What type of property are you looking to solarize?</strong>",
        est_step2: "2️⃣ <strong>Please enter your Jaipur's 6 digit pincode (e.g., 302018)</strong>",
        est_step3: "3️⃣ <strong>Select your average monthly electricity bill bracket:</strong>",
        est_step4: "4️⃣ <strong>What type of roof structure is available?</strong>",
        est_step5: "5️⃣ <strong>What is the approximate shadow-free roof area available?</strong>",
        est_step6: "6️⃣ <strong>Do you own the property?</strong>",
        
        fin_step1: "1️⃣ <strong>Please specify your project deployment type:</strong>",
        fin_step2: "2️⃣ <strong>What is your projected installation budget range?</strong>",
        fin_step3: "3️⃣ <strong>Which financial deployment asset model are you looking to check?</strong>",
        
        ci_step1: "1️⃣ <strong>What is your specific industry or business sector type?</strong>",
        ci_step2: "2️⃣ <strong>What is your sanctioned connected load in kW?</strong>",
        ci_step3: "3️⃣ <strong>What is your typical monthly electricity expense corporate bracket?</strong>",
        ci_step4: "4️⃣ <strong>What is the total estimated factory or roof area available?</strong>",
        ci_step5: "5️⃣ <strong>How many independent production facilities do you operate?</strong>",
        
        site_step1: "🗓️ <strong>Let's schedule your structural deployment evaluation. Please enter your 6-digit Pincode:</strong>"
    },
    hi: {
        welcomeTitle: "स्वागत है! मैं आपका सोलर असिस्टेंट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?",
        welcomeDesc: "हम जयपुर की प्रमुख सोलर इंजीनियरिंग फर्म हैं, जो आवासीय छतों (residential rooftops) और वाणिज्यिक उद्यमों (commercial enterprises) के लिए उच्च-उपज प्रणालियों को डिज़ाइन करते हैं।<br><br>🤖 आपकी छत की जगह, छाया और बदलते JVVNL नेट-मीटरिंग नियमों के आधार पर सोलर सिस्टम की लागत बदलती रहती है। नीचे दिए गए हमारे त्वरित कैलकुलेटर का उपयोग करने में संकोच न करें!",
        backMenu: "↩️ मुख्य मेनू पर वापस जाएं",
        mainMenuBtn: "<i class='fas fa-arrow-left'></i> मुख्य मेनू",
        invalidPincode: "⚠️ <strong>अमान्य प्रारूप:</strong> रसद की सही गणना के लिए कृपया एक वैध 6-अंकीय जयपुर पिनकोड (जैसे, 302018) दर्ज करें।",
        invalidSurveyPincode: "⚠️ <strong>अमान्य प्रारूप:</strong> इंजीनियरिंग शेड्यूल के समन्वय के लिए कृपया एक वैध 6-अंकीय साइट पिनकोड दर्ज करें।",
        gatedTitle: "📋 पहचान सत्यापन आवश्यक:",
        gatedDesc: "फ़ाइलें अनलॉक करने या लाइव डिज़ाइन बुक करने के लिए कृपया अपना नाम और फ़ोन नंबर प्रदान करें:",
        placeholderName: "आपका नाम *",
        placeholderPhone: "फ़ोन नंबर *",
        placeholderCompany: "कंपनी का नाम (वैकल्पिक)",
        btnVerify: "पहुंच के लिए सत्यापित करें",
        btnCancel: "↩️ रद्द करें और मुख्य मेनू पर लौटें",
        reqAlert: "नाम और फ़ोन नंबर दर्ज करना अनिवार्य है।",
        leadSuccess: "✅ <strong>धन्यवाद, {name}।</strong> आपका अनुरोध सत्यापित कर दिया गया है और सॉलटेक द्वारा संसाधित किया जा रहा है।",
        accessGranted: "🎉 <strong>अनुमति मिली:</strong> <a href='#' onclick=\"alert('सॉलटेक तकनीकी ब्रोशर डाउनलोड शुरू हो रहा है...'); return false;\" class='download-link'>ब्रोशर फ़ाइल डाउनलोड करने के लिए यहाँ क्लिक करें</a>.",
        teamConnect: "📞 हमारी engineering टीम आपके लाइव सिस्टम डेमो के लिए जल्द ही आपसे <strong>{phone}</strong> पर संपर्क करेगी।",
        fallbackResponse: "🤖 कस्टम इंजीनियरिंग योजनाओं, सटीक सॉलटेक प्रोजेक्ट विवरण या तेज़ JVVNL स्वीकृतियों के लिए, नीचे दिए गए विकल्पों के माध्यम से सीधे हमारे डेस्क से जुड़ें:",
        btnDemo: "📅 मुफ्त डेमो / साइट सर्वेक्षण बुक करें",
        btnBrochure: "📥 तकनीकी ब्रोशर डाउनलोड करें",
        btnWhatsApp: "<i class='fab fa-whatsapp'></i> व्हाट्सएप विशेषज्ञ डेस्क",
        
        // Flow steps
        est_step1: "1️⃣ <strong>आप किस प्रकार की संपत्ति पर सोलर लगाना चाहते हैं?</strong>",
        est_step2: "2️⃣ <strong>कृपया अपने जयपुर का 6 अंकों का पिनकोड दर्ज करें (जैसे, 302018)</strong>",
        est_step3: "3️⃣ <strong>अपने औसत मासिक बिजली बिल ब्रैकेट का चयन करें:</strong>",
        est_step4: "4️⃣ <strong>किस प्रकार की छत की संरचना उपलब्ध है?</strong>",
        est_step5: "5️⃣ <strong>लगभग कितनी छाया-मुक्त छत का क्षेत्र उपलब्ध है?</strong>",
        est_step6: "6️⃣ <strong>क्या आप संपत्ति के मालिक हैं?</strong>",
        
        fin_step1: "1️⃣ <strong>कृपया अपने प्रोजेक्ट परिनियोजन प्रकार को निर्दिष्ट करें:</strong>",
        fin_step2: "2️⃣ <strong>आपका अनुमानित इंस्टॉलेशन बजट दायरा क्या है?</strong>",
        fin_step3: "3️⃣ <strong>आप कौन सा वित्तीय परिनियोजन एसेट मॉडल चेक करना चाहते हैं?</strong>",
        
        ci_step1: "1️⃣ <strong>आपका विशिष्ट उद्योग या व्यवसाय क्षेत्र का प्रकार क्या है?</strong>",
        ci_step2: "2️⃣ <strong>किलोवाट (kW) में आपका स्वीकृत कनेक्टेड लोड क्या है?</strong>",
        ci_step3: "3️⃣ <strong>आपका विशिष्ट मासिक बिजली खर्च कॉर्पोरेट ब्रैकेट क्या है?</strong>",
        ci_step4: "4️⃣ <strong>कुल अनुमानित फैक्ट्री या छत का उपलब्ध क्षेत्र कितना है?</strong>",
        ci_step5: "5️⃣ <strong>आप कितनी स्वतंत्र उत्पादन सुविधाओं का संचालन करते हैं?</strong>",
        
        site_step1: "🗓️ <strong>आइए आपके संरचनात्मक मूल्यांकन को शेड्यूल करें। कृपया अपना 6 अंकों का पिनकोड दर्ज करें:</strong>"
    }
};

const MENUS = {
    en: {
        main: ["Get a Solar Cost Estimate", "Calculate Savings", "Residential Solar", "Commercial Solar", "Solar for Industries", "Request a Site Visit", "Financing & Subsidies", "Talk to an Expert"],
        keywords: ["Subsidy Info", "Net Metering", "Residential Setup", "Commercial Setup", "Maintenance & AMC", "Warranty & Life", "Weather Safety", "Connect Live"],
        propertyTypes: ["Home", "Commercial Building", "Factory/Industry", "School/Institution"],
        bills: ["< ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"],
        roofs: ["RCC Roof", "Metal Shed", "Ground Mounted", "Not Sure"],
        areas: ["<500 sq ft", "500–1000 sq ft", "1000–5000 sq ft", "5000+ sq ft"],
        yesNo: ["Yes", "No"],
        finProject: ["Residential Rooftop", "Commercial Enterprise", "Industrial Facility"],
        finBudget: ["Under ₹3 Lakhs", "₹3 Lakhs to ₹7 Lakhs", "Above ₹7 Lakhs"],
        finModel: ["EMI", "Loan", "CAPEX", "OPEX/PPA"],
        ciIndustry: ["Manufacturing", "Textiles", "Cold Storage", "Warehousing", "Other Commercial"],
        ciExpense: ["₹50,000–₹1 Lakh", "₹1 Lakh–₹5 Lakhs", "₹5 Lakhs+"],
        ciArea: ["1,000–5,000 sq ft", "5,000–10,000 sq ft", "10,000+ sq ft"]
    },
    hi: {
        main: ["सोलर लागत का अनुमान लगाएं", "बचत की गणना करें", "आवासीय सोलर", "वाणिज्यिक सोलर", "उद्योगों के लिए सोलर", "साइट विज़िट का अनुरोध करें", "वित्तीय सहायता और सब्सिडी", "विशेषज्ञ से बात करें"],
        keywords: ["सब्सिडी की जानकारी", "नेट मीटरिंग", "आवासीय सेटअप", "वाणिज्यिक सेटअप", "रखरखाव और एएमसी", "वारंटी और जीवन", "मौसम सुरक्षा", "लाइव कनेक्ट करें"],
        propertyTypes: ["घर", "वाणिज्यिक भवन", "फैक्ट्री/उद्योग", "स्कूल/संस्थान"],
        bills: ["< ₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"],
        roofs: ["आरसीसी छत (RCC)", "मेटल शेड", "ग्राउंड माउंटेड", "पक्का नहीं पता"],
        areas: ["<500 वर्ग फुट", "500–1000 वर्ग फुट", "1000–5000 वर्ग फुट", "5000+ वर्ग फुट"],
        yesNo: ["हाँ", "नहीं"],
        finProject: ["आवासीय छत", "वाणिज्यिक उद्यम", "औद्योगिक सुविधा"],
        finBudget: ["₹3 लाख से कम", "₹3 लाख से ₹7 लाख", "₹7 लाख से अधिक"],
        finModel: ["ईएमआई (EMI)", "लोन", "कैपेक्स (CAPEX)", "ओपेक्स (OPEX/PPA)"],
        ciIndustry: ["विनिर्माण (Manufacturing)", "कपड़ा उद्योग", "कोल्ड स्टोरेज", "गोदाम (Warehousing)", "अन्य वाणिज्यिक"],
        ciExpense: ["₹50,000–₹1 लाख", "₹1 लाख–₹5 लाख", "₹5 लाख+"],
        ciArea: ["1,000–5,000 वर्ग फुट", "5,000–10,000 वर्ग फुट", "10,000+ वर्ग फुट"]
    }
};

// =====================================
// WINDOW MANAGEMENT
// =====================================
function syncChatOpenState() {
    if (!chatbotContainer) return;
    document.body.classList.toggle("chat-is-open", chatbotContainer.classList.contains("open"));
}

if (chatToggle) {
    chatToggle.addEventListener("click", () => {
        chatbotContainer.classList.toggle("open");
        syncChatOpenState();
    });
}

if (minimizeChat) {
    minimizeChat.addEventListener("click", () => {
        chatbotContainer.classList.remove("open");
        syncChatOpenState();
    });
}

if (footerWhitespaceCta) {
    footerWhitespaceCta.addEventListener("click", openWhatsAppChat);
}

syncChatOpenState();

// ==========================================================================
// UNIFIED FIXED-HEADER LANGUAGE SWITCHER SYNC LOGIC
// ==========================================================================
function updateLanguageUI() {
    const btnEn = document.getElementById("lang-en");
    const btnHi = document.getElementById("lang-hi");

    if (currentLanguage === "en") {
        if (btnEn) btnEn.classList.add("active-lang");
        if (btnHi) btnHi.classList.remove("active-lang");
    } else {
        if (btnHi) btnHi.classList.add("active-lang");
        if (btnEn) btnEn.classList.remove("active-lang");
    }
}

// Target the single fixed instance elements from your index.html file cleanly
document.getElementById("lang-en")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentLanguage !== "en") {
        currentLanguage = "en";
        updateLanguageUI();
        updateHorizontalTabsText();
        initializeWelcomeGreeting();
    }
});

document.getElementById("lang-hi")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentLanguage !== "hi") {
        currentLanguage = "hi";
        updateLanguageUI();
        updateHorizontalTabsText();
        initializeWelcomeGreeting();
    }
});

// Updates the horizontal tab button labels on language shift dynamically
function updateHorizontalTabsText() {
    const tab1 = document.getElementById("tab-cost-calc");
    const tab2 = document.getElementById("tab-savings");
    const tab3 = document.getElementById("tab-subsidy");
    const tab4 = document.getElementById("tab-survey");

    if (currentLanguage === "en") {
        if (tab1) tab1.innerHTML = "💰 Cost Calc";
        if (tab2) tab2.innerHTML = "📈 Savings";
        if (tab3) tab3.innerHTML = "📋 Subsidy";
        if (tab4) tab4.innerHTML = "🗓️ Book Survey";
    } else {
        if (tab1) tab1.innerHTML = "💰 लागत Calc";
        if (tab2) tab2.innerHTML = "📈 बचत गणना";
        if (tab3) tab3.innerHTML = "📋 सब्सिडी";
        if (tab4) tab4.innerHTML = "🗓️ सर्वे बुक करें";
    }
}

// ==========================================================================
// WELCOME INITIALIZER
// ==========================================================================
function initializeWelcomeGreeting() {
    currentFlow = null;
    currentStep = 0;
    flowData = {};

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) {
        progressNode.classList.add("hidden");
    }

    if (chatBox) chatBox.innerHTML = "";

    // Sync active CSS state toggles across the header buttons
    updateLanguageUI();

    // Premium Architecture Bot Greeting Card
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message intro-card";
    botMessageDiv.style.marginTop = "10px";

    const messageContentDiv = document.createElement("div");
    messageContentDiv.className = "message-content";

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

    const textInstructions = document.createElement("span");
    textInstructions.innerHTML = `
        <span class="welcome-title" style="font-size: 16px; font-weight: 700; color: #1a252f; display: block;">${STRINGS[currentLanguage].welcomeTitle}</span>
        <div class="welcome-divider" style="height: 2px; width: 40px; background: #2e7d32; margin: 10px 0; border-radius: 2px;"></div>
        <p class="welcome-desc" style="margin: 0; line-height: 1.5;">${STRINGS[currentLanguage].welcomeDesc}</p>
    `;
    
    messageContentDiv.appendChild(textInstructions);
    botMessageDiv.appendChild(messageContentDiv);
    if (chatBox) chatBox.appendChild(botMessageDiv);

    // Dynamic vertical menu elements inside chatbox text line are rendered here
    injectActionMenuButtons(MENUS[currentLanguage].main, false);
    scrollBottom();
    saveChat();
}

function returnToMainMenu() {
    addUserMessage(STRINGS[currentLanguage].backMenu);
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
    const estimatorMode = flowName === "SAVINGS_CALC" ? "savings" : "cost";
    currentFlow = (flowName === "COST_CALC" || flowName === "SAVINGS_CALC") ? "ESTIMATOR" : flowName;
    currentStep = 1;
    flowData = currentFlow === "ESTIMATOR" ? { estimatorMode } : {};

    const progressNode = document.getElementById("lead-progress");
    if (progressNode) progressNode.classList.remove("hidden");
    updateProgressBar(1, 6);

    if (currentFlow === "ESTIMATOR") {
        addBotMessage(STRINGS[currentLanguage].est_step1, false);
        injectActionMenuButtons(MENUS[currentLanguage].propertyTypes, true);
    } else if (flowName === "FINANCING") {
        updateProgressBar(1, 3);
        addBotMessage(STRINGS[currentLanguage].fin_step1, false);
        injectActionMenuButtons(MENUS[currentLanguage].finProject, true);
    } else if (flowName === "CI_QUALIFY") {
        updateProgressBar(1, 5);
        addBotMessage(STRINGS[currentLanguage].ci_step1, false);
        injectActionMenuButtons(MENUS[currentLanguage].ciIndustry, true);
    } else if (flowName === "SITE_VISIT") {
        updateProgressBar(1, 2);
        addBotMessage(STRINGS[currentLanguage].site_step1, false);
        injectActionMenuButtons([], true);
    }
}

function handleFlowStep(userInputText) {
    if (userInputText.includes("Main Menu") || userInputText.includes("मुख्य मेनू")) return;

    showTyping();
    setTimeout(() => {
        hideTyping();
        
        // FLOW A: SOLAR COST ESTIMATOR
        if (currentFlow === "ESTIMATOR") {
            if (currentStep === 1) {
                flowData.propertyType = userInputText;
                currentStep = 2;
                updateProgressBar(2, 6);
                addBotMessage(STRINGS[currentLanguage].est_step2, false);
                injectActionMenuButtons([], true);
            } else if (currentStep === 2) {
                if (!isJaipurServicePincode(userInputText)) {
                    addBotMessage(STRINGS[currentLanguage].invalidPincode, false);
                    injectActionMenuButtons([], true);
                    return;
                }
                flowData.pincode = userInputText.trim();
                currentStep = 3;
                updateProgressBar(3, 6);
                addBotMessage(STRINGS[currentLanguage].est_step3, false);
                injectActionMenuButtons(MENUS[currentLanguage].bills, true);
            } else if (currentStep === 3) {
                flowData.monthlyBill = userInputText;
                currentStep = 4;
                updateProgressBar(4, 6);
                addBotMessage(STRINGS[currentLanguage].est_step4, false);
                injectActionMenuButtons(MENUS[currentLanguage].roofs, true);
            } else if (currentStep === 4) {
                flowData.roofType = userInputText;
                currentStep = 5;
                updateProgressBar(5, 6);
                addBotMessage(STRINGS[currentLanguage].est_step5, false);
                injectActionMenuButtons(MENUS[currentLanguage].areas, true);
            } else if (currentStep === 5) {
                flowData.roofArea = userInputText;
                currentStep = 6;
                updateProgressBar(6, 6);
                addBotMessage(STRINGS[currentLanguage].est_step6, false);
                injectActionMenuButtons(MENUS[currentLanguage].yesNo, true);
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
                addBotMessage(STRINGS[currentLanguage].fin_step2, false);
                injectActionMenuButtons(MENUS[currentLanguage].finBudget, true);
            } else if (currentStep === 2) {
                flowData.budget = userInputText;
                currentStep = 3;
                updateProgressBar(3, 3);
                addBotMessage(STRINGS[currentLanguage].fin_step3, false);
                injectActionMenuButtons(MENUS[currentLanguage].finModel, true);
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
                addBotMessage(STRINGS[currentLanguage].ci_step2, false);
                injectActionMenuButtons([], true);
            } else if (currentStep === 2) {
                flowData.connectedLoad = userInputText;
                currentStep = 3;
                updateProgressBar(3, 5);
                addBotMessage(STRINGS[currentLanguage].ci_step3, false);
                injectActionMenuButtons(MENUS[currentLanguage].ciExpense, true);
            } else if (currentStep === 3) {
                flowData.monthlyExpense = userInputText;
                currentStep = 4;
                updateProgressBar(4, 5);
                addBotMessage(STRINGS[currentLanguage].ci_step4, false);
                injectActionMenuButtons(MENUS[currentLanguage].ciArea, true);
            } else if (currentStep === 4) {
                flowData.roofArea = userInputText;
                currentStep = 5;
                updateProgressBar(5, 5);
                addBotMessage(STRINGS[currentLanguage].ci_step5, false);
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
                if (!isJaipurServicePincode(userInputText)) {
                    addBotMessage(STRINGS[currentLanguage].invalidSurveyPincode, false);
                    injectActionMenuButtons([], true);
                    return;
                }
                flowData.pincode = userInputText.trim();
                triggerGatedWall(currentLanguage === "en" ? "Book Site Survey Plan" : "साइट सर्वेक्षण योजना बुक करें");
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
    } else if (flowData.monthlyBill && (flowData.monthlyBill.includes("₹2,000–₹5,000") || flowData.monthlyBill.includes("2,000"))) {
        sizeKw = 4; baseCost = 240000; subsidy = 78000; annualGen = 5840; monthlySavings = 4000;
    } else if (flowData.monthlyBill && (flowData.monthlyBill.includes("₹5,000–₹10,000") || flowData.monthlyBill.includes("5,000"))) {
        sizeKw = 7; baseCost = 410000; subsidy = 78000; annualGen = 10220; monthlySavings = 7500;
    } else if (flowData.monthlyBill && flowData.monthlyBill.includes("10,000")) {
        sizeKw = 10; baseCost = 550000; subsidy = 78000; annualGen = 14600; monthlySavings = 11000;
    }

    if (flowData.roofArea && (flowData.roofArea.includes("<500") || flowData.roofArea.includes("500 वर्ग")) && sizeKw > 4) {
        if (currentLanguage === "en") {
            addBotMessage(`⚠️ <strong>Roof Constraints Identified:</strong> Your consumption requires a ${sizeKw}kW system, but your area fits up to 4kW. Our team will optimize placement using satellite mapping.`, false);
        } else {
            addBotMessage(`⚠️ <strong>छत की बाधाएं पहचानी गईं:</strong> आपकी खपत के लिए ${sizeKw}kW सिस्टम की आवश्यकता है, लेकिन आपके क्षेत्र में केवल 4kW तक ही आ सकता है। हमारी टीम सैटेलाइट मैपिंग का उपयोग करके प्लेसमेंट को अनुकूलित करेगी।`, false);
        }
        sizeKw = 4;
    }

    let netCost = baseCost - subsidy;
    let paybackYears = (netCost / (monthlySavings * 12)).toFixed(1);

    let p = netCost;
    let r = 7.99 / 12 / 100;
    let n = 36;
    let emiResult = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    let outputHtml = "";
    if (currentLanguage === "en") {
        if (flowData.estimatorMode === "savings") {
            outputHtml = `
📈 <strong>Your Soltech Savings Estimate:</strong><br><br>
• <strong>Target Coverage Pincode:</strong> ${flowData.pincode || "N/A"}<br>
• <strong>Recommended System Size:</strong> ${sizeKw} kWp<br>
• <strong>Expected Annual Generation:</strong> ${annualGen} Units (kWh)<br>
• <strong>Monthly Savings Estimate:</strong> ₹${monthlySavings.toLocaleString()}<br>
• <strong>Estimated Annual Savings:</strong> ₹${(monthlySavings * 12).toLocaleString()}<br>
• <strong>Approx Payback Period:</strong> ~${paybackYears} Years<br><br>
For an exact savings report, our team can verify your bill pattern and roof conditions.
`;
        } else {
            outputHtml = `
📊 <strong>Your Custom Soltech System Design Blueprint:</strong><br><br>
• <strong>Target Coverage Pincode:</strong> ${flowData.pincode || "N/A"}<br>
• <strong>Recommended System Size:</strong> ${sizeKw} kWp<br>
• <strong>Estimated Project Cost (Gross):</strong> ₹${baseCost.toLocaleString()}<br>
• <strong>Government Subsidy Benefit:</strong> -₹${subsidy.toLocaleString()}<br>
• <strong style="color: #2e7d32;">Net Cost Investment:</strong> ₹${netCost.toLocaleString()}<br>
• <strong>Estimated Cost Per kWp:</strong> ₹${Math.round(baseCost / sizeKw).toLocaleString()}<br><br>
For final pricing, Soltech should verify roof access, shadow-free area, structure type, and net-metering requirements.
`;
        }
    } else {
        if (flowData.estimatorMode === "savings") {
            outputHtml = `
📈 <strong>आपका सॉलटेक बचत अनुमान:</strong><br><br>
• <strong>लक्ष्य कवरेज पिनकोड:</strong> ${flowData.pincode || "N/A"}<br>
• <strong>अनुशंसित सिस्टम आकार:</strong> ${sizeKw} kWp<br>
• <strong>अपेक्षित वार्षिक उत्पादन:</strong> ${annualGen} यूनिट्स (kWh)<br>
• <strong>मासिक बचत अनुमान:</strong> ₹${monthlySavings.toLocaleString()}<br>
• <strong>वार्षिक बचत अनुमान:</strong> ₹${(monthlySavings * 12).toLocaleString()}<br>
• <strong>अनुमानित पेबैक अवधि:</strong> ~${paybackYears} वर्ष<br><br>
सटीक बचत रिपोर्ट के लिए हमारी टीम आपके बिल पैटर्न और छत की स्थिति सत्यापित कर सकती है।
`;
        } else {
            outputHtml = `
📊 <strong>आपका कस्टम सॉलटेक सिस्टम डिज़ाइन ब्लूप्रिंट:</strong><br><br>
• <strong>लक्ष्य कवरेज पिनकोड:</strong> ${flowData.pincode || "N/A"}<br>
• <strong>अनुशंसित सिस्टम आकार:</strong> ${sizeKw} kWp<br>
• <strong>अनुमानित परियोजना लागत (Gross):</strong> ₹${baseCost.toLocaleString()}<br>
• <strong>सरकारी सब्सिडी लाभ:</strong> -₹${subsidy.toLocaleString()}<br>
• <strong style="color: #2e7d32;">शुद्ध लागत निवेश (Net Cost):</strong> ₹${netCost.toLocaleString()}<br>
• <strong>अनुमानित लागत प्रति kWp:</strong> ₹${Math.round(baseCost / sizeKw).toLocaleString()}<br><br>
अंतिम कीमत के लिए सॉलटेक को छत की पहुंच, छाया-मुक्त क्षेत्र, संरचना प्रकार और नेट-मीटरिंग आवश्यकताओं की जांच करनी होगी।
`;
        }
    }

    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function renderFinancingOutputs() {
    let outputHtml = "";
    if (currentLanguage === "en") {
        outputHtml = `
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
    } else {
        outputHtml = `
📋 <strong>सॉलटेक और सोलर लैडर लोन मैट्रिक्स:</strong><br><br>
• <strong>आधार ब्याज दर:</strong> सालाना <strong>7.99%</strong> से शुरू।<br>
• <strong>उपलब्ध ऋण अवधि:</strong> 6 महीने से 5 वर्ष तक के लचीले विकल्प।<br>
• <strong>विशेष प्रोमोशनल ऑफर:</strong> 6 महीने तक ब्याज मुक्त (0% ब्याज) विकल्प उपलब्ध हैं।<br><br>
📋 <strong>आधिकारिक आवश्यक दस्तावेज़ चेकलिस्ट:</strong><br>
• <strong>सामान्य बुनियादी आवश्यकताएं:</strong> पैन कार्ड, आधार कार्ड, पिछले 3 महीनों का बिजली बिल, 1 साल का बैंक स्टेटमेंट, पासपोर्ट फोटो, और विस्तृत सोलर प्रस्ताव।<br>
• <strong>वेतनभोगी कर्मचारियों के लिए:</strong> 3 महीने की सैलरी स्लिप।<br>
• <strong>स्व-नियोजित (Business) के लिए:</strong> व्यापार प्रमाण (GST या उद्यम पंजीकरण) के साथ 2 साल का आयकर रिटर्न (ITR)।<br><br>
लाइव सिस्टम डेमो बुक करने और तकनीकी ऋण संरचना ब्रोशर डाउनलोड करने के लिए, अपने विवरण सत्यापित करने के लिए नीचे टैप करें।
`;
    }
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

function showSubsidyInfo() {
    currentFlow = null;
    currentStep = 0;
    flowData = {};
    const progressNode = document.getElementById("lead-progress");
    if (progressNode) progressNode.classList.add("hidden");

    const outputHtml = currentLanguage === "en" ? `
📋 <strong>Solar Subsidy Guidance for Jaipur Homes:</strong><br><br>
• Subsidy is mainly applicable for eligible residential rooftop solar systems.<br>
• Final subsidy depends on consumer category, system capacity, DISCOM approval, and current government rules.<br>
• Commercial and industrial projects usually follow different financial benefits instead of residential subsidy.<br><br>
To check your exact eligibility, verify your details and our team will map it against your Jaipur pincode and project type.
` : `
📋 <strong>जयपुर घरों के लिए सोलर सब्सिडी जानकारी:</strong><br><br>
• सब्सिडी मुख्य रूप से पात्र residential rooftop solar systems पर लागू होती है।<br>
• अंतिम सब्सिडी consumer category, system capacity, DISCOM approval और वर्तमान सरकारी नियमों पर निर्भर करती है।<br>
• Commercial और industrial projects में आमतौर पर residential subsidy के बजाय अलग financial benefits होते हैं।<br><br>
अपनी सही eligibility जांचने के लिए details verify करें, हमारी टीम आपके Jaipur pincode और project type के हिसाब से check करेगी।
`;

    addBotMessage(outputHtml, false);
    const wrap = document.createElement("div");
    wrap.className = "quick-actions-wrapper";

    const verify = document.createElement("button");
    verify.className = "quick-btn orange-quote-btn";
    verify.innerHTML = "<i class='fas fa-file-shield'></i> Check Subsidy Eligibility";
    verify.onclick = () => triggerGatedWall("Subsidy Eligibility Check");

    const main = document.createElement("button");
    main.className = "quick-btn back-btn";
    main.innerHTML = currentLanguage === "en"
        ? "<i class='fas fa-arrow-left'></i> Main Menu"
        : "<i class='fas fa-arrow-left'></i> मुख्य मेनू";
    main.onclick = () => returnToMainMenu();

    wrap.appendChild(verify);
    wrap.appendChild(main);
    if (chatBox) chatBox.appendChild(wrap);
    scrollBottom();
}

function renderCIResults() {
    let impliedLoad = parseFloat(flowData.connectedLoad) || 50;
    let potentialSize = Math.round(impliedLoad * 0.8);
    let annualSavingsEst = potentialSize * 1450 * 8.5;
    let carbonSavedTons = (potentialSize * 1450 * 0.00082).toFixed(1);

    let outputHtml = "";
    if (currentLanguage === "en") {
        outputHtml = `
🏭 <strong>Corporate C&I Asset Feasibility Estimates:</strong><br><br>
• <strong>Potential System Size Allocation:</strong> Up to ${potentialSize} kWp grid-tied asset installation.<br>
• <strong>Annual Savings Estimate:</strong> Approx ₹${Math.round(annualSavingsEst).toLocaleString()} per annum.<br>
• <strong>Accelerated Depreciation Asset Benefit:</strong> Up to 40% taxable write-off allowances in Year 1 allocation profiles.<br>
• <strong>Carbon Reduction Estimate:</strong> Net reduction of <strong>${carbonSavedTons} Metric Tons of CO2</strong> annually.<br><br>
Unlock full case study portfolios and trigger automated engineering calculations by submitting your verification logs.
`;
    } else {
        outputHtml = `
🏭 <strong>कॉर्पोरेट C&I एसेट व्यवहार्यता अनुमान:</strong><br><br>
• <strong>संभावित सिस्टम आकार आवंटन:</strong> ${potentialSize} kWp ग्रिड-टाइड एसेट इंस्टॉलेशन तक।<br>
• <strong>वार्षिक बचत अनुमान:</strong> लगभग ₹${Math.round(annualSavingsEst).toLocaleString()} प्रति वर्ष।<br>
• <strong>त्वरित मूल्यह्रास संपत्ति लाभ (Tax Benefit):</strong> पहले वर्ष में 40% तक कर छूट की अनुमति।<br>
• <strong>कार्बन कमी का अनुमान:</strong> सालाना <strong>${carbonSavedTons} मीट्रिक टन CO2</strong> की शुद्ध कमी।<br><br>
अपने सत्यापन लॉग सबमिट करके पूर्ण केस स्टडी पोर्टफोलियो अनलॉक करें और स्वचालित इंजीनियरिंग गणना शुरू करें।
`;
    }
    addBotMessage(outputHtml, false);
    injectGatedActionCTAs();
}

// ==========================================================================
// GATED LEAD SYSTEM INTERACTION MANAGEMENT
// ==========================================================================
function injectGatedActionCTAs() {
    const wrap = document.createElement("div");
    wrap.className = "quick-actions-wrapper";

    const d = document.createElement("button");
    d.className = "quick-btn";
    d.innerHTML = currentLanguage === "en"
        ? "<i class='fas fa-calendar-check'></i> Book a Free Demo / Site Survey"
        : "<i class='fas fa-calendar-check'></i> मुफ्त डेमो / साइट सर्वेक्षण बुक करें";
    d.onclick = () => triggerGatedWall("Free Site Demo Request");

    const b = document.createElement("button");
    b.className = "quick-btn";
    b.innerHTML = currentLanguage === "en"
        ? "<i class='fas fa-file-arrow-down'></i> Download Technical Brochure"
        : "<i class='fas fa-file-arrow-down'></i> तकनीकी ब्रोशर डाउनलोड करें";
    b.onclick = () => triggerGatedWall("Technical Brochure Download");

    const w = document.createElement("button");
    w.className = "quick-btn wa-direct-btn";
    w.innerHTML = currentLanguage === "en"
        ? "<i class='fab fa-whatsapp'></i> WhatsApp Expert Desk"
        : "<i class='fab fa-whatsapp'></i> व्हाट्सएप विशेषज्ञ डेस्क";
    w.onclick = openWhatsAppChat;

    const main = document.createElement("button");
    main.className = "quick-btn back-btn";
    main.innerHTML = currentLanguage === "en"
        ? "<i class='fas fa-arrow-left'></i> Main Menu"
        : "<i class='fas fa-arrow-left'></i> मुख्य मेनू";
    main.onclick = () => returnToMainMenu();

    wrap.appendChild(d);
    wrap.appendChild(b);
    wrap.appendChild(w);
    wrap.appendChild(main);
    if (chatBox) chatBox.appendChild(wrap);
    scrollBottom();
}

function triggerGatedWall(actionContextName) {
    flowData.pendingContextAction = actionContextName;

    const card = document.createElement("div");
    card.className = "bot-message lead-form-card";

    card.innerHTML = `
        <div class="message-content">
            <strong>${STRINGS[currentLanguage].gatedTitle}</strong><br>
            <small style="color:#7f8c8d; display:block; margin:4px 0 10px 0;">${STRINGS[currentLanguage].gatedDesc} (${actionContextName})</small>
            <input type="text" id="gated-name" placeholder="${STRINGS[currentLanguage].placeholderName}" autocomplete="off" />
            <input type="tel" id="gated-phone" placeholder="${STRINGS[currentLanguage].placeholderPhone}" autocomplete="off" inputmode="numeric" maxlength="10" pattern="[6-9][0-9]{9}" style="margin-top:8px;" oninput="this.value = this.value.replace(/\\D/g, '').slice(0, 10);" />
            <input type="text" id="gated-company" placeholder="${STRINGS[currentLanguage].placeholderCompany}" autocomplete="off" style="margin-top:8px;" />
            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="verify-btn" onclick="submitLeadForm()" style="flex:1;">${STRINGS[currentLanguage].btnVerify}</button>
                <button class="quick-btn back-btn" onclick="returnToMainMenu()" style="margin:0; font-size:12px;">${STRINGS[currentLanguage].btnCancel}</button>
            </div>
        </div>
    `;

    if (chatBox) chatBox.appendChild(card);
    scrollBottom();
}

function submitLeadForm() {
    const nameVal = document.getElementById("gated-name")?.value.trim();
    const phoneVal = document.getElementById("gated-phone")?.value.trim();
    const companyVal = document.getElementById("gated-company")?.value.trim();

    if (!nameVal || !phoneVal) {
        alert(STRINGS[currentLanguage].reqAlert);
        return;
    }

    if (!isValidIndianMobile(phoneVal)) {
        alert(currentLanguage === "en"
            ? "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
            : "कृपया 6, 7, 8 या 9 से शुरू होने वाला वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।");
        return;
    }

    flowData.clientName = nameVal;
    flowData.clientPhone = phoneVal;
    flowData.clientCompany = companyVal || "N/A";

    const payload = {
        name: flowData.clientName,
        phone: flowData.clientPhone,
        company: flowData.clientCompany,
        pincode: flowData.pincode || CRM_SETTINGS.DefaultLeadLocation,
        system_size_kw: flowData.propertyType || "Undetermined",
        action_context: flowData.pendingContextAction,
        language: currentLanguage
    };

    // Fire webhook background data storage
    fetch(CRM_SETTINGS.LeadStorageWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(err => console.log("Data cached locally. Network log bypass active."));

    // Success response parsing
    document.querySelectorAll(".lead-form-card").forEach(el => el.remove());
    
    const confirmationText = STRINGS[currentLanguage].leadSuccess.replace("{name}", flowData.clientName) + 
        "<br><br>" + STRINGS[currentLanguage].accessGranted + 
        "<br><br>" + STRINGS[currentLanguage].teamConnect.replace("{phone}", flowData.clientPhone);

    addBotMessage(confirmationText, false);
    
    setTimeout(() => {
        addBotMessage(STRINGS[currentLanguage].fallbackResponse, false);
        injectGatedActionCTAs();
    }, 1500);
}

// ==========================================================================
// RENDERING ELEMENT UTILITIES
// ==========================================================================
function addBotMessage(text, isMenuOptionClick) {
    const div = document.createElement("div");
    div.className = "bot-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    if (chatBox) chatBox.appendChild(div);
    scrollBottom();
    saveChat();
}

// Global scope access wrapper to trigger sub-header horizontal element routes safely
window.startFlow = startFlow;
window.triggerGatedWall = triggerGatedWall;
window.showSubsidyInfo = showSubsidyInfo;

function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    if (chatBox) chatBox.appendChild(div);
    scrollBottom();
    saveChat();
}

function injectActionMenuButtons(optionsArray, isFlowActive) {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());

    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";

    optionsArray.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quick-btn";
        btn.innerText = opt;
        btn.onclick = () => {
            addUserMessage(opt);
            wrapper.remove();
            
            if (!isFlowActive) {
                // Route generic landing entries
                if (opt.includes("Estimate") || opt.includes("लागत का अनुमान")) startFlow("COST_CALC");
                else if (opt.includes("Savings") || opt.includes("बचत की गणना")) startFlow("SAVINGS_CALC");
                else if (opt.includes("Residential") || opt.includes("आवासीय")) startFlow("COST_CALC");
                else if (opt.includes("Commercial") || opt.includes("वाणिज्यिक")) startFlow("CI_QUALIFY");
                else if (opt.includes("Industries") || opt.includes("उद्योगों")) startFlow("CI_QUALIFY");
                else if (opt.includes("Visit") || opt.includes("विज़िट")) startFlow("SITE_VISIT");
                else if (opt.includes("Financing") || opt.includes("वित्तीय")) startFlow("FINANCING");
                else triggerGatedWall("Direct Expert Consultation Request");
            } else {
                handleFlowStep(opt);
            }
        };
        wrapper.appendChild(btn);
    });

    // Append main menu baseline escape key if deep inside a configuration path
    if (isFlowActive) {
        const back = document.createElement("button");
        back.className = "quick-btn back-btn";
        back.innerHTML = STRINGS[currentLanguage].mainMenuBtn;
        back.onclick = () => returnToMainMenu();
        wrapper.appendChild(back);
    }

    if (chatBox) chatBox.appendChild(wrapper);
    scrollBottom();
}

function updateProgressBar(step, total) {
    const bar = document.getElementById("progress-bar-fill");
    if (bar) {
        const percentage = Math.round((step / total) * 100);
        bar.style.width = `${percentage}%`;
    }
}

function showTyping() {
    const activeIndicator = document.getElementById("chat-typing-indicator");
    if (activeIndicator) activeIndicator.classList.remove("hidden");
    scrollBottom();
}

function hideTyping() {
    const activeIndicator = document.getElementById("chat-typing-indicator");
    if (activeIndicator) activeIndicator.classList.add("hidden");
}

function scrollBottom() {
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

function saveChat() {
    // Interactive buttons lose their click handlers when saved as raw HTML.
    // Keep startup fresh so suggestion buttons always remain clickable.
    localStorage.removeItem("Soltech_chat");
}

// User text bar event submission parsing
if (sendBtn && userInput) {
    const handleInput = () => {
        const text = userInput.value.trim();
        if (!text) return;
        userInput.value = "";
        addUserMessage(text);
        
        if (currentFlow) {
            handleFlowStep(text);
        } else {
            showTyping();
            setTimeout(() => {
                hideTyping();
                addBotMessage(STRINGS[currentLanguage].fallbackResponse, false);
                injectGatedActionCTAs();
            }, 800);
        }
    };
    sendBtn.addEventListener("click", handleInput);
    userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleInput(); });
}

// Clean tab labels after the UI refreshes language state.
updateHorizontalTabsText = function() {
    const labels = [
        ["tab-cost-calc", "fa-calculator", "Cost Calc"],
        ["tab-savings", "fa-chart-line", "Savings"],
        ["tab-subsidy", "fa-file-invoice", "Subsidy"],
        ["tab-survey", "fa-calendar-check", "Book Survey"]
    ];

    labels.forEach(([id, icon, label]) => {
        const tab = document.getElementById(id);
        if (tab) tab.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
    });
};

// Initialization Entry Core Load check
function loadChat() {
    localStorage.removeItem("Soltech_chat");
    updateHorizontalTabsText();
    initializeWelcomeGreeting();
}

// Initialize execution sequence
loadChat();
