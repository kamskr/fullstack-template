# Local-first Development

Normal development must not require production cloud services.

Every new infrastructure dependency needs one of:

- local Docker service,
- documented emulator/mock,
- adapter boundary that lets the app run without production credentials.

Production services are deployment targets, not local development requirements.
