# TypeScript Microservice Boilerplate

## Overview

This project is a robust TypeScript microservice implementation that adheres to Domain-Driven Design (DDD) principles and Clean Architecture. It provides a scalable and maintainable foundation for building complex business applications with a clear separation of concerns.

## Key Features

- **Domain-Driven Design (DDD)**: Focuses on the core domain and domain logic.
- **Clean Architecture**: Ensures that business rules are independent of frameworks and databases.
- **TypeScript**: Leverages strong typing for improved developer experience and code quality.
- **Modularity**: Organized into distinct modules for easy scaling and maintenance.
- **Dependency Injection**: Uses InversifyJS for inversion of control.
- **ORM Integration**: Incorporates TypeORM for database operations.
- **API Documentation**: Automatic OpenAPI (Swagger) documentation generation.
- **Code Documentation**: TypeDoc for generating code documentation.
- **Testing**: Jest setup for unit and integration testing.
- **Linting and Formatting**: Ensures code quality and consistency.
- **Continuous Integration**: Includes scripts for semantic versioning and releases.

## Project Structure

```
src/
├── config/          # Configuration files
├── infrastructure/  # Infrastructure layer (databases, external services)
├── modules/         # Feature modules (e.g., Customer)
│   └── Customer/    # Example module
│       ├── application/    # Application services and DTOs
│       ├── domain/         # Domain entities and interfaces
│       ├── infrastructure/ # Repository implementations
│       └── presentation/   # Controllers and routes
├── shared/          # Shared kernel (base classes, utilities)
└── util/            # Utility functions
```

## Getting Started

1. Clone the repository:
   ```
   git clone [repository-url]
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.

4. Run the development server:
   ```
   npm run start:dev
   ```

## Available Scripts

- `npm run test`: Run tests
- `npm run build:compile`: Compile TypeScript
- `npm run lint:check`: Check for linting issues
- `npm run lint:fix`: Fix linting issues
- `npm run start:dev`: Start development server
- `npm run start:prod`: Start production server
- `npm run docs:build`: Generate API and code documentation

## Documentation

To generate API and Code documentation
- `npm run docs:build`

When running the server, documentation is avilable at:
- `/docs/api` for API Docs.
- `/docs/typedoc` for Code Docs

## Contributing

We welcome contributions to this project! Here's a quick overview of the process:

1. **Create a Feature Branch** from `develop`
2. **Write Code and Commit** following our commit message format
3. **Submit a Pull Request** using our PR template
4. **Participate in Code Review**
5. **Follow Coding Rules** including testing and documentation
6. **Merge** once approved

For a more detailed guide on each of these steps, including our commit message format, PR template, and coding rules, please read our [full Contributing Guidelines](CONTRIBUTING.md). This document provides in-depth information on:

- Detailed branch naming conventions
- Comprehensive commit message guidelines
- Complete PR template and best practices
- Step-by-step code review process
- Extensive coding rules and best practices

We encourage all contributors, new and experienced, to review the full guidelines to ensure a smooth and effective collaboration process.

Ready to contribute? Great! Start by reading the [CONTRIBUTING.md](CONTRIBUTING.md) file, and feel free to reach out if you have any questions. We look forward to your contributions!

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## Architecture Overview

This project follows Clean Architecture principles:

1. **Domain Layer**: Contains enterprise-wide logic and types.
2. **Application Layer**: Orchestrates the flow of data to and from the domain layer.
3. **Infrastructure Layer**: Implements interfaces defined in the domain layer.
4. **Presentation Layer**: Handles HTTP requests and responses.

The use of DDD concepts like Aggregates, Value Objects, and Domain Events ensures a rich domain model that accurately represents the business rules.

## License

This project is licensed under the [LICENSE NAME] - see the LICENSE.md file for details.

## Acknowledgments

- [Inversify](https://inversify.io/) for dependency injection
- [TypeORM](https://typeorm.io/) for object-relational mapping
- [Express](https://expressjs.com/) for the web server framework
