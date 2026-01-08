describe("Sample CRUD basics", () => {
    it("shows samples", () => {
        cy.visit("/sample");
        cy.contains("Sample").should("exist");
        cy.get("table, .v-data-table").should("exist");
    });

    it("shows validation error when creating invalid sample (via API response)", () => {
        cy.visit("/sample");

        // Intercept POST /api/sample und prüfen, dass 4xx kommt
        cy.intercept("POST", "**/api/sample").as("createSample");

        cy.contains(/neu|neuer|new/i).click({ force: true }); // "Neuer Sample"
        cy.contains(/speichern|save/i).click({ force: true });

        cy.wait("@createSample", { timeout: 15000 }).then((i) => {
            expect(i.response, "response exists").to.exist;
            expect(i.response.statusCode, "status code").to.be.oneOf([400, 422]);
            // Optional: wenn Backend message liefert
            // cy.log(JSON.stringify(i.response.body));
        });
    });

    it("can create a sample (if backend supports create)", () => {
        cy.visit("/sample");

        cy.intercept("POST", "**/api/sample").as("createSample");

        const sid = `T${Date.now()}`; // sicher unique
        const stamp = new Date().toISOString().replace(".000Z", "Z");

        cy.contains(/neu|neuer|new/i).click({ force: true });

        cy.get(".v-dialog .v-card", { timeout: 10000 }).should("be.visible").within(() => {
            cy.get("input").then(($inputs) => {
                // 1 = sampleId, 2 = sampleStamp (wie in deinem Dialog)
                cy.wrap($inputs.eq(0)).clear({ force: true }).type(sid, { force: true });
                cy.wrap($inputs.eq(1)).clear({ force: true }).type(stamp, { force: true });
            });

            cy.contains(/speichern|save/i).click({ force: true });
        });

        // Prüfe erst Backend-Resultat
        cy.wait("@createSample", { timeout: 15000 }).then((i) => {
            expect(i.response, "response exists").to.exist;

            if (i.response.statusCode >= 500) {
                // Backend kaputt -> Test soll klar sagen warum
                throw new Error(
                    `Backend returned ${i.response.statusCode} on POST /api/sample. Fix backend create mapping/payload.`
                );
            }

            expect(i.response.statusCode, "status code").to.be.oneOf([200, 201]);
        });

        // Falls erfolgreich: sollte in Tabelle auftauchen
        cy.contains(sid, { timeout: 15000 }).should("exist");
    });
});