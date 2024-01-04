# Supastarter
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fn0lawz%2Fsupastart&env=NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SUPABASE_URL,STRIPE_API_KEY,STRIPE_WEBHOOK_SECRET,STRIPE_PRO_MONTHLY_PLAN_ID,GITHUB_ACCESS_TOKEN&project-name=supastart&repository-name=supastart&demo-title=Supastart&demo-url=https%3A%2F%2Fstarter-dev-cats.vercel.app)

## Taxonomy + Supabase

A clone of @shadcn's open source application built using the new router, server components, and everything new in Next.js 13, but with Supabase as the backend/auth solution. It is a bit outdated currently, and I am working on getting it up to date with the official Taxonomy repo.

> **Warning**
> This app is a work in progress. I'm building this in public. You can follow the progress on Twitter [@shadcn](https://twitter.com/shadcn).
> See the roadmap below.

## About this project


**This is a starter template in progress.**




## Note on Performance

> **Warning**
> This app is using the unstable releases for Next.js 13 and React 18. The new router and app dir is still in beta and not production-ready.
> **Expect some performance hits when testing the dashboard**.
> If you see something broken, you can ping me [@shadcn](https://twitter.com/shadcn).

## Features

- New `/app` dir,
- Routing, Layouts, Nested Layouts and Layout Groups
- Data Fetching, Caching and Mutation
- Loading UI
- Route handlers
- Metadata files
- Server and Client Components
- API Routes and Middlewares
- Authentication using **Supabase Auth**
- Database on **Supabase**
- UI Components built using **Radix UI**
- Documentation and blog using **MDX** and **Contentlayer**
- Subscriptions using **Stripe**
- Styled using **Tailwind CSS**
- Validations using **Zod**
- Written in **TypeScript**

## Roadmap

- [x] ~Add MDX support for basic pages~
- [x] ~Build marketing pages~
- [x] ~Subscriptions using Stripe~
- [x] ~Responsive styles~
- [x] ~Add OG image for blog using @vercel/og~
- [x] Dark mode

## Known Issues

A list of things not working right now:

1. ~GitHub authentication (use email)~
2. ~[Prisma: Error: ENOENT: no such file or directory, open '/var/task/.next/server/chunks/schema.prisma'](https://github.com/prisma/prisma/issues/16117)~
3. ~[Next.js 13: Client side navigation does not update head](https://github.com/vercel/next.js/issues/42414)~
4. [Cannot use opengraph-image.tsx inside catch-all routes](https://github.com/vercel/next.js/issues/48162)

## Why not tRPC, Turborepo or X?

I might add this later. For now, I want to see how far we can get using Next.js only.

If you have some suggestions, feel free to create an issue.

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.
```
cp .env.example .env.local
```

3. Create a Supabase project and copy the environmental variables into `.env.local`. You can follow the [official docs](https://supabase.io/docs/guides/with-nextjs) to get started.

4. Copy the `schema.sql` file from the root of this project into your Supabase project's SQL editor and run it to create the tables.

5. Start the development server:

```sh
pnpm dev
```

## License

Licensed under the [MIT license](https://github.com/shadcn/taxonomy/blob/main/LICENSE.md).
