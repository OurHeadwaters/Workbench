(function () {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  var basePath = window.__CODETRY_BASE_PATH__ || "/";
  if (basePath.charAt(basePath.length - 1) !== "/") basePath = basePath + "/";

  var UPDATE_EVENT = "codetry-handbook:update-available";
  var hadControllerAtLoad = !!navigator.serviceWorker.controller;
  var notified = false;

  function notifyUpdateReady() {
    if (notified) return;
    notified = true;
    // Latch the signal on `window` so subscribers that mount after the
    // event fires can still pick it up.
    window.__codetryHandbookUpdateReady = true;
    try {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
    } catch (err) {
      var evt = document.createEvent("Event");
      evt.initEvent(UPDATE_EVENT, true, true);
      window.dispatchEvent(evt);
    }
  }

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    // First-time install also fires controllerchange; only treat it as an
    // update when the page was already controlled when it loaded.
    if (hadControllerAtLoad) {
      notifyUpdateReady();
    }
  });

  function watchRegistration(registration) {
    if (!registration) return;
    registration.addEventListener("updatefound", function () {
      var installing = registration.installing;
      if (!installing) return;
      installing.addEventListener("statechange", function () {
        if (
          installing.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          notifyUpdateReady();
        }
      });
    });
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register(basePath + "sw.js", { scope: basePath })
      .then(function (registration) {
        watchRegistration(registration);
      })
      .catch(function (err) {
        console.warn(
          "Codetry handbook: service worker registration failed",
          err,
        );
      });
  });
})();
