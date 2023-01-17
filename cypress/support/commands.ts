export {};

/// <reference types="cypress" />

Cypress.Commands.add("login", (password: string) => {
  cy.visit("/login");
  cy.get("[name=password]").type(password, { log: false });
  cy.get("[type=submit]").contains("Submit").click();
  cy.getCookie("token").should("exist", "token cookie exists");
});
declare global {
  namespace Cypress {
    interface Chainable {
      login(password: string): Chainable<void>;
    }
  }
}
