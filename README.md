# HealthyMeal

HealthyMeal is a web application that uses artificial intelligence to customize recipes according to users' dietary preferences. The MVP focuses on serving users following a pescatarian diet (vegetarians who eat fish) without allergies, who have limited time for meal preparation.

## Table of Contents
- [Description](#description)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Description

HealthyMeal allows users to:
- Create and manage user accounts
- Save dietary preferences through a survey
- Add, view, edit, and delete recipes
- Modify recipes using AI according to saved preferences
- Rate modified recipes

The application uses Large Language Models (through API) to modify recipes based on user preferences.

## Tech Stack

- **Frontend Framework**: [Astro 5](https://astro.build/) with [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/) components
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: Supabase for authentication and PostgreSQL database
- **Deployment**: Docker with CI/CD pipeline on DigitalOcean

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version 22.14.0
- We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/healthy-meal.git
   cd healthy-meal
   ```

2. Install the correct Node.js version:
   ```bash
   nvm install
   # or if you already have it installed
   nvm use
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Project Scope

### What's Included in MVP

- User account system
- Recipe management (add, view, edit, delete)
- Dietary preferences management through surveys
- AI-powered recipe modification for pescatarian diets
- Rating system for modified recipes
- User dashboard

### What's Not Included in MVP

1. Recipe import from URLs
2. Rich multimedia support (e.g., recipe photos)
3. Recipe sharing with other users
4. Social features
5. Support for diets other than pescatarian
6. Allergy and food intolerance handling
7. Advanced recipe filtering and searching
8. Mobile application

## Project Structure

The project follows this directory structure:

- `./src` - Source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend
- `./src/components` - Client-side components (Astro and React)
- `./src/components/ui` - Shadcn/ui components
- `./src/lib` - Services and helpers 
- `./src/assets` - Static internal assets
- `./public` - Public assets

## Project Status

Current version: 0.0.1

The project is in the MVP (Minimum Viable Product) development phase, focusing on core functionality for pescatarian diet users.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
