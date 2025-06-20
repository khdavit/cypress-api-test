
describe("Verify GET categories", () => {
  it("verify GET /products/categories return an array of category objects with correct fields", () => {
    cy.request("/products/categories").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      response.body.forEach((category: any) => {
        expect(category).to.have.all.keys("slug", "name", "url");

        expect(category.slug).to.be.a("string").and.not.be.empty;
        expect(category.name).to.be.a("string").and.not.be.empty;
        expect(category.url).to.match(
          /^https:\/\/dummyjson\.com\/products\/category\/[\w-]+$/
        );
      });
    });
  });

  it("verify GET /products/category-list returns a valid list of category strings", () => {
    cy.fixture('categories').then((expectedCategories) => {
      cy.request("/products/category-list").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array").and.not.be.empty;

        // verify exact match (length and content)
        expect(response.body).to.have.members(expectedCategories);
        expect(response.body.length).to.eq(expectedCategories.length);
      });
    });
  });

  it(`verify GET /products/category/[category] returns only products with category`, () => {
    const categorySlug = "smartphones";
    cy.request(`/products/category/${categorySlug}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.products).to.be.an("array").and.not.be.empty;

      response.body.products.forEach((product: any) => {
        expect(product).to.have.property("category");
        expect(product.category).to.eq(categorySlug);
      });
    });
  });
});
