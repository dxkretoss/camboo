"use client";
import { useEffect, useState } from "react";

export default function GoogleTranslateClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/dwf.js";
    script.defer = true;
    document.body.appendChild(script);

    window.gtranslateSettings = {
      default_language: "en",
      languages: ["en", "fr", "pt"],
      wrapper_selector: ".gtranslate_wrapper",
      switcher_horizontal_position: "right",
    };
  }, []);

  if (!mounted) return null;

  return <div className="gtranslate_wrapper" style={{ margin: "10px 0" }} />;
}
