# Brook’s Financial Observatory — Company financial explorer

A responsive financial research dashboard built with Next.js 15 and React 19. Search companies, switch annual/quarterly reporting, explore revenue and profit-margin charts, filter/sort income statements, and export the visible rows as CSV.

## Run locally

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set your Financial Modeling Prep API key.
3. Run `npm run dev` and open the printed local URL.

The API key is server-only. Never prefix it with `NEXT_PUBLIC_` or commit `.env.local`.

## Verification

- `npm test`: financial calculations, missing values, filtering, sorting and CSV regression tests.
- `npm run build`: production compilation.

## Architecture and decisions

- App Router endpoints `/api/search` and `/api/financials` validate input and proxy only approved FMP endpoints. Raw provider responses and credentials are not sent to the client.
- Provider responses are cached by Next.js for one hour. Requests time out after 15 seconds; failures have actionable UI states and retry.
- Client requests are debounced for search and cancelled on selection changes to avoid stale responses.
- The dashboard uses reported currency. Margin is net income / revenue; growth compares adjacent reported periods and is unavailable when the prior value is zero or negative. Quarterly comparisons are sequential, not year-over-year.
- Charts and summary cards use all returned periods. Table filters only affect table rows and CSV exports. Missing values render as dashes and sort last.
- Company, period, and filters are preserved in the URL for sharing. CSV exports full amounts, not rounded chart values.
- Charts are SVG without additional dependencies; period targets support pointer and keyboard focus. Detailed values remain available in the table.

## Data coverage and deployment

Data comes from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs/stable/income-statement). Search, company coverage, quarterly data and history length depend on the configured subscription. The dashboard uses the provider’s default history length (currently five periods with the configured account). Provider errors are shown rather than replaced with fabricated demo data.

Deploy to a Next.js-compatible Node host, set `FMP_API_KEY` in its server environment, then build and start with `npm run build` and `npm start`. This app requires server routes and cannot be deployed as a static export. Before a public high-traffic launch, add host-level request throttling to protect the provider quota. No authentication or persistent user accounts are included.
