import argparse

from infra_guard.parsers import parse_file
from infra_guard.rules import analyze_events
from infra_guard.reporter import print_table, print_dry_run_actions


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Infra Guard - Linux log monitor and safe auto-response tool"
    )

    parser.add_argument(
        "--file",
        required=True,
        help="Path to log file",
    )

    parser.add_argument(
        "--type",
        required=True,
        choices=["auth", "nginx"],
        help="Log type to parse",
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print suggested actions without applying changes",
    )

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    events = parse_file(args.file, args.type)
    findings = analyze_events(events)

    print_table(findings)

    if args.dry_run:
        print_dry_run_actions(findings)


if __name__ == "__main__":
    main()
