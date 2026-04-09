# Brevity 🚀

A modern, high-performance micro-blogging platform (Twitter clone) designed for speed and simplicity. Brevity allows users to share short, 280-character updates and view a reverse-chronological timeline of posts.

## 📋 Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features
- **Micro-blogging:** Compose and publish posts up to 280 characters.
- **Real-time Timeline:** View a reverse-chronological feed of the latest posts.
- **Containerized Environment:** Fully dockerized stack for seamless local development and deployment.
- **Infrastructure as Code:** Ready for AWS production deployment using Terraform.
- **CI/CD Pipelines:** Automated linting, building, and testing via GitHub Actions.

## 🛠️ Technologies Used
**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Go (1.22+)
- Custom routing and API handlers

**Infrastructure & DevOps**
- Docker & Docker Compose
- PostgreSQL & Redis (Configured via infrastructure)
- Nginx (Frontend serving)
- Terraform (AWS Deployment)
- GitHub Actions

## 📦 Prerequisites
To run this project locally, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/) (Optional, but recommended for shortcut commands)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mtepenner/brevity-sharing.git
   cd brevity-sharing
   ```

2.  **Set up environment variables:**
    Copy the example environment file in the infrastructure folder:

    ```bash
    cp infrastructure/.env.example infrastructure/.env
    ```

3.  **Spin up the stack:**
    You can easily start the entire application using the provided Makefile:

    ```bash
    make up
    ```

    *(Alternatively, run: `docker-compose -f infrastructure/docker-compose.yml --env-file infrastructure/.env up -d`)*

4.  **Rebuild after changes:**
    If you modify the Go or React code, rebuild the images:

    ```bash
    make build
    ```

5.  **Tear down the stack:**

    ```bash
    make down
    ```

## 🚀 Usage

Once the Docker containers are running, you can access the application components at the following local endpoints:

  - **Frontend UI:** [http://localhost](https://www.google.com/search?q=http://localhost)
  - **Backend API:** [http://localhost:8080/api](https://www.google.com/search?q=http://localhost:8080/api)

### Example API Endpoints

  - `GET /api/timeline` - Fetch the timeline feed.
  - `POST /api/tweets` - Create a new post.

## 🏗️ Architecture

Brevity uses a multi-container architecture. The Go API handles business logic and interfaces with PostgreSQL and Redis. The React frontend is built statically via Vite and served blazingly fast using Nginx.

## 🤝 Contributing

Contributions are welcome\! If you'd like to help improve Brevity, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request using the provided PR template.

Please review our [Bug Report](https://github.com/mtepenner/brevity-sharing/tree/main/.github/ISSUE_TEMPLATE/bug_report.md) template if you encounter any issues.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
