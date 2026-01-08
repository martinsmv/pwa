describe("Analysis basic editing", () => {
    it("shows analysis table", () => {
        cy.visit("/analysis");
        cy.contains("Analysis").should("exist"); // passt an falls Titel anders
        cy.get("table, .v-data-table").should("exist");
    });

    it("shows an error on invalid edit (if edit exists)", () => {
        cy.visit("/analysis");

        // Beispiel: öffne Edit wenn vorhanden (passt evtl. an deine UI an)
        cy.get("body").then(($body) => {
            const hasEdit = $body.find('[data-cy="edit"], .mdi-pencil').length > 0;
            if (!hasEdit) return;

            cy.get('[data-cy="edit"], .mdi-pencil').first().click({ force: true });

            // Speichern ohne Änderungen/invalid -> Fehler erwartet
            cy.contains("Speichern").click({ force: true });
            cy.contains(/fehler|error|ungültig|invalid/i).should("exist");
        });
    });
});