const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Trainer = require("./models/Trainer");
const ChatbotRule = require("./models/ChatbotRule");

dotenv.config();

const seedData = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      console.error("❌ Seeder cannot run in production!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await User.deleteMany();
    await Trainer.deleteMany();
    await ChatbotRule.deleteMany();
    console.log("🗑️  Existing data cleared");

    await User.create({ name: "Admin User", email: "admin@gym.com", password: "admin123", role: "admin" });
    console.log("✅ Admin created: admin@gym.com");

    await User.create({ name: "Ali Khan", email: "ali@example.com", password: "member123", role: "member" });
    console.log("✅ Member created: ali@example.com");

    await Trainer.insertMany([
      {
        name: "Imran Ullah",
        specialisation: "Fitness & Fat Loss",
        bio: "Official PCB (Pakistan Cricket Board) certified fitness coach with 8 years of experience. Specialises in functional fitness, fat loss programs, and athletic conditioning.",
        experience: 8,
        contact: "0300-1234567",
        gender: "male",
        profileImage: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop",
        schedule: [
          { day: "Monday",    startTime: "08:00", endTime: "12:00", sessionType: "Fitness Training" },
          { day: "Wednesday", startTime: "08:00", endTime: "12:00", sessionType: "Fat Loss" },
          { day: "Friday",    startTime: "08:00", endTime: "12:00", sessionType: "Fitness Training" },
          { day: "Saturday",  startTime: "07:00", endTime: "10:00", sessionType: "Athletic Conditioning" },
        ],
        rating: 4.9,
      },
      {
        name: "Waqas Ahmad",
        specialisation: "Bodybuilding & Bulking",
        bio: "Professional competitive bodybuilder with extensive experience in bulking and cutting cycles. Helps clients achieve maximum muscle hypertrophy and contest-ready physiques.",
        experience: 7,
        contact: "0311-9876543",
        gender: "male",
        profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        schedule: [
          { day: "Tuesday",  startTime: "07:00", endTime: "11:00", sessionType: "Bulking Program" },
          { day: "Thursday", startTime: "07:00", endTime: "11:00", sessionType: "Bodybuilding" },
          { day: "Saturday", startTime: "09:00", endTime: "13:00", sessionType: "Cutting Program" },
        ],
        rating: 4.7,
      },
      {
        name: "Mukhtiar Ahmad",
        specialisation: "Bodybuilding",
        bio: "Former competitive bodybuilder and proud Mr. Peshawar title holder. Brings championship-level expertise to help clients build impressive physiques.",
        experience: 6,
        contact: "0333-5556789",
        gender: "male",
        profileImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop",
        schedule: [
          { day: "Monday",    startTime: "14:00", endTime: "18:00", sessionType: "Bodybuilding" },
          { day: "Wednesday", startTime: "14:00", endTime: "18:00", sessionType: "Muscle Building" },
          { day: "Friday",    startTime: "14:00", endTime: "18:00", sessionType: "Bodybuilding" },
          { day: "Sunday",    startTime: "10:00", endTime: "13:00", sessionType: "Physique Training" },
        ],
        rating: 4.8,
      },
      {
        name: "Fatima Malik",
        specialisation: "Yoga & Wellness",
        bio: "Certified female yoga instructor specialising in women's fitness and wellness. Expert in Hatha yoga, Vinyasa flow, and mindfulness meditation. Sessions for females only.",
        experience: 5,
        contact: "0321-7778899",
        gender: "female",
        profileImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        schedule: [
          { day: "Monday",    startTime: "09:00", endTime: "11:00", sessionType: "Yoga for Beginners" },
          { day: "Wednesday", startTime: "09:00", endTime: "11:00", sessionType: "Vinyasa Flow" },
          { day: "Friday",    startTime: "09:00", endTime: "11:00", sessionType: "Yoga & Meditation" },
          { day: "Saturday",  startTime: "08:00", endTime: "10:00", sessionType: "Women's Wellness" },
        ],
        rating: 4.9,
      },
    ]);
    console.log("✅ 4 Trainers seeded");

    await ChatbotRule.insertMany([
      { keywords: ["hello", "hi", "hey", "salam"], response: "Hello! Welcome to GetFit Gym. How can I help you today?", context: "general", priority: 1 },
      { keywords: ["membership", "plan", "join", "subscribe"], response: "We offer 3 plans:\n• Basic (Rs. 2000/month)\n• Standard (Rs. 4000/month)\n• Premium (Rs. 7000/month)\nWhich plan interests you?", context: "membership", priority: 2 },
      { keywords: ["price", "cost", "fee", "charges"], response: "Our fees:\n• Basic: Rs. 2,000/month\n• Standard: Rs. 4,000/month\n• Premium: Rs. 7,000/month\nDiscounts on 3 and 6 month packages!", context: "pricing", priority: 2 },
      { keywords: ["timing", "hours", "schedule", "open"], response: "Timings:\n• Mon–Sat: 6:00 AM – 10:00 PM\n• Sunday: 8:00 AM – 6:00 PM\nPremium members get 24/7 access.", context: "schedule", priority: 2 },
      { keywords: ["trainer", "coach", "instructor"], response: "We have certified trainers in fitness, bodybuilding, and yoga. Personal trainers included in the Premium plan.", context: "trainer", priority: 2 },
    ]);
    console.log("✅ Chatbot rules seeded");

    console.log("\n🎉 Seeding complete!");
    console.log("Admin  → admin@gym.com / admin123");
    console.log("Member → ali@example.com / member123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
