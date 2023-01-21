export {};

describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("allows user to login", () => {
    cy.get("[name=password]").type(Cypress.env("PASSWORD"), { log: false });
    cy.get("[type=submit]").contains("Submit").click();
    cy.get("[type=submit]").contains("Logout");
  });

  it("displays invalid password when given wrong password", () => {
    cy.get("[name=password]").type("This is not the password.");
    cy.get("[type=submit]").contains("Submit").click();
    cy.get("div").contains("Invalid password");
  });

  it("allows user to logout", () => {
    cy.login(Cypress.env("PASSWORD"));
    cy.get("[type=submit]").contains("Logout").click();
    cy.get('a[href*="login"]');
  });
});
