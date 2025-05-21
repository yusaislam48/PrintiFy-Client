# PrintiFy Client

## Environment Variables

The application uses environment variables for configuration:

- `VITE_API_URL`: The base URL for the API server (default: http://localhost:8080)

Create a `.env` file in the client directory to customize these values:

```
VITE_API_URL=http://localhost:8080
```

## Development

To start the development server:

```bash
npm install
npm run dev
```

## Production Build

To create a production build:

```bash
npm run build
``` 