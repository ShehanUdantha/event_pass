import { useEffect } from "react";
import { chatWootBaseUrl } from "../constants";

export default function ChatWootWidget() {
  useEffect(() => {
    // Chatwoot Settings
    window.chatwootSettings = {
      position: "right",
      type: "expanded_bubble",
      launcherTitle: "Chat with us",
    };
  });

  (function (d, t) {
    var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src = chatWootBaseUrl + "/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function () {
      window.chatwootSDK.run({
        websiteToken: import.meta.env.VITE_CHAT_WOOT_TOKEN,
        baseUrl: chatWootBaseUrl,
      });
    };
  })(document, "script");

  return null;
}
