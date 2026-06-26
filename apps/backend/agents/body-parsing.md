# Body Parsing Notes

Better Auth needs Nest booted with `bodyParser: false` so `/api/auth/*` can handle request bodies itself.

App JSON endpoints still need parsed bodies. Use `setupJsonBodyParsing(app)` from `src/body-parsing.ts` after creating the Nest app and before `app.init()`/`app.listen()`. It skips `/api/auth/*` and applies `express.json()` to the rest of the app.
