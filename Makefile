# Brevity-Sharing Makefile

.PHONY: up down build logs db-shell

# Spin up the entire stack in the background
up:
	docker-compose -f infrastructure/docker-compose.yml --env-file infrastructure/.env up -d

# Tear down the stack
down:
	docker-compose -f infrastructure/docker-compose.yml down

# Rebuild the Docker images (use this after changing Go or React code)
build:
	docker-compose -f infrastructure/docker-compose.yml build

# View the logs for all services in real-time
logs:
	docker-compose -f infrastructure/docker-compose.yml logs -f

# Access the PostgreSQL database directly via command line
db-shell:
	docker exec -it brevity-db psql -U brevity_user -d brevity_db
