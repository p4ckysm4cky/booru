export {};
describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("can visit tags page", () => {
    cy.get('a[href*="tags"]').click();
    cy.url().should("include", "/tags");
  });

  it("does not display upload page when not authenticated", () => {
    cy.get('a[href*="upload"]').should("not.exist");
  });

  it("can visit upload page when authenticated", () => {
    cy.login(Cypress.env("PASSWORD"));
    cy.get('a[href*="upload"]').click();
    cy.url().should("include", "/upload");
  });

  it("can visit upload login", () => {
    cy.get('a[href*="login"]').click();
    cy.url().should("include", "/login");
  });
});
