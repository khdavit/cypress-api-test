describe("verify product API POST - PUT - PATCH - DELETE flow", () => {
  let createdProductId: number;

  it("verify POST /products/add creates a new product", () => {
    cy.request({
      method: "POST",
      url: "/products/add",
      body: {
        title: "Cypress Test Product",
        description: "This product was created during an automated test",
        price: 123,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.id).to.be.a("number");
      expect(response.body.title).to.eq("Cypress Test Product");
      createdProductId = response.body.id;
    });
  });

  it("verify PUT /products/:id updates the entire product", () => {
    cy.request({
      method: "PUT",
      url: `/products/${createdProductId}`,
      body: JSON.stringify({
        title: "Updated Product Title",
        price: 200,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq("Updated Product Title");
      expect(response.body.price).to.eq(200);
    });
  });

  it("verify PATCH /products/:id partially updates the product", () => {
    cy.request({
      method: "PATCH",
      url: `/products/${createdProductId}`,
      body: {
        price: 250,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.price).to.eq(250);
    });
  });

  it("verify DELETE /products/:id deletes the product", () => {
    cy.request({
      method: "DELETE",
      url: `/products/${createdProductId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(createdProductId);
    });
  });
});
