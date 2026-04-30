const ChatbotRule = require("../models/ChatbotRule");

// Default hardcoded rules (fallback if DB is empty)
const DEFAULT_RULES = [
  {
    keywords: ["hello", "hi", "hey", "assalam", "salam"],
    response: "Hello! Welcome to our Gym. How can I help you today?",
    context: "general",
  },
  {
    keywords: ["membership", "plan", "plans", "join", "subscribe"],
    response:
      "We offer 3 membership plans:\n• Basic (Rs. 2000/month) – Gym access + equipment\n• Standard (Rs. 4000/month) – Basic + group classes + sauna\n• Premium (Rs. 7000/month) – Everything + personal trainer + diet consultation\n\nWhich plan interests you?",
    context: "membership",
  },
  {
    keywords: ["price", "cost", "fee", "charges", "rate"],
    response:
      "Our membership fees are:\n• Basic: Rs. 2,000/month\n• Standard: Rs. 4,000/month\n• Premium: Rs. 7,000/month\n\nWe also offer discounts for 3 and 6 month packages!",
    context: "pricing",
  },
  {
    keywords: ["trainer", "coach", "instructor", "personal trainer"],
    response:
      "We have certified trainers specialising in weight training, cardio, yoga, and nutrition. Personal trainers are included in our Premium plan. Want to see trainer profiles?",
    context: "trainer",
  },
  {
    keywords: ["timing", "hours", "time", "schedule", "open", "close"],
    response:
      "Gym Timings:\n• Monday–Saturday: 6:00 AM – 10:00 PM\n• Sunday: 8:00 AM – 6:00 PM\n\nPremium members enjoy 24/7 access.",
    context: "schedule",
  },
  {
    keywords: ["facilities", "equipment", "amenities", "services"],
    response:
      "Our facilities include:\n• Free weights & machines\n• Cardio zone (treadmills, cycles)\n• Group class studio\n• Sauna & steam room\n• Locker rooms\n• Juice bar",
    context: "facilities",
  },
  {
    keywords: ["contact", "phone", "location", "address", "where"],
    response:
      "You can reach us at:\n📞 Phone: +92-91-XXXXXXX\n📍 Location: University Road, Peshawar\n📧 Email: info@gymmanagement.pk",
    context: "general",
  },
  {
    keywords: ["cancel", "refund", "stop", "quit"],
    response:
      "To cancel your membership, please visit the admin desk or go to My Membership in your dashboard. For refund queries, contact our support team.",
    context: "membership",
  },
  {
    keywords: ["bye", "goodbye", "thanks", "thank you"],
    response:
      "Thank you for visiting! Feel free to ask if you have more questions. Stay fit! 💪",
    context: "general",
  },
];

/**
 * Match user message against rules
 * @param {string} message - user input
 * @param {Array} rules - array of rule objects
 * @returns {string} - matched response
 */
const matchRule = (message, rules) => {
  const lowerMsg = message.toLowerCase().trim();

  let bestMatch = null;
  let highestMatchCount = 0;

  for (const rule of rules) {
    const matchCount = rule.keywords.filter((keyword) =>
      lowerMsg.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = rule;
    }
  }

  if (bestMatch && highestMatchCount > 0) {
    return bestMatch.response;
  }

  return "I'm sorry, I didn't understand that. You can ask me about memberships, pricing, trainers, timings, or facilities. 😊";
};

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public
const processMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    // ✅ Limit message length to prevent abuse
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message too long. Please keep it under 500 characters.",
      });
    }

    // Try DB rules first
    const dbRules = await ChatbotRule.find({ isActive: true }).sort({
      priority: -1,
    });
    const rules = dbRules.length > 0 ? dbRules : DEFAULT_RULES;

    const response = matchRule(message, rules);

    res.json({
      success: true,
      userMessage: message,
      botResponse: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chatbot rules
// @route   GET /api/chatbot/rules
// @access  Admin
const getChatbotRules = async (req, res, next) => {
  try {
    const rules = await ChatbotRule.find().sort({ priority: -1 });
    res.json({ success: true, count: rules.length, rules });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new chatbot rule
// @route   POST /api/chatbot/rules
// @access  Admin
const addChatbotRule = async (req, res, next) => {
  try {
    // ✅ FIXED: Replaced req.body with explicit fields only
    const { keywords, response, context, priority, isActive } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        message: "keywords must be a non-empty array",
      });
    }

    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: "response is required" });
    }

    const rule = await ChatbotRule.create({
      keywords,
      response,
      context,
      priority,
      isActive,
    });
    res.status(201).json({ success: true, rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chatbot rule
// @route   PUT /api/chatbot/rules/:id
// @access  Admin
const updateChatbotRule = async (req, res, next) => {
  try {
    // ✅ FIXED: Replaced req.body with explicit fields + added runValidators
    const { keywords, response, context, priority, isActive } = req.body;

    const rule = await ChatbotRule.findByIdAndUpdate(
      req.params.id,
      { keywords, response, context, priority, isActive },
      { new: true, runValidators: true }
    );
    if (!rule)
      return res
        .status(404)
        .json({ success: false, message: "Rule not found" });
    res.json({ success: true, rule });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chatbot rule
// @route   DELETE /api/chatbot/rules/:id
// @access  Admin
const deleteChatbotRule = async (req, res, next) => {
  try {
    const rule = await ChatbotRule.findByIdAndDelete(req.params.id);
    if (!rule)
      return res
        .status(404)
        .json({ success: false, message: "Rule not found" });
    res.json({ success: true, message: "Rule deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processMessage,
  getChatbotRules,
  addChatbotRule,
  updateChatbotRule,
  deleteChatbotRule,
};
