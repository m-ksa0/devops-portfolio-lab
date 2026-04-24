import re
from pathlib import Path
from typing import Iterable

from infra_guard.models import LogEvent


IP_PATTERN = r"(?P<ip>\d{1,3}(?:\.\d{1,3}){3})"

SSH_FAILED_PASSWORD = re.compile(
    rf"Failed password for (?:invalid user )?.* from {IP_PATTERN}"
)

SSH_INVALID_USER = re.compile(
    rf"Invalid user .* from {IP_PATTERN}"
)

NGINX_ACCESS = re.compile(
    rf'^{IP_PATTERN} .* "(?P<method>GET|POST|PUT|DELETE|HEAD|OPTIONS) (?P<path>\S+) '
)


def parse_auth_line(line: str) -> LogEvent | None:
    failed_match = SSH_FAILED_PASSWORD.search(line)
    if failed_match:
        return LogEvent(
            source="auth",
            ip=failed_match.group("ip"),
            event_type="ssh_failed_password",
            raw_line=line.strip(),
        )

    invalid_match = SSH_INVALID_USER.search(line)
    if invalid_match:
        return LogEvent(
            source="auth",
            ip=invalid_match.group("ip"),
            event_type="ssh_invalid_user",
            raw_line=line.strip(),
        )

    return None


def parse_nginx_line(line: str) -> LogEvent | None:
    match = NGINX_ACCESS.search(line)
    if not match:
        return None

    path = match.group("path")

    suspicious_paths = [
        "/wp-admin",
        "/.env",
        "/phpmyadmin",
        "/admin",
        "/xmlrpc.php",
    ]

    if any(path.startswith(p) for p in suspicious_paths):
        return LogEvent(
            source="nginx",
            ip=match.group("ip"),
            event_type="nginx_sensitive_path",
            raw_line=line.strip(),
        )

    return None


def parse_file(path: str | Path, log_type: str) -> list[LogEvent]:
    events: list[LogEvent] = []

    with Path(path).open("r", encoding="utf-8", errors="ignore") as file:
        for line in file:
            event = None

            if log_type == "auth":
                event = parse_auth_line(line)
            elif log_type == "nginx":
                event = parse_nginx_line(line)
            else:
                raise ValueError(f"Unsupported log type: {log_type}")

            if event:
                events.append(event)

    return events
