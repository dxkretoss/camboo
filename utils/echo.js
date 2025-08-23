import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

let echo;

export const initEcho = (token) => {
  if (!echo) {
    echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "anykey",
      wsHost: "camboo.kretosstechnology.com",
      wsPort: 443, // WSS standard port
      forceTLS: true, // WSS must use TLS
      encrypted: true,
      cluster: "mt1",
      disableStats: true,
      enabledTransports: ["wss"], // secure only
      authEndpoint: "https://camboo.kretosstechnology.com/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token || Cookies.get("token")}`,
        },
      },
    });

    const pusher = echo.connector.pusher;

    // 🔹 Bind connection events for debugging
    pusher.connection.bind("connecting", () =>
      console.log("🔄 Pusher connecting...")
    );
    pusher.connection.bind("connected", () =>
      console.log("✅ Pusher connected!")
    );
    pusher.connection.bind("disconnected", () =>
      console.log("❌ Pusher disconnected")
    );
    pusher.connection.bind("error", (err) =>
      console.error("⚠️ Pusher connection error:", err)
    );
    pusher.connection.bind("failed", () =>
      console.error("❌ Pusher connection failed")
    );
  }

  return echo;
};

export const getEcho = () => echo;
