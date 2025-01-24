## Getting Started

copy .env.example to .env and fill in the values

Setup a postgres database and run the migrations:

For local dev 
npx prisma push

First, run the development server:

```bash
npm run copy

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



### Configuration
1. Set up field definitions
2. Setup configuration mappings to fields
3. Import URLs to be processed and set the configuration to use for each URL

### Queue Processing
1. URLs are added to the queue
2. Processing status is tracked
3. Results are stored in the database
4. Extracted links are automatically deduped

## 🚀 API Endpoints

### Queue API
- `POST /api/queue/list`: Process list pages and extract URLs
- `POST /api/queue/content`: Extract content from pages

### Data Import API
- `POST /api/import`: Import data via CSV with duplicate handling

## 📦 Database Schema

Key tables:
- `urls`: Stores URL information and configurations
- `queue`: Manages processing status
- `entries`: Stores extracted content
- `configurations`: Stores regex patterns and rules

## 🛠 Development

### Prerequisites
- Node.js
- PostgreSQL
- Next.js

### Setup
1. Clone the repository
2. Copy .env.example to .env and fill in the values
3. Setup Postgres database
4. Install dependencies: `npm install`
5. Run the module copy code `npm run copy`
6. Run migrations: `npm run migrate`
7. Start development server: `npm run dev`

