describe("Product API GET request", () => {
  it("verify GET /products response contains properly structured product data", () => {
    cy.request("GET", "/products").then((response) => {
      // Basic checks
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("products").and.to.be.an("array");
      expect(response.body.products.length).to.be.greaterThan(0);

      // Check first product (we can expand this if needed)
      const product = response.body.products[0];

      // Basic fields
      cy.fixture('productKeys').then((productKeys) => {
        expect(product).to.include.all.keys(productKeys);
      });

      // Type checks
      expect(product.id).to.be.a("number");
      expect(product.title).to.be.a("string");
      expect(product.price).to.be.a("number");
      expect(product.tags).to.be.an("array");
      expect(product.reviews).to.be.an("array");
      expect(product.dimensions).to.have.all.keys("width", "height", "depth");
      expect(product.meta).to.have.all.keys(
        "createdAt",
        "updatedAt",
        "barcode",
        "qrCode"
      );

      // URL validation
      expect(product.thumbnail).to.match(/^https?:\/\/.+/);
      product.images.forEach((imgUrl: string) => {
        expect(imgUrl).to.match(/^https?:\/\/.+/);
      });

      // Business logic
      expect(product.discountPercentage).to.be.gte(0);
      expect(product.rating).to.be.within(0, 5);
      expect(product.availabilityStatus).to.be.oneOf([
        "In Stock",
        "Out of Stock",
      ]);
      expect(product.minimumOrderQuantity).to.be.greaterThan(0);

      // Reviews check
      product.reviews.forEach((review: any) => {
        expect(review).to.have.all.keys(
          "rating",
          "comment",
          "date",
          "reviewerName",
          "reviewerEmail"
        );
        expect(review.rating).to.be.within(1, 5);
        expect(review.reviewerEmail).to.match(/@x\.dummyjson\.com$/);
      });
    });
  });

  it("verify GET /products/1 returns product with id 1", () => {
    cy.request("/products/1").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq("Essence Mascara Lash Princess");
      expect(response.body.id).to.eq(1);
    });
  });

  it("verify GET /products/search?q=phone returns relevant results with the keyword in description", () => {
    const searchQuery = "phone";
    cy.request(`/products/search?q=${searchQuery}`).then((response) => {
      expect(response.status).to.eq(200);

      const products = response.body.products;
      expect(products.length).to.be.greaterThan(0);

      products.forEach((product: any) => {
        expect(product).to.have.property("description").and.to.be.a("string")
          .and.not.to.be.empty;

        const descriptionIncludesPhone = product.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        expect(descriptionIncludesPhone).to.be.true;
      });
    });
  });

  it("verify /products?[params] returns 10 products with only title and price fields", () => {
    cy.request("/products?limit=10&skip=10&select=title,price").then(
      (response) => {
        expect(response.status).to.eq(200);

        const { products, total, limit, skip } = response.body;

        // Validate pagination metadata
        expect(total).to.be.a("number").and.greaterThan(10);
        expect(limit).to.eq(10);
        expect(skip).to.eq(10);

        // Validate products array
        expect(products).to.be.an("array").with.length(10);

        products.forEach((product: any) => {
          expect(product).to.have.all.keys("id", "title", "price");
          expect(product.id).to.be.a("number").and.greaterThan(0);
          expect(product.title).to.be.a("string").and.not.be.empty;
          expect(product.price).to.be.a("number");
        });
      }
    );
  });

  it("verify GET /products?[sort params] returns products sorted by title in ascending order", () => {
    cy.request("/products?sortBy=title&order=asc").then((response) => {
      expect(response.status).to.eq(200);

      const products = response.body.products;

      // Extract titles and check sort order
      const titles = products.map((p: any) => p.title);
      const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));

      expect(titles).to.deep.equal(sortedTitles);
    });
  });
});

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
    cy.request("/products/category-list").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").and.not.be.empty;

      const expectedCategories = [
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "home-decoration",
        "kitchen-accessories",
        "laptops",
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "mobile-accessories",
        "motorcycle",
        "skin-care",
        "smartphones",
        "sports-accessories",
        "sunglasses",
        "tablets",
        "tops",
        "vehicle",
        "womens-bags",
        "womens-dresses",
        "womens-jewellery",
        "womens-shoes",
        "womens-watches",
      ];

      // verify exact match (length and content)
      expect(response.body).to.have.members(expectedCategories);
      expect(response.body.length).to.eq(expectedCategories.length);
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
