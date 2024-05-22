import { useEffect } from "react";

export default function ChatWootWidget() {
  useEffect(() => {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      position: "right",
      type: "expanded_bubble",
      launcherTitle: "Chat with us",
    };
  });

  (function (d, t) {
    var BASE_URL = "https://app.chatwoot.com";
    var g = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src = BASE_URL + "/packs/js/sdk.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);
    g.onload = function () {
      window.chatwootSDK.run({
        websiteToken: "u2Np5DPfCLersXNKRXAPhBpk",
        baseUrl: BASE_URL,
      });
    };
  })(document, "script");

  return null;
}
