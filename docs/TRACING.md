# OpenTelemetry Tracer for Node.js with Google Cloud Trace Exporter

This code provides a robust implementation of an OpenTelemetry tracer for Node.js applications, specifically designed to integrate with Google Cloud Trace. It leverages InversifyJS for dependency injection, Express for web framework integration, and various OpenTelemetry packages for instrumentation and exporting traces.

## Key Features

* **Google Cloud Trace Integration:** Exports trace data to Google Cloud Trace for centralized monitoring and analysis.
* **Environment-Aware Configuration:** Adapts its behavior based on the `environment` setting (development or production), using a `ConsoleSpanExporter` for development and a `BatchSpanProcessor` with the `TraceExporter` for production.
* **Automatic Instrumentation:** Leverages `@opentelemetry/auto-instrumentations-node` to automatically instrument supported libraries and frameworks.
* **Express Middleware:** Provides an Express middleware to trace HTTP requests, capturing relevant attributes like method, URL, and status code.
* **Error Handling:** Includes robust error handling within the middleware and provides a method to explicitly set errors on spans.
* **Custom Attributes:** Allows adding custom attributes to spans for enhanced context.
* **Logging:** Integrates with a logging service for informative messages during initialization, shutdown, and errors.
* **Span Management:** Offers methods for starting, ending, and adding attributes to spans.

## Code Breakdown

### 1. Dependencies and Imports

The code starts by importing necessary modules from various packages, including `@opentelemetry/sdk-node`, `@opentelemetry/api`, `@google-cloud/opentelemetry-cloud-trace-exporter`, `express`, `inversify`, and custom modules for logging and configuration.

### 2. Class Definition and Constructor

The `OpenTelemetryTracer` class is defined and decorated with `@injectable()`.  The constructor takes `LoggerService` and `ConfigService` as dependencies, injected using InversifyJS.  It immediately calls `initializeConfig()`.

### 3. Configuration Initialization (`initializeConfig()`)

This method retrieves the `ObservabilityConfig` from the `ConfigService`.  It sets up a debug logger if the environment is 'development'.  Critically, it calls `setupSDK()` to initialize the OpenTelemetry SDK.

### 4. SDK Setup (`setupSDK()`)

* **Exporter:** Creates a `TraceExporter` instance configured with the Google Cloud project ID and credentials.
* **Resource:** Defines a `Resource` with service name, version, environment, and exporter information. This provides context for the traces.
* **Span Processor:**  Conditionally creates either a `BatchSpanProcessor` (for production) or a `SimpleSpanProcessor` with a `ConsoleSpanExporter` (for development).
* **Instrumentations:** Sets up automatic instrumentations for HTTP and Express, along with any other required instrumentations.
* **SDK Initialization:** Creates a `NodeSDK` instance, configuring it with the resource, exporter, span processor, and instrumentations.
* **Tracer Retrieval:** Obtains a tracer instance using `trace.getTracer('default')`.

### 5. Initialization and Shutdown (`initialize()` and `shutdown()`)

These methods handle starting and shutting down the OpenTelemetry SDK gracefully, logging informative messages along the way.

### 6. Span Management Methods (`endSpan()`, `addAttribute()`, `setError()`, `getTraceId()`, `startSpan()`)

These methods provide convenient functions for interacting with spans, including ending the current span, adding attributes, setting errors, retrieving the trace ID, and starting new spans.

### 7. Express Middleware (`middleware()`)

This crucial function provides Express middleware for tracing HTTP requests. It starts a new span for each request, adds attributes like HTTP method and URL, and handles errors. It ensures the span is ended when the response finishes or encounters an error.

## Usage Example

```typescript
// In your InversifyJS container configuration:
container.bind<OpenTelemetryTracer>(TYPES.OpenTelemetryTracer).to(OpenTelemetryTracer).inSingletonScope();

// In your Express app:
const openTelemetryTracer = container.get<OpenTelemetryTracer>(TYPES.OpenTelemetryTracer);
app.use(openTelemetryTracer.middleware());

// Starting the tracer:
await openTelemetryTracer.initialize();

// ... your application logic ...

// Example of starting a custom span:
const span = openTelemetryTracer.startSpan('database_query');
try {
  // ... database query logic ...
  span.setAttribute('db.statement', 'SELECT * FROM users');
} catch (error) {
  openTelemetryTracer.setError(error);
} finally {
  span.end();
}
```
