# Servers

This folder contains oRPC servers exposed by the app. Note that one app might expose multiple servers (such as one Public API and one Internal API).

Each API shall have contract, such as `admin-backend.contract.ts`, that is composed out of multiple per-feature contracts (like `users.contract.ts`). In this way you can expose functionality by logical groups