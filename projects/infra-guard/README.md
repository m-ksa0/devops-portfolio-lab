# infra-guard

Linux infrastructure log monitor and safe auto-response tool.

## Purpose

`infra-guard` analyzes common Linux service logs and identifies suspicious behavior such as repeated SSH failures and probes against sensitive web paths.

The tool is designed with a safety-first approach:

- detection before enforcement
- dry-run mode by default
- clear explainable findings
- firewall suggestions instead of automatic blocking

## Supported Logs

- SSH/auth logs
- Nginx access logs

## Example Usage

```bash
python -m infra_guard.cli --file samples/auth.log --type auth --dry-run
