# ==========================================
# Stage 1: Build the application
# ==========================================
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy the go mod files and download dependencies
# (If you add external packages later, uncomment the RUN command)
COPY go.mod ./
# COPY go.sum ./ 
# RUN go mod download

# Copy the rest of the source code
COPY . .

# Compile a static Go binary
# CGO_ENABLED=0 ensures it runs perfectly in the scratch container
RUN CGO_ENABLED=0 GOOS=linux go build -o /backend ./cmd/api

# ==========================================
# Stage 2: Create the minimal production image
# ==========================================
FROM scratch

WORKDIR /

# Copy only the compiled binary from the builder stage
COPY --from=builder /backend /backend

# Document that the service listens on 8080
EXPOSE 8080

# Execute the binary
ENTRYPOINT ["/backend"]
