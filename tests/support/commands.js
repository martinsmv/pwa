// optional helper commands
Cypress.Commands.add("visitApp", (path = "/") => {
    cy.visit(path);
});