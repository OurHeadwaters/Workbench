(function () {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  var basePath = window.__CODETRY_BASE_PATH__ || "/";
  if (basePath.charAt(basePath.length - 1) !== "/") basePath = basePath + "/";

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register(basePath + "sw.js", { scope: basePath })
      .catch(function (err) {
        console.warn("Codetry handbook: service worker registration failed", err);
      });
  });
})();
