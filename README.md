# API Task Cypress Test Suite

This repository contains Cypress end-to-end tests for verifying the [DummyJSON Products API](https://dummyjson.com/). The tests are written in TypeScript and cover various endpoints, including categories and products.

## Features

- Automated API testing with Cypress
- TypeScript support for type safety
- Test filtering by title using [cypress-grep](https://github.com/cypress-io/cypress-grep)
- Headless test execution for CI/CD

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd api_task
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running Tests

#### Run All Tests

```sh
npm run cy:run:test
```

### Directory Structure

```
cypress/
  e2e/           # Test files
  support/       # Cypress support files
```

### Scripts

- `cy:run:test` &mdash; Runs all Cypress tests in headless mode.

### Linting and Formatting

This project uses **ESLint** and **Prettier** for code quality and formatting.  
You can lint and format your code with:

```sh
npx eslint .
npx prettier --write .
```

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.