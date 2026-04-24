from dataclasses import dataclass

@dataclass(frozen=True)
class LogEvent:
    source: str
    ip: str
    event_type: str
    raw_line: str

@dataclass(frozen=True)
class Finding:
    ip: str
    reason: str
    count: int
    severity: str
    action: str
