# Documentation

This project implements a comprehensive documentation strategy across multiple levels to ensure maximum clarity and maintainability.

## Documentation Layers

### 1. API Documentation
- **OpenAPI/Swagger Documentation**
  - Auto-generated from code annotations
  - Available at `/docs/api` when running the server
  - Generated using `npm run docs:openapi`
  - Documents all API endpoints, request/response schemas, and authentication requirements

### 2. Code Documentation
- **TypeDoc Documentation**
  - Available at `/docs/typedoc` when running the server
  - Generated using `npm run docs:typedoc`
  - Provides detailed documentation of:
    - Classes, interfaces, and types
    - Methods and their parameters
    - Domain entities and value objects
    - Class relationships and inheritance hierarchies
  - Includes UML class diagrams through `typedoc-umlclass` plugin
  - Includes source code inline through `typedoc-plugin-inline-sources`

### 3. Architecture Documentation
- **Markdown Documentation**
  - Located in project root and documentation directories
  - Covers:
    - Project structure and organization
    - Domain-Driven Design (DDD) patterns
    - Clean Architecture implementation
    - Design decisions and rationale
  - Key files:
    - `README.md`: Project overview and setup
    - `CONTRIBUTING.md`: Contribution guidelines
    - `LOGGING.md`: Logging system documentation
    - `CI-CD.md`: CI/CD pipeline documentation

### 4. Monitoring Documentation
- **Metrics and Observability**
  - Prometheus metrics endpoint at `/metrics`
  - Health check endpoint at `/health`
  - Structured logging with correlation IDs
  - Google Cloud Logging integration in production

## Documentation Scripts

```bash
# Generate all documentation
npm run docs:build

# Generate API documentation only
npm run docs:openapi

# Generate code documentation only
npm run docs:typedoc
```

## Documentation Standards

### Code Comments
- **TSDoc/JSDoc Style Comments**
  ```typescript
  /**
   * @abstract ValueObject
   * @example class Email extends ValueObject<{ email: string }>
   * @returns ValueObject
   * @template T
   * @property {T} props
   */
  ```

### Architecture Decision Records (ADRs)
- Located in `docs/adr/`
- Documents significant architectural decisions
- Includes context, consequences, and rationale

### Domain Documentation
- Entity relationships and business rules
- Value object invariants
- Aggregate boundaries
- Domain events and their triggers

### Infrastructure Documentation
- Environment variables and configuration
- Deployment requirements
- Service dependencies
- Monitoring and logging setup

## Best Practices

1. **Keep Documentation Updated**
   - Documentation updates are required for all PRs
   - CI/CD pipeline validates documentation generation
   - Version documentation matches code version

2. **Documentation Location**
   - API-level documentation: In code using Swagger/OpenAPI annotations
   - Implementation details: In code using TSDoc/JSDoc
   - Architecture and setup: In markdown files
   - Usage examples: In README.md and specific component docs

3. **Clarity and Accessibility**
   - Use clear, concise language
   - Include examples where appropriate
   - Maintain consistent formatting
   - Regular review and updates

4. **Version Control**
   - Documentation changes are versioned with code
   - Breaking changes must be documented
   - Migration guides for major versions

## Contributing to Documentation

1. **Adding New Documentation**
   - Create documentation in appropriate location
   - Follow existing formats and standards
   - Include examples and use cases
   - Update table of contents if necessary

2. **Updating Existing Documentation**
   - Keep change log updated
   - Mark deprecated features
   - Include migration steps if needed
   - Update related documentation

3. **Documentation Review**
   - Technical accuracy check
   - Clarity and completeness review
   - Links and references validation
   - Generated documentation verification

## Accessing Documentation

1. **Local Development**
   ```bash
   # Start development server
   npm run start:dev
   
   # Access documentation
   API Docs: http://localhost:4500/docs/api
   Code Docs: http://localhost:4500/docs/typedoc
   ```

2. **Production Environment**
   - Documentation is deployed with the application
   - Available at the same endpoints
   - Version-specific documentation maintained
