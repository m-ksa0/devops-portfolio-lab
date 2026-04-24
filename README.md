# DevOps Portfolio Lab

A curated DevOps and backend engineering portfolio demonstrating Linux
operations, backend service design, infrastructure automation,
observability, containerization, and CI/CD delivery.

## Purpose

This repository is designed to show how I approach real-world
engineering problems:

-   building backend services with operational visibility
-   managing Linux infrastructure and security signals
-   creating safe automation tools
-   packaging and delivering services through CI/CD pipelines

## Projects

-   [DevOps Service Stack](projects/devops-service-stack)
-   [Infra Guard](projects/infra-guard)
-   [Delivery Layer](delivery)

## 1. DevOps Service Stack

A production-style backend service using Node.js, PostgreSQL, Redis,
Docker Compose, health checks, structured logs, request metrics, and an
internal operations dashboard.

Demonstrates: - backend service design - Dockerized infrastructure -
PostgreSQL persistence - Redis caching and invalidation - health checks
and dependency monitoring - internal observability dashboard

## 2. Infra Guard

A Linux infrastructure monitoring and safe auto-response tool that
parses SSH/auth and Nginx logs to detect suspicious behavior.

Demonstrates: - Linux log analysis - security-minded automation - safe
dry-run response design - CLI tooling - operational reporting

## 3. Delivery Layer

The deployment layer includes a repeatable database migration step. This avoids relying only on Docker's first-boot Postgres init behavior, which only runs when the database volume is first created.

CI/CD and deployment workflows for the portfolio projects.

Demonstrates: - GitHub Actions - Docker image builds - image
publishing - production-style Docker Compose deployment - rollback
strategy - environment separation

## Dashboard Preview

![DevOps Service Stack
Dashboard](docs/images/service-stack-dashboard.png)

## Why This Portfolio Matters

This portfolio focuses on practical DevOps engineering, not theoretical
setups.

Each project demonstrates real-world concerns: - service reliability -
observability and logging - safe automation - containerized
environments - reproducible deployments

The goal is to show how I think about systems in production
environments, not just how I use tools.

## Quick Start

### DevOps Service Stack

``` bash
cd projects/devops-service-stack
cp .env.example .env
docker compose up --build
```

Open: http://localhost:3000/dashboard

### Infra Guard

``` bash
cd projects/infra-guard
python -m infra_guard.cli --file samples/auth.log --type auth --dry-run
```

## Portfolio Narrative

This portfolio presents me as a DevOps / Platform Engineer with
practical experience in Linux systems, backend services, automation, and
operational reliability.

The projects are intentionally small, but built with production-oriented
thinking: clear logs, health checks, safe automation, repeatable
deployment, and maintainable structure.
