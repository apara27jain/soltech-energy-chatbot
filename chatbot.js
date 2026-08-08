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
let flowData = {};
let currentLanguage = "en"; // "en" for English, "hi" for Hindi

const CRM_SETTINGS = {
    WhatsAppNumber: "918239573979",
    InitialHiMessage: "Hi! I want to check solar details for my property.",
    DefaultLeadLocation: "Jaipur",
    LeadStorageWebhook: "https://soltech-energy-chatbot.onrender.com/api/leads"
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

function isValidIndianMobile(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

// ==========================================================================
// TRANSLATION DICTIONARY
// ==========================================================================
const STRINGS = {
    en: {
        welcomeTitle: "Welcome to Soltech Energy! I'm your Solar Assistant.",
        welcomeDesc: "👋 I'm here to help you with questions about rooftop solar, system sizes, subsidies, installation, and estimated costs. How can I help you today? <br> <br> <br> Please note: Every solar system is customized based on your electricity usage, roof space, and site conditions. Any prices shared here are estimated and your final quotation will be provided after a site assessment.",
        backMenu: "↩️ Back to Main Menu",
        mainMenuBtn: "<i class='fas fa-arrow-left'></i> Main Menu",
        gatedTitle: "📋 Identity Verification Required:",
        gatedDesc: "Please provide your name and phone number to unlock automated files or book your live tracking design:",
        placeholderName: "Your Name *",
        placeholderPhone: "Phone Number *",
        placeholderCompany: "Company Name (Optional)",
        placeholderPincode: "Site Pincode (Optional)",
        btnVerify: "Verify to Access",
        btnCancel: "↩️ Cancel & Return to Main Menu",
        reqAlert: "Name and Phone Number are strictly required fields.",
        leadSuccess: "✅ <strong>Thank you, {name}.</strong> Your request has been verified and processed by Soltech.",
        accessGranted: "🎉 <strong>Access Granted:</strong> <a href='#' onclick=\"alert('Starting your Soltech technical brochure download...'); return false;\" class='download-link'>Click here to download the brochure file</a>.",
        teamConnect: "📞 Our engineering team will connect with you shortly at <strong>{phone}</strong> to conduct your live system demo.",
        fallbackResponse: "🤖 For custom engineering schematics, precise Soltech project breakdowns, or fast JVVNL approvals, connect with our desk directly via the options below:",

        homeSolarInfo: `<strong>Residential Solar Solutions</strong><br><br>` +
            `Soltech Energy designs rooftop solar systems for homes based on your electricity usage, available roof space, and site conditions. A well-designed residential solar system can significantly reduce your monthly electricity bill and is eligible for central government subsidy support under the PM Surya Ghar scheme.<br><br>` +
            `Our team manages the complete process, including site assessment, system design, installation, net metering approval, and after-installation support. For an exact quotation, our team will need to review your electricity bill pattern and roof details.`,

        commercialSolarInfo: `<strong>Commercial &amp; Industrial Solar Solutions</strong><br><br>` +
            `Soltech Energy provides solar solutions for businesses, factories, and commercial establishments. A commercial solar installation can help reduce operating costs, protect against rising commercial electricity tariffs, and may qualify for accelerated depreciation tax benefits.<br><br>` +
            `Our team manages the complete project, including site assessment, system design, installation, and regulatory approvals. For an exact proposal, our team will need details about your connected load, monthly electricity expense, and available site area.`,

        maintenanceInfo: `🛠️ <strong>Maintenance &amp; AMC Support</strong><br><br>` +
            `Solar systems have no moving parts, which makes them highly durable. However, regular upkeep helps maintain generation efficiency, especially in Jaipur's dusty environment.<br><br>` +
            `• <strong>Cleaning Cycle:</strong> Panels should be rinsed with water once every 2 weeks. Dust accumulation can reduce output by up to 15%.<br>` +
            `• <strong>Soltech AMC Protection:</strong> Every installation includes 1 Year of Complimentary Comprehensive Maintenance, covering 4 structural and electrical checkups.<br>` +
            `• <strong>Post-Warranty AMC:</strong> Optional Annual Maintenance Contracts are available for ₹3,000 to ₹5,000/year, covering system cleaning, inverter diagnostics, and pressure washing.<br><br>` +
            `For a maintenance visit or AMC enrolment, our team can assist you further.`
    },
    hi: {
        welcomeTitle: "👋 Soltech Energy में आपका स्वागत है! मैं आपका सोलर सहायक हूँ।",
        welcomeDesc: "मैं रूफटॉप सोलर, सिस्टम क्षमता, सरकारी सब्सिडी, इंस्टॉलेशन और अनुमानित लागत से जुड़े आपके प्रश्नों के उत्तर देने के लिए यहाँ हूँ। मैं आपकी किस प्रकार सहायता कर सकता हूँ? <br> <br> <br> कृपया ध्यान दें: प्रत्येक सोलर सिस्टम आपकी मासिक बिजली खपत, छत की उपलब्ध जगह और साइट की वास्तविक परिस्थितियों के अनुसार डिज़ाइन किया जाता है। यहाँ बताई गई कीमतें केवल अनुमानित हैं। अंतिम कोटेशन साइट सर्वे और तकनीकी मूल्यांकन के बाद ही प्रदान किया जाता है।",
        backMenu: "↩️ मुख्य मेनू पर वापस जाएं",
        mainMenuBtn: "<i class='fas fa-arrow-left'></i> मुख्य मेनू",
        gatedTitle: "📋 पहचान सत्यापन आवश्यक:",
        gatedDesc: "फ़ाइलें अनलॉक करने या लाइव डिज़ाइन बुक करने के लिए कृपया अपना नाम और फ़ोन नंबर प्रदान करें:",
        placeholderName: "आपका नाम *",
        placeholderPhone: "फ़ोन नंबर *",
        placeholderCompany: "कंपनी का नाम (वैकल्पिक)",
        placeholderPincode: "साइट पिनकोड (वैकल्पिक)",
        btnVerify: "पहुंच के लिए सत्यापित करें",
        btnCancel: "↩️ रद्द करें और मुख्य मेनू पर लौटें",
        reqAlert: "नाम और फ़ोन नंबर दर्ज करना अनिवार्य है।",
        leadSuccess: "✅ <strong>धन्यवाद, {name}।</strong> आपका अनुरोध सत्यापित कर दिया गया है और सॉलटेक द्वारा संसाधित किया जा रहा है।",
        accessGranted: "🎉 <strong>अनुमति मिली:</strong> <a href='#' onclick=\"alert('सॉलटेक तकनीकी ब्रोशर डाउनलोड शुरू हो रहा है...'); return false;\" class='download-link'>ब्रोशर फ़ाइल डाउनलोड करने के लिए यहाँ क्लिक करें</a>.",
        teamConnect: "📞 हमारी engineering टीम आपके लाइव सिस्टम डेमो के लिए जल्द ही आपसे <strong>{phone}</strong> पर संपर्क करेगी।",
        fallbackResponse: "🤖 कस्टम इंजीनियरिंग योजनाओं, सटीक सॉलटेक प्रोजेक्ट विवरण या तेज़ JVVNL स्वीकृतियों के लिए, नीचे दिए गए विकल्पों के माध्यम से सीधे हमारे डेस्क से जुड़ें:",

        homeSolarInfo: `<strong>आवासीय सोलर समाधान</strong><br><br>` +
            `सॉलटेक एनर्जी आपके घर के लिए रूफटॉप सोलर सिस्टम को आपकी बिजली खपत, उपलब्ध छत क्षेत्र और साइट की परिस्थितियों के अनुसार डिज़ाइन करता है। एक उचित रूप से डिज़ाइन किया गया आवासीय सोलर सिस्टम आपके मासिक बिजली बिल को काफी हद तक कम कर सकता है और PM Surya Ghar योजना के तहत केंद्र सरकार की सब्सिडी के लिए पात्र है।<br><br>` +
            `हमारी टीम साइट असेसमेंट, सिस्टम डिज़ाइन, इंस्टॉलेशन, नेट मीटरिंग अनुमोदन और इंस्टॉलेशन के बाद के सहयोग सहित पूरी प्रक्रिया का प्रबंधन करती है। सटीक कोटेशन के लिए, हमारी टीम को आपके बिजली बिल पैटर्न और छत के विवरण की समीक्षा करनी होगी।`,

        commercialSolarInfo: `<strong>वाणिज्यिक और औद्योगिक सोलर समाधान</strong><br><br>` +
            `सॉलटेक एनर्जी व्यवसायों, फैक्ट्रियों और वाणिज्यिक प्रतिष्ठानों के लिए सोलर समाधान प्रदान करता है। एक वाणिज्यिक सोलर इंस्टॉलेशन परिचालन लागत को कम करने, बढ़ते वाणिज्यिक बिजली टैरिफ से सुरक्षा प्रदान करने और त्वरित मूल्यह्रास कर लाभ (Accelerated Depreciation) के लिए पात्र होने में मदद कर सकता है।<br><br>` +
            `हमारी टीम साइट असेसमेंट, सिस्टम डिज़ाइन, इंस्टॉलेशन और नियामक अनुमोदन सहित पूरी परियोजना का प्रबंधन करती है। सटीक प्रस्ताव के लिए, हमारी टीम को आपके कनेक्टेड लोड, मासिक बिजली खर्च और उपलब्ध साइट क्षेत्र के विवरण की आवश्यकता होगी।`,

        maintenanceInfo: `🛠️ <strong>रखरखाव और एएमसी सहायता</strong><br><br>` +
            `सोलर सिस्टम में कोई गतिशील पुर्जे नहीं होते, जिससे ये अत्यधिक टिकाऊ होते हैं। हालांकि, जयपुर के धूल भरे वातावरण में नियमित रखरखाव generation efficiency बनाए रखने में मदद करता है।<br><br>` +
            `• <strong>सफाई चक्र:</strong> पैनल को हर 2 सप्ताह में पानी से साफ करना चाहिए। धूल जमा होने से आउटपुट में 15% तक की कमी आ सकती है।<br>` +
            `• <strong>सॉलटेक एएमसी सुरक्षा:</strong> हर इंस्टॉलेशन के साथ 1 वर्ष की निःशुल्क व्यापक मेंटेनेंस मिलती है, जिसमें 4 structural और electrical checkups शामिल हैं।<br>` +
            `• <strong>वारंटी के बाद एएमसी:</strong> वैकल्पिक Annual Maintenance Contract ₹3,000 से ₹5,000/वर्ष में उपलब्ध हैं, जिसमें सिस्टम क्लीनिंग, इन्वर्टर डायग्नोस्टिक्स और प्रेशर वाशिंग शामिल है।<br><br>` +
            `मेंटेनेंस विज़िट या एएमसी एनरोलमेंट के लिए, हमारी टीम आपकी सहायता कर सकती है।`
    }
};

const MENUS = {
    en: {
        main: ["Get a Free Quote", "Request a Site Visit", "Financing", "Maintenance", "Talk to an Expert"]
    },
    hi: {
        main: ["मुफ्त कोटेशन प्राप्त करें", "साइट विज़िट का अनुरोध करें", "वित्तीय सहायता", "रखरखाव", "विशेषज्ञ से बात करें"]
    }
};

// =====================================
// WINDOW MANAGEMENT
// =====================================
function syncChatOpenState() {
    if (!chatbotContainer) return;
    const isOpen = chatbotContainer.classList.contains("open");
    document.body.classList.toggle("chat-is-open", isOpen);
    if (chatToggle) chatToggle.setAttribute("aria-expanded", String(isOpen));
}

if (chatbotContainer && !window.matchMedia("(max-width: 480px)").matches) {
    chatbotContainer.classList.add("open");
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
    const tab1 = document.getElementById("tab-solar-solutions");
    const tab3 = document.getElementById("tab-subsidy");
    const tab4 = document.getElementById("tab-survey");

    if (currentLanguage === "en") {
        if (tab1) tab1.innerHTML = "☀️ Solar Solutions";
        if (tab3) tab3.innerHTML = "📋 Subsidy";
        if (tab4) tab4.innerHTML = "🗓️ Book Survey";
    } else {
        if (tab1) tab1.innerHTML = "☀️ सोलर समाधान";
        if (tab3) tab3.innerHTML = "📋 सब्सिडी";
        if (tab4) tab4.innerHTML = "🗓️ सर्वे बुक करें";
    }
}

// ==========================================================================
// WELCOME INITIALIZER
// ==========================================================================
function initializeWelcomeGreeting() {
    flowData = {};

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
    injectActionMenuButtons(MENUS[currentLanguage].main);
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
// CORE CALCULATIONS ENGINE
// ==========================================================================
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

// ==========================================================================
// TOP TAB ENTRY POINTS
// Each wrapper echoes the tab click into the chat as a user message, then
// triggers the relevant response, so the action is always visible in the
// conversation history.
// ==========================================================================
function openSolarSolutionsTab() {
    addUserMessage(currentLanguage === "en" ? "Solar Solutions" : "सोलर समाधान");
    showSolarSolutionsOptions();
}
window.openSolarSolutionsTab = openSolarSolutionsTab;

function openSubsidyTab() {
    addUserMessage(currentLanguage === "en" ? "Subsidy" : "सब्सिडी");
    showSubsidyInfo();
}
window.openSubsidyTab = openSubsidyTab;

function openBookSurveyTab() {
    addUserMessage(currentLanguage === "en" ? "Book Survey" : "सर्वे बुक करें");
    openSiteVisitDirect();
}
window.openBookSurveyTab = openBookSurveyTab;

// Shared by the Book Survey tab and the "Request a Site Visit" main-menu
// button — both go straight to the lead form, no questions first.
function openSiteVisitDirect() {
    flowData = {};
    triggerGatedWall(currentLanguage === "en" ? "Book Site Survey Plan" : "साइट सर्वेक्षण योजना बुक करें");
}

function showSolarSolutionsOptions() {
    flowData = {};

    const promptText = currentLanguage === "en"
        ? "Please select the type of property:"
        : "कृपया संपत्ति का प्रकार चुनें:";
    const msgDiv = addBotMessage(promptText, false, true);
    injectSolarTypeButtons();
    scrollToElement(msgDiv);
}

function injectSolarTypeButtons() {
    document.querySelectorAll(".quick-actions-wrapper").forEach(el => el.remove());

    const wrapper = document.createElement("div");
    wrapper.className = "quick-actions-wrapper";

    const resLabel = currentLanguage === "en" ? "Residential" : "आवासीय";
    const comLabel = currentLanguage === "en" ? "Commercial" : "वाणिज्यिक";

    const resBtn = document.createElement("button");
    resBtn.className = "quick-btn";
    resBtn.innerText = resLabel;
    resBtn.onclick = () => {
        addUserMessage(resLabel);
        wrapper.remove();
        showHomeSolarInfo();
    };

    const comBtn = document.createElement("button");
    comBtn.className = "quick-btn";
    comBtn.innerText = comLabel;
    comBtn.onclick = () => {
        addUserMessage(comLabel);
        wrapper.remove();
        showCommercialSolarInfo();
    };

    const back = document.createElement("button");
    back.className = "quick-btn back-btn";
    back.innerHTML = STRINGS[currentLanguage].mainMenuBtn;
    back.onclick = () => returnToMainMenu();

    wrapper.appendChild(resBtn);
    wrapper.appendChild(comBtn);
    wrapper.appendChild(back);
    if (chatBox) chatBox.appendChild(wrapper);
}

function showHomeSolarInfo() {
    flowData = {};

    const msgDiv = addBotMessage(STRINGS[currentLanguage].homeSolarInfo, false, true);
    injectGatedActionCTAs();
    scrollToElement(msgDiv);
}
window.showHomeSolarInfo = showHomeSolarInfo;

function showCommercialSolarInfo() {
    flowData = {};

    const msgDiv = addBotMessage(STRINGS[currentLanguage].commercialSolarInfo, false, true);
    injectGatedActionCTAs();
    scrollToElement(msgDiv);
}
window.showCommercialSolarInfo = showCommercialSolarInfo;

function showFinancingInfo() {
    flowData = {};

    renderFinancingOutputs();
}
window.showFinancingInfo = showFinancingInfo;

function showMaintenanceInfo() {
    flowData = {};

    const msgDiv = addBotMessage(STRINGS[currentLanguage].maintenanceInfo, false, true);
    injectGatedActionCTAs();
    scrollToElement(msgDiv);
}
window.showMaintenanceInfo = showMaintenanceInfo;

function showSubsidyInfo() {
    flowData = {};

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

    const msgDiv = addBotMessage(outputHtml, false, true);
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
    scrollToElement(msgDiv);
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
            <input type="text" id="gated-pincode" placeholder="${STRINGS[currentLanguage].placeholderPincode}" autocomplete="off" inputmode="numeric" maxlength="6" style="margin-top:8px;" oninput="this.value = this.value.replace(/\\D/g, '').slice(0, 6);" />
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
    const pincodeVal = document.getElementById("gated-pincode")?.value.trim();

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
    flowData.pincode = pincodeVal || "";

    const payload = {
        name: flowData.clientName,
        phone: flowData.clientPhone,
        company: flowData.clientCompany,
        pincode: flowData.pincode || CRM_SETTINGS.DefaultLeadLocation,
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
function addBotMessage(text, isMenuOptionClick, scrollToTop) {
    const div = document.createElement("div");
    div.className = "bot-message";
    div.innerHTML = `<div class="message-content">${text}</div>`;
    if (chatBox) chatBox.appendChild(div);
    if (scrollToTop) {
        scrollToElement(div);
    } else {
        scrollBottom();
    }
    saveChat();
    return div;
}

// Scrolls the chat box so the given message starts at the top of the
// visible area, instead of jumping to the bottom of the conversation.
function scrollToElement(el) {
    if (chatBox && el) {
        chatBox.scrollTop = Math.max(0, el.offsetTop - 8);
    }
}

// Global scope access wrapper to trigger sub-header horizontal element routes safely
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

function injectActionMenuButtons(optionsArray) {
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

            // Route main-menu entries to their direct response
            if (opt.includes("Visit") || opt.includes("विज़िट")) openSiteVisitDirect();
            else if (opt.includes("Financing") || opt.includes("वित्तीय")) showFinancingInfo();
            else if (opt.includes("Maintenance") || opt.includes("रखरखाव")) showMaintenanceInfo();
            else triggerGatedWall("Direct Expert Consultation Request");
        };
        wrapper.appendChild(btn);
    });

    if (chatBox) chatBox.appendChild(wrapper);
    scrollBottom();
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

        showTyping();
        setTimeout(() => {
            hideTyping();
            addBotMessage(STRINGS[currentLanguage].fallbackResponse, false);
            injectGatedActionCTAs();
        }, 800);
    };
    sendBtn.addEventListener("click", handleInput);
    userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleInput(); });
}

// Clean tab labels after the UI refreshes language state.
updateHorizontalTabsText = function() {
    const labels = currentLanguage === "hi" ? [
        ["tab-solar-solutions", "fa-solar-panel", "सोलर समाधान"],
        ["tab-subsidy", "fa-file-invoice", "सब्सिडी"],
        ["tab-survey", "fa-calendar-check", "सर्वे बुक करें"]
    ] : [
        ["tab-solar-solutions", "fa-solar-panel", "Solar Solutions"],
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
