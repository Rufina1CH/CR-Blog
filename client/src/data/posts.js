// // src/data/posts.js
// export const basePosts = [
//   {
//     id: "1",
//     title: "Top 5 Skincare Trends That Are Taking Over 2025",
//     author: "Ananya",
//     createdAt: new Date().toISOString(),
//     content:
//       "From skin cycling to barrier-repair serums, the beauty industry is leaning toward skin health over harsh treatments. Discover what ingredients are trending and how to personalize your skincare routine for long-term results.",
//     tags: ["beauty", "skincare", "glow", "selfcare", "trends", "makeup"],
//     image:
//       "https://fastly.picsum.photos/id/21/3008/2008.jpg?hmac=T8DSVNvP-QldCew7WD4jj_S3mWwxZPqdF0CNPksSko4",
//   },
//   {
//     id: "2",
//     title: "The Rise of Edge Computing in 2025",
//     author: "Rohan Mehta",
//     createdAt: new Date().toISOString(),
//     content:
//       "Edge computing is revolutionizing how data is processed, especially with IoT and AI. Instead of relying on centralized cloud servers, edge devices now process data locally, reducing latency and improving speed. This article explores its applications in smart homes, healthcare, and autonomous vehicles.",
//     tags: ["technology", "edge computing", "IoT", "AI", "cloud", "innovation"],
//     image:
//       "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
//   },
//   {
//     id: "3",
//     title: "Minimalist Living: A Guide to Declutter Your Life",
//     author: "Sanjay Minimal",
//     createdAt: new Date(Date.now() - 9000000).toISOString(),
//     content:
//       "Minimalism is not about having less; it's about making room for more of what matters. Start by decluttering your physical space—donate or discard items unused in 6 months. Practice digital minimalism by limiting screen time and notifications. Embrace intentional living, focusing on purpose-driven choices and quality over quantity.",
//     tags: ["lifestyle", "minimalism", "productivity"],
//     image:
//       "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
//   },
//   {
//     id: "4",
//     title: "The Rise of AI-Powered Personal Assistants",
//     author: "Neha AI",
//     createdAt: new Date(Date.now() - 13000000).toISOString(),
//     content:
//       "AI assistants like Siri, Alexa, and Google Assistant have transformed daily life. In 2025, newer models integrate emotional intelligence and personalized responses using large language models (LLMs). These AI tools now manage calendars, automate tasks, generate content, and support accessibility. However, privacy concerns and ethical guidelines must evolve in parallel.",
//     tags: ["technology", "ai", "future"],
//     image:
//       "https://fastly.picsum.photos/id/1056/800/600.jpg?hmac=UsPVKvGDCpvVEU5TGCG0BJwFmjdrxEjUm1IKdb3lNz8",
//   },
//   {
//     id: "5",
//     title: "Hair Care Routine for Monsoon Season",
//     author: "Divya Style",
//     createdAt: new Date(Date.now() - 17000000).toISOString(),
//     content:
//       "Humidity during monsoons can wreak havoc on your hair. Wash your hair regularly with mild, sulfate-free shampoos to avoid scalp infections. Use lightweight conditioners to combat frizz. Avoid heat styling and dry your hair naturally. Oil your hair once a week and trim split ends to maintain healthy volume and shine.",
//     tags: ["beauty", "haircare", "monsoon"],
//     image:
//       "https://fastly.picsum.photos/id/1035/800/600.jpg?hmac=0KbwHUTdjSYZ5v9NBv0yM_4kp1RMwZytvGiFgH0g-EE",
//   },
//   {
//     id: "6",
//     title: "Digital Detox: Why You Need One This Weekend",
//     author: "Anil Zen",
//     createdAt: new Date(Date.now() - 20000000).toISOString(),
//     content:
//       "We check our phones over 90 times a day. A digital detox helps reset your mind, improves sleep, and reduces anxiety. Try a 24-hour break—log out of social media, turn off push notifications, and engage in offline activities like journaling, walking, or spending quality time with loved ones.",
//     tags: ["lifestyle", "mental health", "wellness"],
//     image:
//       "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
//   },
//   {
//     id: "7",
//     title: "React vs Svelte: Which Should You Learn?",
//     author: "Arjun Dev",
//     createdAt: new Date(Date.now() - 24000000).toISOString(),
//     content:
//       "React remains the industry standard for large-scale apps, backed by Meta and a vast ecosystem. Svelte, on the other hand, offers a fresh approach—compiling away the framework, resulting in smaller bundle sizes and faster load times. Beginners may prefer Svelte’s simplicity, while companies stick with React for its mature ecosystem.",
//     tags: ["technology", "react", "svelte"],
//     image:
//       "https://fastly.picsum.photos/id/1039/800/600.jpg?hmac=RW3SsyZzh66wCUm22eFfErVpOEQG4WLURGlD3dj5nqA",
//   },
//   {
//     id: "8",
//     title: "Makeup Trends to Try This Festive Season",
//     author: "Kavya Glow",
//     createdAt: new Date(Date.now() - 28000000).toISOString(),
//     content:
//       "This festive season, glam up with holographic highlighters, bold graphic liners, and rich berry lipsticks. Try airbrush foundations for flawless coverage. Pair your outfit with nail art inspired by ethnic prints. Keep a setting spray handy to lock in the look through long celebration hours.",
//     tags: ["beauty", "makeup", "trends"],
//     image:
//       "https://fastly.picsum.photos/id/1050/800/600.jpg?hmac=ewIE6-FNMC58DEYXdnzsfIlXHoqlWBdu4NKnzRzk88I",
//   },
//   {
//     id: "9",
//     title: "Morning Routines of Successful Entrepreneurs",
//     author: "Priya Routine",
//     createdAt: new Date(Date.now() - 32000000).toISOString(),
//     content:
//       "Entrepreneurs like Tim Cook and Indra Nooyi start their day early—often before 5 AM. A powerful routine includes hydration, 30 minutes of exercise, goal journaling, and focused planning. Avoiding social media and emails first thing in the morning helps boost productivity and mental clarity throughout the day.",
//     tags: ["lifestyle", "habits", "success"],
//     image:
//       "https://fastly.picsum.photos/id/1005/800/600.jpg?hmac=dHoC_CFrQO_JZY2BqzCyTkOHpBRzh0Mso3mhdmW2vm0",
//   },
//   {
//     id: "10",
//     title: "Quantum Computing Demystified",
//     author: "Dr. Raghav Nair",
//     createdAt: new Date(Date.now() - 36000000).toISOString(),
//     content:
//       "Quantum computing harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Concepts like superposition and entanglement allow qubits to perform parallel computations. Applications include drug discovery, cryptography, and financial modeling. Major players include IBM, Google, and startups like Rigetti and IonQ.",
//     tags: ["technology", "quantum", "computing"],
//     image:
//       "https://fastly.picsum.photos/id/1015/800/600.jpg?hmac=STvZdTzFPtOYeNaZnUg0vAv0Mv5YJ9FuOX9bYq_OsKs",
//   },
// ];

// migrated these static to db successfully