import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

let echo;

export const initEcho = (token) => {
  if (!echo) {
    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "anykey",
      wsHost: "camboo.kretosstechnology.com",
      wsPort: 6001,
      forceTLS: false,
      encrypted: false,
      cluster: "mt1",
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: "https://camboo.kretosstechnology.com/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token || Cookies.get("token")}`,
        },
      },
    });
  }

  return echo;
};

export const getEcho = () => echo;

// Optional: check connection
export const isConnected = () => {
  if (!echo) return false;
  return echo.connector?.pusher?.connection?.state === "connected";
};
