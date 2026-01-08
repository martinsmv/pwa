import "./commands";

Cypress.on("uncaught:exception", (err) => {
    const msg = err?.message || "";

    // Unhandled Axios-Rejections, die wir absichtlich provozieren (Validation / Server)
    if (
        msg.includes("Request failed with status code 400") ||
        msg.includes("Request failed with status code 500")
    ) {
        return false; // Cypress soll nicht abbrechen
    }

    return true;
});