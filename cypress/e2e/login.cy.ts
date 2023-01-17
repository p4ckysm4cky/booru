export {};

describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("allows user to login", () => {
    cy.get("[name=password]").type(Cypress.env("password"), { log: false });
    cy.get("[type=submit]").contains("Submit").click();
    cy.getCookie("token").should("exist", "token cookie exists");
    cy.get("[type=submit]").contains("Logout").should("be.visible");
  });

  it("displays invalid password when given wrong password", () => {
    cy.get("[name=password]").type("This is not the password.");
    cy.get("[type=submit]").contains("Submit").click();
    cy.get("div").contains("Invalid password").should("be.visible");
  });

  it("can logout", () => {
    cy.login(Cypress.env("password"));
    cy.get("[type=submit]").contains("Logout").click();
    cy.getCookie("token").should("not.exist", "token cookie exists");
  });
});
