# TinyLink - URL Shortener

A modern URL shortener application built with Next.js, similar to bit.ly. Create short links, track click statistics, and manage your links with a clean, responsive interface.

## Features

- ✅ Create short links with optional custom codes (6-8 alphanumeric characters)
- ✅ Automatic code generation if no custom code provided
- ✅ URL validation before saving
- ✅ Click tracking and statistics
- ✅ Dashboard with search and filter functionality
- ✅ Individual stats page for each link
- ✅ Delete links functionality
- ✅ Health check endpoint
- ✅ Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (via Sequelize ORM)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud service like Neon)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/siddhesh-kulkarni/tinylink
cd tinylink
```

2. Install dependencies:
```bash
npm install  or yarn install
```

3. Set up environment variables:
```bash
.env
```

Edit `.env` and add your database URL:
```
DATABASE_URL=postgres://user:password@host:port/dbname
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
- `GET /healthz` - Returns system health status

### Links API
- `POST /api/links` - Create a new short link
  - Body: `{ "url": "https://example.com", "code": "optional" }`
  - Returns 409 if code already exists
  
- `GET /api/links` - List all links

- `GET /api/links/:code` - Get stats for a specific link

- `DELETE /api/links/:code` - Delete a link

## Pages & Routes

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to original URL (302 redirect)
- `/healthz` - Health check endpoint

## Code Validation

- Custom codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`
- Codes are globally unique across all users
- URLs must be valid http:// or https:// URLs

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_BASE_URL` - Your deployed app URL
4. Deploy!

### Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your environment variables as `DATABASE_URL`

The database tables will be automatically created on first API call.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts          # Health check endpoint
│   │   └── links/
│   │       ├── route.ts           # GET, POST /api/links
│   │       └── [code]/
│   │           └── route.ts       # GET, DELETE /api/links/:code
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx           # Stats page
│   ├── [code]/
│   │   └── route.ts               # Redirect route
│   ├── lib/
│   │   ├── db.ts                  # Database connection
│   │   ├── init.ts                # Database initialization
│   │   └── utils.ts                # Utility functions
│   ├── models/
│   │   └── Link.ts                 # Link model
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Dashboard
```

## Testing

The application follows specific URL conventions for automated testing:

- All endpoints must match the specified paths exactly
- Health check returns `{ "ok": true, "version": "1.0" }`
- Redirect returns 302 for existing links, 404 for deleted links
- Duplicate codes return 409 status

## Code with Joy, Test with Patience, Deploy with Joy
