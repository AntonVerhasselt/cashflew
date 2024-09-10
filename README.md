# SvelteKit SaaS Boilerplate Documentation

## 1. Introduction
This SvelteKit SaaS Boilerplate provides a robust starting point for building modern, scalable web applications. It integrates key technologies and services to accelerate your development process.

### Features
- Authentication with Auth0
- MongoDB integration for data persistence
- Email functionality using Brevo
- Responsive UI with Tailwind CSS
- API service for easy backend communication

## 2. Getting Started

### Prerequisites
- Node.js (version 14.0 or higher)
- npm or yarn
- MongoDB instance
- Auth0 account
- Brevo account (for email services)

### Installation
```bash
git clone https://github.com/AntonVerhasselt/svelte-saas-boilerplate.git
cd <project-directory>
npm install
```

### Environment Configuration
Create a `.env` file in the root directory with the following variables:

```
PUBLIC_AUTH0_DOMAIN=your_auth0_domain
PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
PUBLIC_AUTH0_AUDIENCE=your_auth0_audience
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
BREVO_API_KEY=your_brevo_api_key
```

#### Auth0 Setup
1. Create an Auth0 application
2. Configure callback URLs
3. Set up API audience (if using)

#### MongoDB Setup
1. Create a MongoDB cluster
2. Obtain connection string & database name
3. Create necessary collections ("users" collection is mandatory)

#### Brevo Setup
1. Sign up for a Brevo account
2. Obtain API key
3. Set up email templates (if using)

## 3. Project Structure
- `/src`: Source code
  - `/components`: Reusable Svelte components
  - `/routes`: SvelteKit routes and API endpoints
  - `/lib`: Utility functions and modules
- `/static`: Static assets
- `svelte.config.js`: SvelteKit configuration
- `tailwind.config.js`: Tailwind CSS configuration

## 4. Core Functionality

### Authentication
Auth0 is used for user authentication. See `src/lib/auth0.ts` for implementation details.

### User Management
User data is stored in MongoDB. API endpoints for user operations are in `src/routes/api/user/+server.ts`.

### Email Functionality
Email sending is handled through Brevo. See `src/routes/api/email/+server.ts` for implementation.

### API Services
The `apiService` module (`src/lib/apiService.ts`) provides methods for making authenticated API requests to the Mongo Database.

## 5. Frontend

### Routing
SvelteKit's file-based routing is used. Add new routes by creating files in the `src/routes` directory.

### State Management
Svelte stores are used for state management. See `src/lib/auth0.ts` for examples.

## 6. Backend

### API Endpoints
- `/api/user`: User management operations in MongoDB
- `/api/email`: Email sending functionality using Brevo

### Database Operations
The `dbOperations` module (`src/lib/dbOperations.ts`) provides methods for interacting with MongoDB.

## 7. Deployment
Use `npm run build` to create a production build. Deploy the resulting files to your preferred hosting platform.

## 8. Customization and Extension
To add new features:
1. Create new Svelte components in `/src/components`
2. Add new routes in `/src/routes`
3. Extend API functionality in `/src/routes/api`

## 9. Troubleshooting
Common issues:
- Authentication errors: Check Auth0 configuration
- Database connection issues: Verify MongoDB URI and credentials
- Email sending failures: Confirm Brevo API key and setup

For more detailed information, refer to the source code and comments within each file.
