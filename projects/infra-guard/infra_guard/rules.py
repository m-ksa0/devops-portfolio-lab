from collections import Counter
from typing import Iterable

from infra_guard.models import Finding, LogEvent


def severity_for_count(count: int) -> str:
    if count >= 20:
        return "critical"
    if count >= 10:
        return "high"
    if count >= 5:
        return "medium"
    return "low"


def action_for_severity(severity: str) -> str:
    if severity in {"critical", "high"}:
        return "ban_candidate"
    if severity == "medium":
        return "watch"
    return "observe"


def analyze_events(events: Iterable[LogEvent]) -> list[Finding]:
    counter: Counter[tuple[str, str]] = Counter()

    for event in events:
        counter[(event.ip, event.event_type)] += 1

    findings: list[Finding] = []

    for (ip, reason), count in counter.items():
        severity = severity_for_count(count)
        action = action_for_severity(severity)

        findings.append(
            Finding(
                ip=ip,
                reason=reason,
                count=count,
                severity=severity,
                action=action,
            )
        )

    return sorted(findings, key=lambda item: item.count, reverse=True)
