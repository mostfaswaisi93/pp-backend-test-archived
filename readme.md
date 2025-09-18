# PEAKPROZ Backend

A robust, scalable Node.js/TypeScript backend application with comprehensive logging, monitoring, and production-ready configurations.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: Document database with Mongoose ODM
- **Redis**: In-memory data structure store
- **Socket.io**: Real-time bidirectional communication
- **JWT Authentication**: Secure token-based authentication
- **Comprehensive Logging**: Structured logging with Pino
- **Docker Support**: Containerized deployment
- **PM2 Process Management**: Production process management
- **Rate Limiting**: API rate limiting and protection
- **Security**: Helmet, CORS, and security headers

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6.0+
- Redis 7.0+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/mostfaswaisi93/peakproz-backend.git
cd peakproz-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Build the application
```bash
npm run build
```

### 5. Start the application
```bash
# Development
npm run dev

# Production
npm start

# With PM2
npm run pm2:start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `8000` |
| `LOG_LEVEL` | Logging level | `info` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/peakproz` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | JWT signing secret | `peakproz2025` |

### Logging Levels

- `error`: Error messages only
- `warn`: Warning and error messages
- `info`: General information (default)
- `debug`: Detailed debugging information

## 🏗️ Project Structure

```
src/
├── app/                    # Application modules
│   ├── auth/              # Authentication
│   ├── user/              # User management
│   └── ...                # Other modules
├── commons/                # Common utilities
│   ├── libs/              # Library classes
│   ├── middlewares/       # Express middlewares
│   └── services/          # Business logic services
├── config/                 # Configuration files
├── interfaces/             # TypeScript interfaces
├── models/                 # Database models
├── seeders/                # Database seeders
└── server.ts              # Application entry point
```

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start with nodemon
npm run build           # Build TypeScript
npm run start           # Start production build
npm run clean           # Clean build artifacts

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Linting & Formatting
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier

# PM2 Management
npm run pm2:start       # Start with PM2
npm run pm2:stop        # Stop PM2 processes
npm run pm2:restart     # Restart PM2 processes
npm run pm2:logs        # View PM2 logs
```

### Code Quality

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Git Hooks**: Pre-commit hooks for quality assurance

## 🐳 Docker

### Quick Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Individual Services

```bash
# Build application
docker build -t peakproz-backend .

# Run application
docker run -p 8000:8000 peakproz-backend
```
## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection
- **JWT**: Secure authentication
- **Input Validation**: Request validation
- **SQL Injection Protection**: Mongoose ODM protection

## 📈 Performance

- **Compression**: Gzip compression
- **Caching**: Redis-based caching
- **Connection Pooling**: Database connection optimization
- **Async Operations**: Non-blocking I/O
- **Load Balancing**: PM2 cluster mode support

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                 # End-to-end tests
└── fixtures/            # Test data
```

### Running Tests

```bash
# All tests
npm test

# Specific test type
npm run test:unit
npm run test:integration
npm run test:e2e

# With coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export LOG_LEVEL=warn
   ```

3. **Start with PM2**
   ```bash
   npm run pm2:start
   ```

### Docker Deployment

```bash
# Build production image
docker build --target runner -t peakproz-backend:prod .

# Run production container
docker run -d \
  -p 8000:8000 \
  -e NODE_ENV=production \
  --name peakproz-backend \
  peakproz-backend:prod
```

## 📝 API Documentation

API documentation is available at `/api/docs` when running in development mode.

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Follow the established code style
- Add JSDoc comments for public APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the powerful database
- Redis team for the fast in-memory store
- Pino team for the high-performance logger
