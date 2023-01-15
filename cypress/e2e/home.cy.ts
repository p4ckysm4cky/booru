export {};
describe("Home", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("can visit tags page", () => {
    cy.get('a[href*="tags"]').click();
  });

  it("can visit upload page", () => {
    cy.get('a[href*="upload"]').click();
  });

  it("can visit upload login", () => {
    cy.get('a[href*="login"]').click();
  });
});
