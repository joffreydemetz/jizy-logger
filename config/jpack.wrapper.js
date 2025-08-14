/*! jLogger v@VERSION | @DATE | [@BUNDLE] */
(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.console) {
        throw new Error("jLogger requires a window and a console");
    }

    if (typeof global.jLogger !== "undefined") {
        throw new Error("jLogger is already defined");
    }

    // @CODE 

    global.jLogger = jLogger;

})(typeof window !== "undefined" ? window : this);