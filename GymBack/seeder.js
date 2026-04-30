const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Trainer = require("./models/Trainer");
const ChatbotRule = require("./models/ChatbotRule");

dotenv.config();

const seedData = async () => {
  try {
    // ✅ Safety guard — NEVER run seeder in production
    if (process.env.NODE_ENV === "production") {
      console.error(
        "❌ Seeder cannot run in production! Change NODE_ENV to development first."
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Trainer.deleteMany();
    await ChatbotRule.deleteMany();
    console.log("🗑️  Existing data cleared");

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@gym.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Admin created:", admin.email);

    // Create sample member
    const member = await User.create({
      name: "Ali Khan",
      email: "ali@example.com",
      password: "member123",
      role: "member",
    });
    console.log("✅ Member created:", member.email);

    // Create sample trainers
    await Trainer.insertMany([
      {
        name: "Imran Ullah",
        specialisation: "Fitness Training",
        bio: "Certified fitness trainer at PCB with 5 years of experience in functional fitness and conditioning.",
        experience: 5,
        contact: "0300-1234567",
        schedule: [
          {
            day: "Monday",
            startTime: "08:00",
            endTime: "12:00",
            sessionType: "Fitness Training",
          },
          {
            day: "Wednesday",
            startTime: "08:00",
            endTime: "12:00",
            sessionType: "Fitness Training",
          },
          {
            day: "Friday",
            startTime: "08:00",
            endTime: "12:00",
            sessionType: "Fitness Training",
          },
        ],
        rating: 4.8,
      },
      {
        name: "Waqas Ahmad",
        specialisation: "Bodybuilding & Bulking",
        bio: "Professional bodybuilder specialising in bulking programs and muscle hypertrophy training.",
        experience: 6,
        contact: "0311-9876543",
        schedule: [
          {
            day: "Tuesday",
            startTime: "07:00",
            endTime: "11:00",
            sessionType: "Bulking",
          },
          {
            day: "Thursday",
            startTime: "07:00",
            endTime: "11:00",
            sessionType: "Bodybuilding",
          },
          {
            day: "Saturday",
            startTime: "09:00",
            endTime: "13:00",
            sessionType: "Bulking & Strength",
          },
        ],
        rating: 4.6,
      },
      {
        name: "Mukhtiar",
        specialisation: "Bodybuilding",
        bio: "Experienced bodybuilder helping clients build muscle mass, improve physique, and reach their body composition goals.",
        experience: 4,
        contact: "0333-5556789",
        schedule: [
          {
            day: "Monday",
            startTime: "14:00",
            endTime: "18:00",
            sessionType: "Bodybuilding",
          },
          {
            day: "Wednesday",
            startTime: "14:00",
            endTime: "18:00",
            sessionType: "Muscle Building",
          },
          {
            day: "Friday",
            startTime: "14:00",
            endTime: "18:00",
            sessionType: "Bodybuilding",
          },
        ],
        rating: 4.7,
      },
    ]);
    console.log("✅ Trainers seeded");

    // Create chatbot rules
    await ChatbotRule.insertMany([
      {
        keywords: ["hello", "hi", "hey", "salam"],
        response: "Hello! Welcome to our Gym. How can I help you today?",
        context: "general",
        priority: 1,
      },
      {
        keywords: ["membership", "plan", "join", "subscribe"],
        response:
          "We offer 3 plans:\n• Basic (Rs. 2000/month)\n• Standard (Rs. 4000/month)\n• Premium (Rs. 7000/month)\nWhich plan interests you?",
        context: "membership",
        priority: 2,
      },
      {
        keywords: ["price", "cost", "fee", "charges"],
        response:
          "Our fees:\n• Basic: Rs. 2,000/month\n• Standard: Rs. 4,000/month\n• Premium: Rs. 7,000/month\nDiscounts available for 3 and 6 month packages!",
        context: "pricing",
        priority: 2,
      },
      {
        keywords: ["timing", "hours", "schedule", "open"],
        response:
          "Timings:\n• Mon–Sat: 6:00 AM – 10:00 PM\n• Sunday: 8:00 AM – 6:00 PM\nPremium members get 24/7 access.",
        context: "schedule",
        priority: 2,
      },
      {
        keywords: ["trainer", "coach", "instructor"],
        response:
          "We have certified trainers in weight training, yoga, and cardio. Personal trainers are included in the Premium plan.",
        context: "trainer",
        priority: 2,
      },
    ]);
    console.log("✅ Chatbot rules seeded");

    console.log("\n✅ Seeding complete!");
    console.log("Admin login  → admin@gym.com  / admin123");
    console.log("Member login → ali@example.com / member123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedData();
