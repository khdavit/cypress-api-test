// cypress/e2e/products.cy.test.ts

describe('Product Categories API', () => {
  it('GET /products/categories - should return a list of categories', () => {
    cy.request('GET', 'https://dummyjson.com/products/categories').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      response.body.forEach((category: any) => {
        expect(category).to.be.a('string').and.not.to.be.empty;
      });
    });
  });

  it('GET /products/categories - should include known categories', () => {
    const expectedCategories = [
      'smartphones',
      'laptops',
      'fragrances',
      'skincare',
      'groceries',
      'home-decoration'
    ];

    cy.request('GET', 'https://dummyjson.com/products/categories').then((response) => {
      expectedCategories.forEach((cat) => {
        expect(response.body).to.include(cat);
      });
    });
  });
});