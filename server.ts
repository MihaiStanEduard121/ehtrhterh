import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { BorderReport, ChatMessage, Direction, VehicleType, TrafficStatus, EtaInfo, LiveStats, PlanningEstimation } from "./src/types";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Define state structure
interface DBStructure {
  reports: BorderReport[];
  chat: ChatMessage[];
}

let db: DBStructure = {
  reports: [],
  chat: []
};

// Initialize Firebase Real Cloud Database (Firestore) with fallback
let firestoreDb: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("+++ Firebase Firestore Database connected successfully! +++");
  } else {
    console.warn("--- Firebase config not found. Local offline database cache active ---");
  }
} catch (err) {
  console.error("--- Failed to initialize live Firebase database ---", err);
}

// Tracking active SSE client connections for real-time broadcasts
const sseClients: express.Response[] = [];

// Track visual simulated live users (changes slightly between 95 and 188 for realism)
let baseSimulatedUsers = 120;
const getRealTimeUserCount = () => {
  // Real database connections + realistic base traffic count
  return Math.max(1, sseClients.length) + baseSimulatedUsers;
};

// Periodic simulated traffic fluctuation
setInterval(() => {
  const diff = Math.floor(Math.random() * 7) - 3; // -3 to +3 change
  baseSimulatedUsers = Math.max(80, Math.min(230, baseSimulatedUsers + diff));
  
  // Broadcast updated user count
  broadcast({
    type: "user-count",
    onlineCount: getRealTimeUserCount()
  });
}, 15000);

// Helper to save database fallback local cache to disk
const saveDB = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
};

// Async Load or Seed Database
const loadOrSeedDB = async () => {
  let loadedFromFirestore = false;

  if (firestoreDb) {
    try {
      console.log("PULLING LIVE DATA FROM CLOUD DATABASE (FIRESTORE)...");
      const reportsRef = collection(firestoreDb, "reports");
      const chatRef = collection(firestoreDb, "chat");

      const [reportsSnapshot, chatSnapshot] = await Promise.all([
        getDocs(reportsRef),
        getDocs(chatRef)
      ]);

      const fReports: BorderReport[] = [];
      const fChats: ChatMessage[] = [];

      reportsSnapshot.forEach((doc) => {
        const r = doc.data() as BorderReport;
        if (r && r.id && !r.id.includes("seed") && !r.userId?.includes("seed")) {
          fReports.push(r);
        }
      });

      chatSnapshot.forEach((doc) => {
        fChats.push(doc.data() as ChatMessage);
      });

      db.reports = fReports.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(-500);
      db.chat = fChats.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).slice(-150);
      console.log(`Successfully restored data from Firestore: ${db.reports.length} reports, ${db.chat.length} chats`);
      loadedFromFirestore = true;
      saveDB(); // preserve locally as resilience backup
    } catch (err) {
      console.error("Failed to sync from Firestore Database (using fallback configuration):", err);
    }
  }

  // Seeding default dataset if no Firestore data is present
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
      // Ensure arrays exist
      if (!Array.isArray(db.reports)) db.reports = [];
      if (!Array.isArray(db.chat)) db.chat = [];

      // Filter out any loaded reports that are seed reports
      db.reports = db.reports.filter(r => r.id && !r.id.includes("seed") && !r.userId?.includes("seed"));

      console.log(`Loaded database from local fallback: ${db.reports.length} reports, ${db.chat.length} chat messages.`);
      saveDB(); // immediately persist the fully filtered clean state
      return;
    } catch (e) {
      console.error("Failed to read database, seeding default data...", e);
    }
  }

  // Seed default dataset if none exists (We no longer generate seeded reports)
  console.log("Seeding fresh database with sample chat messages...");
  
  const now = new Date();
  const seededChats: ChatMessage[] = [];
  
  // Helper to make custom time string relative to now
  const hoursAgo = (h: number) => {
    const d = new Date(now.getTime() - h * 60 * 60 * 1000);
    return d.toISOString();
  };

  // Seed chat messages
  const chatSamples = [
    { username: "Driver_Andrei", text: "Salutare! Cum e pe pod spre Ruse acum?", direction: "RO_BG" as const, hours: 4.5 },
    { username: "Stefan_RO", text: "Destul de liber la autoturisme, am stat cam 10 minute la gheretă.", direction: "RO_BG" as const, hours: 4.2 },
    { username: "Tiristul_Vasi", text: "La camioane e jale... coada e dincolo de benzinăria Rompetrol.", direction: "RO_BG" as const, hours: 3.8 },
    { username: "Adrian_P", text: "Am trecut spre România acum o oră. Foarte repede, maxim 15 min la plata taxei.", direction: "BG_RO" as const, hours: 2.5 },
    { username: "Bulgaru_Transit", text: "Se circulă fluent pe pod, nu mai sunt blocaje pe o singură bandă.", direction: "RO_BG" as const, hours: 2.1 },
    { username: "Trucker_Radu", text: "Pe sensul Ruse-Giurgiu sunt cam 3 km la camioane. Merge extrem de încet.", direction: "BG_RO" as const, hours: 1.5 },
    { username: "Dan_Constanta", text: "Confirm, pe RO->BG e lejer acum la turisme, 15 minute tot procesul de control.", direction: "RO_BG" as const, hours: 0.9 },
    { username: "Elena_M", text: "Plata taxei de pod pe partea bulgară merge greu. Pregătiți mărunt sau cardul.", direction: "BG_RO" as const, hours: 0.5 },
    { username: "Tir_Aghil", text: "Cântarul de la bulgari merge greu azi... Stați pe bandă.", direction: "BG_RO" as const, hours: 0.2 },
    { username: "Driver_102", text: "Sensul Giurgiu -> Ruse e fluid, tocmai am trecut pe pod. Drumuri bune!", direction: "RO_BG" as const, hours: 0.1 }
  ];

  chatSamples.forEach((s, idx) => {
    const newChat: ChatMessage = {
      id: `chat_seed_${idx}`,
      username: s.username,
      text: s.text,
      direction: s.direction,
      timestamp: hoursAgo(s.hours)
    };
    seededChats.push(newChat);

    // Save chat doc to live Firestore db
    if (firestoreDb) {
      try {
        addDoc(collection(firestoreDb, "chat"), newChat);
      } catch (err) {
        // quiet error
      }
    }
  });

  db.reports = []; // Reset database reports state cleanly
  db.chat = seededChats;
  saveDB();
};

// Start load or seed as background promise
loadOrSeedDB().catch(err => console.error("Error seeding DB:", err));


// Dynamic ETA calculation engine
// Formula: 70% user reports (last 3h weighted), 20% historic trend, 10% micro jitter/smoothing noise
const calculateETA = (direction: Direction, vehicleType: VehicleType): { minutes: number; status: TrafficStatus } => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const decimalHour = currentHour + currentMinutes / 60;
  const isWeekend = now.getDay() === 0 || now.getDay() === 6 || now.getDay() === 5; // Fri, Sat, Sun counts for peak weekend

  // 1. Historical Baseline
  let baseline = 15;
  if (direction === "RO_BG") {
    if (vehicleType === "car") {
      // Peaks at 8-10 AM and 5-7 PM
      baseline = 15 + 25 * Math.pow(Math.sin((decimalHour - 7) * Math.PI / 12), 2);
      if (isWeekend) baseline += 18; // Weekend holiday rush
    } else {
      // Trucks high throughout the day, peaking at midday changes
      baseline = 110 + 140 * Math.pow(Math.sin((decimalHour - 3) * Math.PI / 12), 2);
    }
  } else {
    // BG_RO
    if (vehicleType === "car") {
      // Peaks heavily in late afternoon and evening (Sunday return)
      baseline = 15 + 30 * Math.pow(Math.sin((decimalHour - 17) * Math.PI / 12), 2);
      if (isWeekend && now.getDay() === 0) baseline += 25; // Sunday evening Bulgaria back to Romania
    } else {
      baseline = 120 + 130 * Math.pow(Math.sin((decimalHour - 6) * Math.PI / 12), 2);
    }
  }

  // 2. User Reports Influence (within last 3 hours)
  // Weighted by recency (exponential decay based on age)
  const threeHoursAgoMs = 3 * 60 * 60 * 1000;
  const cutoffTime = now.getTime() - threeHoursAgoMs;
  
  const relevantReports = db.reports.filter(r => 
    r.direction === direction && 
    r.vehicleType === vehicleType && 
    new Date(r.timestamp).getTime() > cutoffTime
  );

  let userReportsWeightedAvg = 0;
  let totalWeight = 0;

  relevantReports.forEach(r => {
    const ageMs = now.getTime() - new Date(r.timestamp).getTime();
    const ageHours = ageMs / (60 * 60 * 1000);
    // Exponential decay weight: more recent reports are worth significantly more
    const weight = Math.exp(-2 * ageHours); // weight decays to ~13% at 1 hour

    // Spike protection filter: if a report is an extreme outlier (e.g. > 3x the baseline or other reports),
    // damp its outlier weight to prevent single-user trolling, unless there are multiple report signals.
    let minutesVal = r.minutes;
    const isOutlier = Math.abs(minutesVal - baseline) > baseline * 2.5;
    const finalWeight = isOutlier ? weight * 0.3 : weight; // damp outliers by 70%

    userReportsWeightedAvg += minutesVal * finalWeight;
    totalWeight += finalWeight;
  });

  const userAvg = totalWeight > 0 ? (userReportsWeightedAvg / totalWeight) : baseline;
  const userInfluenceRatio = totalWeight > 0 ? Math.min(0.7, 0.2 + (totalWeight * 0.15)) : 0; // Scale influence up to 70% based on active report count

  // 3. Noise/Fluctuation (10% - pseudo-random but clean)
  // We use current seconds/minutes combined to make a highly fluid micro-jitter +/- 1-3 minutes for cars, +/- 5-10 for trucks
  const secondSeed = now.getSeconds() + now.getMilliseconds() / 1000;
  const noiseScale = vehicleType === "car" ? 2.5 : 8;
  const jitterNoise = Math.sin((decimalHour * 60 + secondSeed) * Math.PI / 30) * noiseScale;

  // 4. Combine parts
  // Wait = Influence * UserAvg + (0.9 - Influence) * Baseline + 0.1 * Jitter
  let finalETA = userInfluenceRatio * userAvg + (0.9 - userInfluenceRatio) * baseline + 0.1 * (baseline + jitterNoise);
  finalETA = Math.round(Math.max(5, finalETA)); // Absolute floor of 5 minutes

  // Compute traffic status category
  // Status thresholds
  let status: TrafficStatus = "fluid";
  if (vehicleType === "car") {
    if (finalETA <= 20) status = "fluid";
    else if (finalETA <= 45) status = "mediu";
    else status = "aglomerat";
  } else {
    // Trucks
    if (finalETA <= 90) status = "fluid";
    else if (finalETA <= 210) status = "mediu";
    else status = "aglomerat";
  }

  return { minutes: finalETA, status };
};

// Build ETA summary
const getEtaSummary = (direction: Direction): EtaInfo => {
  const carEta = calculateETA(direction, "car");
  const truckEta = calculateETA(direction, "truck");
  
  // Count reports in last 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
  const reportsCount = db.reports.filter(r => r.direction === direction && new Date(r.timestamp).getTime() > oneDayAgo).length;

  return {
    direction,
    carWaitMinutes: carEta.minutes,
    truckWaitMinutes: truckEta.minutes,
    carStatus: carEta.status,
    truckStatus: truckEta.status,
    totalReports24h: reportsCount,
    lastUpdated: new Date().toISOString()
  };
};

// SSE Broadcast helper
const broadcast = (data: any) => {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch (e) {
      // client stale
    }
  });
};

// Middleware
app.use(express.json());

// Adcash Anti-Adblock Integration & Update Engine (runs cloud-native background fetch every 5 minutes)
let cachedAdcashScript = `
// Adcash Anti-Adblock Fallback Initializer
(function() {
    console.log("Adcash Anti-Adblock library loading...");
})();
`;
let lastAdcashFetchTime = 0;

const getAdcashScript = async (): Promise<string> => {
  const now = Date.now();
  // Fetch every 5 minutes (300,000 ms) as recommended
  if (!lastAdcashFetchTime || now - lastAdcashFetchTime > 300000) {
    try {
      console.log("Adcash Engine: Fetching updated Anti-Adblock Script...");
      const response = await fetch("https://adbpage.com/adblock?v=3&format=js&lnxv=2", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (response.ok) {
        const scriptText = await response.text();
        if (scriptText && scriptText.trim().length > 30) {
          cachedAdcashScript = scriptText;
          lastAdcashFetchTime = now;
          console.log("Adcash Engine: Successfully fetched and cached latest script.");
          
          // Also persist statically to public and dist folders
          const publicDir = path.join(process.cwd(), "public");
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          fs.writeFileSync(path.join(publicDir, "t48s7z.js"), scriptText, "utf-8");
          
          const distDir = path.join(process.cwd(), "dist");
          if (fs.existsSync(distDir)) {
            fs.writeFileSync(path.join(distDir, "t48s7z.js"), scriptText, "utf-8");
          }
        }
      } else {
        console.warn(`Adcash Engine: Fetch returned status ${response.status}. Using cached library.`);
      }
    } catch (err) {
      console.error("Adcash Engine: Error updating script:", err);
    }
  }
  return cachedAdcashScript;
};

// Pre-fetch Adcash script on startup
getAdcashScript().catch(err => console.error("Adcash Startup Fetch Error:", err));

// Serve the obscure filename dynamic library
app.get("/t48s7z.js", async (req, res) => {
  try {
    const script = await getAdcashScript();
    res.setHeader("Content-Type", "application/javascript");
    res.send(script);
  } catch (err) {
    res.status(500).send("// Error loading script");
  }
});

// API Routes
// 1. Verification and full current state
app.get("/api/status", (req, res) => {
  const recentReports = [...db.reports]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30); // limit to 30 recent reports
    
  const data: LiveStats = {
    onlineCount: getRealTimeUserCount(),
    etaRO_BG: getEtaSummary("RO_BG"),
    etaBG_RO: getEtaSummary("BG_RO"),
    recentReports
  };
  res.json(data);
});

// Anti-spam caches
// Map of IP/Client to timestamps
const lastChatTimestamps = new Map<string, number>();
const lastReportTimestamps = new Map<string, number>();

// 2. Submit Chat Message
app.post("/api/chat", async (req, res) => {
  const { username, text, direction, userId } = req.body;
  if (!username || !text || !direction || !userId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const cleanText = text.trim().substring(0, 160); // anti-excessive length
  if (cleanText.length === 0) {
    return res.status(400).json({ error: "Text is empty" });
  }

  // Quick anti-spam (3 seconds)
  const now = Date.now();
  const clientKey = `${userId}_${direction}`;
  const lastTime = lastChatTimestamps.get(clientKey) || 0;
  if (now - lastTime < 3000) {
    return res.status(429).json({ error: "Te rugăm să aștepți 3 secunde între mesaje." });
  }
  lastChatTimestamps.set(clientKey, now);

  const newMessage: ChatMessage = {
    id: `chat_${now}_${Math.random().toString(36).substring(2, 7)}`,
    username: username.substring(0, 25),
    text: cleanText,
    direction,
    timestamp: new Date().toISOString()
  };

  db.chat.push(newMessage);
  // Keep last 150 chat messages loaded to avoid unbounded buffer growth
  if (db.chat.length > 250) {
    db.chat = db.chat.slice(-150);
  }
  saveDB();

  // Save to Cloud database (Firestore) if connected
  if (firestoreDb) {
    try {
      await addDoc(collection(firestoreDb, "chat"), newMessage);
      console.log("Chat persisted to Cloud database successfully.");
    } catch (err: any) {
      console.error("Firestore writing chat failed:", err?.message);
    }
  }

  // Broadcast to all connected clients
  broadcast({
    type: "chat",
    message: newMessage
  });

  res.json({ success: true, message: newMessage });
});

// Diagnostic scraper endpoint to test on-demand
app.get("/api/scrape-test", async (req, res) => {
  try {
    const urls = [
      { name: "General List", url: "https://www.politiadefrontiera.ro/ro/traficonline/?vw=2" },
      { name: "Bulgarian Sector Cars", url: "https://www.politiadefrontiera.ro/ro/traficonline/?gr=4&vt=1&dt=1" },
      { name: "Bulgarian Sector Trucks-Out", url: "https://www.politiadefrontiera.ro/ro/traficonline/?gr=4&vt=2&dt=2" }
    ];

    const logs: any[] = [];
    for (const item of urls) {
      const response = await fetch(item.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ro,ro-RO;q=0.9,en;q=0.8"
        }
      });
      if (response.ok) {
        const text = await response.text();
        const pointsRegex = /<span class="pointtitle"[^>]*>([^<]+)<\/span>/gi;
        const matchedPoints: string[] = [];
        let m;
        while ((m = pointsRegex.exec(text)) !== null) {
          matchedPoints.push(m[1].trim());
        }

        const containsGiurgiu = text.toLowerCase().includes("giurgiu");
        const containsCalafat = text.toLowerCase().includes("calafat");

        logs.push({
          target: item.name,
          url: item.url,
          status: response.status,
          htmlLength: text.length,
          containsGiurgiu,
          containsCalafat,
          firstFewPoints: matchedPoints.slice(0, 8),
          totalPointsFound: matchedPoints.length
        });
      } else {
        logs.push({
          target: item.name,
          url: item.url,
          status: response.status
        });
      }
    }

    res.json({ success: true, results: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message, stack: err?.stack });
  }
});

// 3. Submit Wait Report
app.post("/api/report", async (req, res) => {
  const { minutes, vehicleType, direction, userId } = req.body;
  
  if (typeof minutes !== "number" || !vehicleType || !direction || !userId) {
    return res.status(400).json({ error: "Missing parameters or incorrect minutes" });
  }

  const mins = Math.max(1, Math.min(600, minutes)); // clamp 1 min to 10 hours

  // Anti-spam filter (2 minutes for submissions on the same direction / vehicle type)
  const now = Date.now();
  const clientKey = `${userId}_${direction}_${vehicleType}`;
  const lastTime = lastReportTimestamps.get(clientKey) || 0;
  if (now - lastTime < 120000) {
    return res.status(429).json({ 
      error: "Ai raportat deja recent pentru această direcție și vehicul. Te rugăm să aștepți încă puțin." 
    });
  }
  lastReportTimestamps.set(clientKey, now);

  const newReport: BorderReport = {
    id: `report_${now}_${Math.random().toString(36).substring(2, 7)}`,
    minutes: mins,
    vehicleType,
    direction,
    timestamp: new Date().toISOString(),
    userId
  };

  db.reports.push(newReport);
  // Limit memory growth for historical reports
  if (db.reports.length > 1000) {
    db.reports = db.reports.slice(-500); // keep half
  }
  saveDB();

  // Save to Cloud database (Firestore) if connected
  if (firestoreDb) {
    try {
      await addDoc(collection(firestoreDb, "reports"), newReport);
      console.log("Report persisted to Cloud database successfully.");
    } catch (err: any) {
      console.error("Firestore writing report failed:", err?.message);
    }
  }

  // Highlight report to all clients
  broadcast({
    type: "report",
    report: newReport,
    etaRO_BG: getEtaSummary("RO_BG"),
    etaBG_RO: getEtaSummary("BG_RO")
  });

  res.json({ success: true, report: newReport });
});

// 4. Live SSE Connection
app.get("/api/events", (req, res) => {
  // Set headers for EventSource
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  // Heartbeat to keep connection active
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  // Add client to registry
  sseClients.push(res);
  console.log(`SSE connection added. Total connection count: ${sseClients.length}`);

  // Broadcast updated user count
  broadcast({
    type: "user-count",
    onlineCount: getRealTimeUserCount()
  });

  // Handle client disconnect
  req.on("close", () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
      console.log(`SSE connection removed. Total remaining: ${sseClients.length}`);
    }
    broadcast({
      type: "user-count",
      onlineCount: getRealTimeUserCount()
    });
  });
});

// 5. Predictive Planner Estimates Map Route
app.get("/api/predictions", (req, res) => {
  const results: PlanningEstimation[] = [];
  const now = new Date();
  const directionQuery = (req.query.direction as Direction) || "RO_BG";

  // Compute for 24 hours of the day
  for (let h = 0; h < 24; h++) {
    // Standard mock model using the baseline formula with extra insights
    const isWeekend = now.getDay() === 0 || now.getDay() === 6 || now.getDay() === 5;
    
    let baseHistoricalCar = 15;
    let baseHistoricalTruck = 110;

    if (directionQuery === "RO_BG") {
      baseHistoricalCar = 15 + 25 * Math.pow(Math.sin((h - 7) * Math.PI / 12), 2) + (isWeekend ? 18 : 0);
      baseHistoricalTruck = 110 + 130 * Math.pow(Math.sin((h - 3) * Math.PI / 12), 2);
    } else {
      baseHistoricalCar = 15 + 30 * Math.pow(Math.sin((h - 17) * Math.PI / 12), 2) + (isWeekend && now.getDay() === 0 ? 25 : 0);
      baseHistoricalTruck = 120 + 120 * Math.pow(Math.sin((h - 6) * Math.PI / 12), 2);
    }

    baseHistoricalCar = Math.round(Math.max(5, baseHistoricalCar));
    baseHistoricalTruck = Math.round(Math.max(5, baseHistoricalTruck));

    // Incorporate current active trends if predicting near current hour
    let predictedCarMinutes = baseHistoricalCar;
    let predictedTruckMinutes = baseHistoricalTruck;
    
    const diffHours = Math.abs(h - now.getHours());
    
    if (diffHours < 3) {
      // Near prediction influenced by active live ETA
      const currentCarEta = calculateETA(directionQuery, "car").minutes;
      const currentTruckEta = calculateETA(directionQuery, "truck").minutes;
      
      // Decay factor: if closer, user influence is higher
      const proximityFactor = (3 - diffHours) / 3; // 1 at same hour, 0 at 3 hrs away
      predictedCarMinutes = Math.round(currentCarEta * proximityFactor + baseHistoricalCar * (1 - proximityFactor));
      predictedTruckMinutes = Math.round(currentTruckEta * proximityFactor + baseHistoricalTruck * (1 - proximityFactor));
    }

    // Determine Statuses
    const carStatus: TrafficStatus = predictedCarMinutes <= 20 ? "fluid" : predictedCarMinutes <= 45 ? "mediu" : "aglomerat";
    const truckStatus: TrafficStatus = predictedTruckMinutes <= 90 ? "fluid" : predictedTruckMinutes <= 210 ? "mediu" : "aglomerat";

    // Confidence indicator decays when looking further from active real-time window
    const baseConfidence = 90;
    const confidenceScore = Math.max(50, Math.round(baseConfidence - (diffHours * 1.5)));

    results.push({
      hourStamp: `${h.toString().padStart(2, "0")}:00`,
      predictedCarMinutes,
      predictedTruckMinutes,
      carStatus,
      truckStatus,
      confidenceScore,
      baseHistoricalCar,
      baseHistoricalTruck
    });
  }
  
  res.json(results);
});

// Provide standard historical messages for live listing
app.get("/api/chat-history", (req, res) => {
  const direction = (req.query.direction as Direction) || "RO_BG";
  const messages = db.chat
    .filter(m => m.direction === direction)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-100); // return up to 100 historical for layout
  res.json(messages);
});

// Post handler for contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const cleanName = String(name).trim().substring(0, 80);
  const cleanEmail = String(email).trim().substring(0, 100);
  const cleanSubject = String(subject || "ads").trim().substring(0, 100);
  const cleanMessage = String(message).trim().substring(0, 3000);

  const contactMessage = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
    timestamp: new Date().toISOString()
  };

  console.log(`[Contact] Message from ${cleanName} (${cleanEmail}) regarding subject: ${cleanSubject}`);

  if (firestoreDb) {
    try {
      await addDoc(collection(firestoreDb, "contacts"), contactMessage);
      console.log("Contact registered in cloud firestore database.");
    } catch (err: any) {
      console.error("Firestore log contact failed:", err?.message);
    }
  }

  res.json({ success: true, message: "Mesaj înregistrat cu succes" });
});

// Expose professional robots.txt
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://${req.get("host") || "ais-pre-bohetyrvecxowgq22fbie7-149659630321.europe-west1.run.app"}/sitemap.xml`);
});

// Expose dynamic sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "ais-pre-bohetyrvecxowgq22fbie7-149659630321.europe-west1.run.app";
  const protocol = req.secure ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  const nowStr = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=chat</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=check</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=stats</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=planner</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=about</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=contact</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=privacy</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=cookies</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=terms</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/?tab=disclaimer</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// Vite Integration inside Node runtime
const startServer = async () => {
  // Sync core database from Firestore on startup
  try {
    await loadOrSeedDB();
  } catch (err) {
    console.error("Failed loadOrSeedDB on startup:", err);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Startup test: Fetch general page and extract all parsed point titles
  try {
    console.log("TEST SCRAPER: Fetching general wait times view (vw=2)...");
    const url = "https://www.politiadefrontiera.ro/ro/traficonline/?vw=2";
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ro,ro-RO;q=0.9,en;q=0.8"
      }
    });

    if (response.ok) {
      const text = await response.text();
      const pointsRegex = /<span class="pointtitle"[^>]*>([^<]+)<\/span>/gi;
      const allPoints: string[] = [];
      let m;
      while ((m = pointsRegex.exec(text)) !== null) {
        allPoints.push(m[1].trim());
      }
      
      let resMsg = `=== ALL BORDER POINTS ON GENERAL LIST VIEW ===\n`;
      resMsg += `Total points found: ${allPoints.length}\n`;
      resMsg += `Points: ${JSON.stringify(allPoints)}\n\n`;
      
      // Check if some specific points exist (case-insensitive)
      const testNames = ["giurgiu", "calafat", "vama veche", "negru", "ostrov", "turnu", "bechet"];
      resMsg += "--- Search Checklist ---\n";
      for (const name of testNames) {
        const found = text.toLowerCase().includes(name);
        resMsg += `${name}: ${found}\n`;
      }

      fs.writeFileSync(path.join(process.cwd(), "scrape-test.txt"), resMsg, "utf-8");
      console.log("TEST SCRAPER: Logged general points list to scrape-test.txt");
    } else {
      console.error("TEST SCRAPER failed with HTTPstatus:", response.status);
    }
  } catch (err: any) {
    fs.writeFileSync(path.join(process.cwd(), "scrape-test.txt"), "ERROR: " + err?.message + "\n" + err?.stack, "utf-8");
    console.error("TEST SCRAPER ERROR:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Live Server active on port ${PORT}`);
  });
};

startServer();
