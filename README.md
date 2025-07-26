# memo.directory

memo.directory is a modern, full-stack bookmarking application that allows you to save and categorize URLs, colors, and text snippets. It features a clean, intuitive user interface with optimistic UI updates for a seamless user experience.

## Features

- **Versatile Bookmarking**: Save URLs, color codes, or plain text as bookmarks.
- **Bookmark Grouping**: Organize your bookmarks into customizable groups with unique names and colors.
- **Optimistic UI Updates**: Enjoy a fast and responsive interface with immediate feedback on your actions.
- **User Authentication**: Secure your bookmarks with user authentication.
- **API**: A robust tRPC API for managing bookmarks and groups.
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Tailwind CSS for a powerful and maintainable application.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API**: [tRPC](https://trpc.io/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query](https://tanstack.com/query/latest)
- **Authentication**: [BetterAuth](https://better-auth.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/joaodematte/memo-directory.git
   ```
2. **Install dependencies**
   ```sh
   bun install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root of the project and add the necessary environment variables. You can use the `.env.example` file as a template.
4. **Start the database**
   ```sh
   docker-compose up -d
   ```
5. **Run database migrations**
   ```sh
   bun db:migrate
   ```
6. **Run the development server**
   ```sh
   bun dev
   ```

Now, you should be able to access the application at [http://localhost:3000](http://localhost:3000).
