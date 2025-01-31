# CloudSummit Voting API

API for managing cloud provider voting system. Users can vote for their preferred cloud provider and view voting results.

## Features
- Vote for cloud providers
- View real-time vote tallies
- Rate limiting and security measures
- MongoDB integration for persistence

## Technical Stack
- Backend: Node.js with TypeScript
- Framework: Express.js
- Database: MongoDB
- Process Management: PM2
- Security: Rate limiting, CORS, and Helmet

## Project Structure
```
src/
├── config/         # Configuration management
│   ├── index.ts    # App configuration
│   └── providers.ts # Cloud providers data
├── db/            # Database connection
├── middleware/    # Express middleware
├── models/        # MongoDB models
├── routes/        # API routes
└── utils/         # Shared utilities
```

## API Endpoints

### Cast Vote
```http
POST /api/vote
Content-Type: application/json

{
    "userId": "unique_user_id",
    "providerId": "aws" | "gcp" | "azure" | "digitalocean"
}
```

### Get Vote Tallies
```http
GET /api/tallies

Response:
[
    {
        "providerId": "aws",
        "count": 42,
        "lastUpdated": "2024-01-28T12:00:00.000Z"
    },
    ...
]
```

## Setup

1. Clone and install:
```bash
git clone <repository-url>
cd cloudsummit-voting-api
npm install
```

2. Create .env file:
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cloudsummit
CORS_ORIGINS=http://localhost:3000
```

3. Run:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Author
Luis Hernández Martín
luisheratm@gmail.com

## License
MIT