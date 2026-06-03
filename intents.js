// ==========================================================================
// Soltech Energy Chatbot Engine - Intent & Knowledge Base Configurations
// intents.js [UPDATED FOR NEW BUTTONS]
// ==========================================================================

const SOLAR_INTENTS = [
    {
        keywords: ["solar cost", "cost", "price", "pricing", "rate", "investment", "how much"],
        responses: [
            `💰 <strong>Soltech Sizing & Price Benchmarks (Jaipur Regional):</strong><br><br>` +
            `Standard residential grid setups are structured as follows (Approx. net of state benchmarks):<br>` +
            `• <strong>3kW System:</strong> ₹1,60,000 to ₹1,80,000 (Ideal for monthly bills ~₹3,000)<br>` +
            `• <strong>5kW System:</strong> ₹2,40,000 to ₹2,70,000 (Ideal for monthly bills ~₹5,000)<br>` +
            `• <strong>10kW System:</strong> ₹4,50,000+ (Commercial/Large residential properties)<br><br>` +
            `💡 <em>Note: These values exclude the direct central government subsidies which slash your out-of-pocket costs significantly.</em>`
        ]
    },
    {
        keywords: ["maintenance & amc", "maintenance", "cleaning", "clean", "service", "amc", "repair", "dust"],
        responses: [
            `🛠️ <strong>Maintenance, Cleaning & Operational Support:</strong><br><br>` +
            `Solar systems have no moving parts, making them incredibly durable! However, Jaipur's dusty environment requires basic upkeep:<br><br>` +
            `• <strong>Cleaning Cycle:</strong> Panels should be water-rinsed once every 2 weeks to maximize generation efficiency. Dust accumulation can drop output by up to 15%.<br>` +
            `• <strong>Soltech AMC Protection:</strong> Every installation comes with <strong>1 Year of Complimentary Comprehensive Maintenance</strong> (includes 4 structural & electrical checkups).<br>` +
            `• <strong>Post-Warranty Cost:</strong> Optional Annual Maintenance Contracts (AMC) range between ₹3,000 to ₹5,000/year for system sweeping, inverter diagnostics, and pressure cleaning.`
        ]
    },
    {
        keywords: ["residential solar", "residential", "home solar", "roof setup"],
        responses: [
            `🏡 <strong>Residential Rooftop Engineering:</strong><br><br>` +
            `Turn your rooftop into an asset. Residential systems in Rajasthan allow you to slash up to 90% of your current JVVNL electricity costs while locking in government subsidies directly into your bank account.`
        ]
    },
    {
        keywords: ["commercial solar", "commercial", "factory", "business", "depreciation"],
        responses: [
            `🏢 <strong>Commercial & Industrial Solar Solutions:</strong><br><br>` +
            `For companies and factories in Jaipur. Protect your business from high commercial tariffs and leverage up to 40% Accelerated Depreciation tax benefits in the first year of deployment.`
        ]
    },
    {
        keywords: ["net metering", "metering", "jvvnl", "grid", "interconnection"],
        responses: [
            `⚡ <strong>JVVNL Net Metering Rules:</strong><br><br>` +
            `Any excess solar energy your roof generates during the day but doesn't use gets automatically fed back into the Jaipur Discom grid. JVVNL adjusts this balance against your night consumption, flashing a massive reduction on your bill.`
        ]
    },
    {
        keywords: ["warranty & life", "warranty", "guarantee", "life", "how long last", "damage"],
        responses: [
            `🛡️ <strong>Ironclad Warranty & Asset Lifespan:</strong><br><br>` +
            `Your solar plant is a long-term asset engineered to perform reliably for decades:<br>` +
            `• <strong>Solar Panels:</strong> 25-Year Linear Performance Warranty (Guaranteed to produce at least 80% efficiency even in year 25).<br>` +
            `• <strong>Solar Inverter:</strong> 5 to 10 Years comprehensive manufacturing warranty.<br>` +
            `• <strong>Soltech Workmanship:</strong> 5-Year assurance covering structural integrity and roof waterproofing joints.`
        ]
    },
    {
        keywords: ["weather safety", "weather", "rain", "wind", "storm", "heat", "monsoon", "leakage"],
        responses: [
            `🌪️ <strong>Weather Engineering & Structural Safety:</strong><br><br>` +
            `We safeguard your roof against Jaipur's intense summer heat waves and heavy monsoon storms:<br>` +
            `• <strong>Wind Resistance:</strong> We use Hot-Dip Galvanized Iron (GI) structures customized to withstand extreme high winds up to 150 km/h.<br>` +
            `• <strong>Zero Roof Leakage:</strong> All anchor fasteners drilled into your roof slab undergo a multi-layer chemical PU waterproofing injection to prevent any future moisture seeping.<br>` +
            `• <strong>Heat Performance:</strong> Our Tier-1 panels are explicitly rated with low thermal degradation coefficients to perform exceptionally well even during 45°C+ summer spikes.`
        ]
    },
    {
        keywords: ["subsidy", "government", "pm surya", "ghar"],
        responses: [
            `🏛️ <strong>National PM-Surya Ghar Subsidy Structure:</strong><br><br>` +
            `Direct financial assistance credited to your bank account post-installation:<br>` +
            `• <strong>1kW System:</strong> ₹30,000 rebate.<br>` +
            `• <strong>2kW System:</strong> ₹60,000 rebate.<br>` +
            `• <strong>3kW to 10kW Systems:</strong> Fixed maximum cap of <strong>₹78,000</strong>.<br><br>` +
            `👉 <em>We handle 100% of the government portal application filings and approval documentation for you.</em>`
        ]
    }
];

/**
 * Parses user input string tokens to query matching intent vectors
 */
function findBestIntent(userMessage) {
    const cleanInput = userMessage.toLowerCase().trim();
    if (!cleanInput) return null;

    let bestMatch = null;
    let maxScore = 0;

    for (const intent of SOLAR_INTENTS) {
        let score = 0;
        for (const keyword of intent.keywords) {
            if (cleanInput.includes(keyword)) {
                score += keyword.length; 
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = intent;
        }
    }

    return bestMatch;
}