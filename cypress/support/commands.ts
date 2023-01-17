export {};

/// <reference types="cypress" />

Cypress.Commands.add("login", (password: string) => {
  cy.visit("/login");
  cy.get("[name=password]").type(password, { log: false });
  cy.get("[type=submit]").contains("Submit").click();
});
declare global {
  namespace Cypress {
    interface Chainable {
      login(password: string): Chainable<void>;
    }
  }
}
