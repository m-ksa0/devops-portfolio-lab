from infra_guard.models import Finding


def print_table(findings: list[Finding]) -> None:
    if not findings:
        print("No suspicious activity found.")
        return

    print(f"{'IP':<18} {'REASON':<28} {'COUNT':<8} {'SEVERITY':<10} {'ACTION':<15}")
    print("-" * 85)

    for finding in findings:
        print(
            f"{finding.ip:<18} "
            f"{finding.reason:<28} "
            f"{finding.count:<8} "
            f"{finding.severity:<10} "
            f"{finding.action:<15}"
        )


def print_dry_run_actions(findings: list[Finding]) -> None:
    candidates = [f for f in findings if f.action == "ban_candidate"]

    if not candidates:
        print("\nNo ban candidates found.")
        return

    print("\nDry-run suggested firewall actions:")
    print("-" * 40)

    for finding in candidates:
        print(f"sudo ufw deny from {finding.ip}  # {finding.reason}, count={finding.count}")
