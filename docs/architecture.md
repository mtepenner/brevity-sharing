# Brevity-Sharing Architecture

This outlines the high-level system design for the local and production environments.

## System Flow

```mermaid
graph TD
    Client[Web Browser] -->|HTTP Request| Nginx[Frontend: Nginx + React]
    Client -->|API Calls :8080| GoAPI[Backend: Go API]
    
    GoAPI -->|Cache Check| Redis[(Redis Cache)]
    GoAPI -->|Read/Write| Postgres[(PostgreSQL DB)]
    
    subgraph Docker Network [brevity-network]
        Nginx
        GoAPI
        Redis
        Postgres
    end
