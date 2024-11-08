```plain-text
📦 typescript-enterprise-boilerplate
├── .github/                          # GitHub specific files
│   ├── workflows/                    # GitHub Actions workflows
│   │   ├── ci.yml                   # CI pipeline
│   │   ├── release.yml              # Release pipeline
│   │   └── security.yml             # Security scanning
│   └── ISSUE_TEMPLATE/              # Issue templates
│
├── .husky/                          # Husky git hooks
│   ├── pre-commit                   # Lint and test checks
│   └── commit-msg                   # Commit message validation
│
├── src/
│   ├── application/                 # Application layer
│   │   ├── commands/                # Command handlers
│   │   │   └── user/
│   │   │       ├── create-user.command.ts
│   │   │       └── create-user.handler.ts
│   │   ├── queries/                 # Query handlers
│   │   ├── dtos/                    # Data Transfer Objects
│   │   └── interfaces/              # Application interfaces
│   │
│   ├── domain/                      # Domain layer
│   │   ├── aggregates/              # Aggregate roots
│   │   ├── entities/                # Domain entities
│   │   ├── value-objects/           # Value objects
│   │   ├── events/                  # Domain events
│   │   └── repositories/            # Repository interfaces
│   │
│   ├── infrastructure/              # Infrastructure layer
│   │   ├── config/                  # Configuration
│   │   │   ├── environment.ts       # Environment config
│   │   │   ├── gcp.config.ts       # GCP services config
│   │   │   └── typeorm.config.ts   # Database config
│   │   │
│   │   ├── auth/                    # Authentication
│   │   │   ├── gcp-auth.service.ts
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── database/               # Database
│   │   │   ├── migrations/
│   │   │   ├── entities/           # TypeORM entities
│   │   │   └── repositories/       # TypeORM repositories
│   │   │
│   │   ├── http/                   # HTTP related
│   │   │   ├── middlewares/
│   │   │   │   ├── cors.middleware.ts
│   │   │   │   ├── helmet.middleware.ts
│   │   │   │   └── rate-limit.middleware.ts
│   │   │   └── validators/
│   │   │
│   │   ├── logging/               # Logging infrastructure
│   │   │   ├── winston.logger.ts
│   │   │   └── gcp.logger.ts
│   │   │
│   │   ├── monitoring/           # Monitoring infrastructure
│   │   │   ├── opentelemetry.ts
│   │   │   ├── profiler.ts
│   │   │   └── error-reporting.ts
│   │   │
│   │   └── secrets/             # Secret management
│   │       └── secret-manager.ts
│   │
│   ├── interfaces/              # Interface layer
│   │   ├── http/               # HTTP interfaces
│   │   │   ├── controllers/    # Express controllers
│   │   │   ├── routes/         # Route definitions
│   │   │   └── middleware/     # HTTP middleware
│   │   │
│   │   └── graphql/           # GraphQL interfaces (if needed)
│   │
│   ├── shared/                 # Shared kernel
│   │   ├── decorators/        # Custom decorators
│   │   ├── errors/            # Error handling
│   │   ├── types/             # Shared types
│   │   └── utils/             # Utilities
│   │
│   └── ioc/                   # Dependency Injection
│       ├── container.ts       # IoC container setup
│       ├── interfaces.ts      # Interface definitions
│       └── types.ts          # Type definitions
│
├── test/                      # Tests
│   ├── unit/                 # Unit tests
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │
│   ├── integration/          # Integration tests
│   │   ├── api/
│   │   └── database/
│   │
│   └── e2e/                  # End-to-end tests
│
├── docs/                     # Documentation
│   ├── api/                 # API documentation
│   │   └── openapi.yaml    # OpenAPI/Swagger specs
│   │
│   ├── architecture/       # Architecture documentation
│   │   └── diagrams/      # UML diagrams
│   │
│   └── contributing/      # Contribution guidelines
│
├── scripts/               # Utility scripts
│   ├── setup-gcp.sh      # GCP setup script
│   └── generate-docs.sh  # Documentation generation
│
├── .gitignore
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
├── package.json
└── README.md
```
