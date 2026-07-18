---
summary: Rule that normal development never requires production cloud services.
read_when:
  - Adding any new infrastructure dependency (storage, queues, email, analytics, external APIs).
  - Deciding how a service should run in local development.
---

# Local-first Development

Normal development must not require production cloud services.

Every new infrastructure dependency needs one of:

- local Docker service,
- documented emulator/mock,
- adapter boundary that lets the app run without production credentials.

Production services are deployment targets, not local development requirements.
