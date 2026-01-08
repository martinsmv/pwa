describe("Log table", () => {
    it("shows log entries", () => {
        cy.visit("/log");
        cy.contains("Log").should("exist"); // anpassen wenn Überschrift anders
        cy.get("table, .v-data-table").should("exist");
    });
});