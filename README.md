# Next.js Todo Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's a simple Todo application that allows users to create, read, update, and delete tasks.

## Features

- Add new tasks
- Mark tasks as complete or incomplete
- Delete tasks
- Real-time updates with toast notifications

## Technologies Used

- Next.js 13+ (App Router)
- React
- TypeScript
- Prisma (for database operations)
- PostgreSQL (database)
- Tailwind CSS (for styling)
- React Hot Toast (for notifications)

## Getting Started

First, set up your database connection by creating a `.env` file in the root directory and adding your PostgreSQL connection string:

```
POSTGRES_PRISMA_URL = "postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

Then, run the following commands to start the development server:

```bash
npm run dev
```

OR

```bash
yarn dev
```

OR

```bash
pnpm dev
```

OR

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx`: The main page component that renders the TodoList
- `app/components/TodoList.tsx`: The core component that handles the todo list functionality
- `app/api/todos/route.ts`: API routes for CRUD operations on todos
- `app/lib/db.ts`: Prisma client initialization for database operations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
