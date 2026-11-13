import { cn } from "@/lib/utils";

// The API sends a team as "CODE (Full name)", or just "CODE" when it has no name.
const TEAM_PATTERN = /^([A-Za-z0-9]+) \(([\s\S]+)\)$/;

interface TeamTextProps {
  team: string;
  /**
   * `truncate` (default) keeps one line: the code always stays whole and the
   * name is cut with an ellipsis, for fixed-height table rows and badges.
   * `wrap` lets a long name flow onto more lines, for rows that can grow.
   */
  mode?: "truncate" | "wrap";
  className?: string;
}

/**
 * A team with its code first and the full name after it, muted, in brackets.
 * The whole label is in the tooltip, so a cut-off name can still be read.
 */
export function TeamText({ team, mode = "truncate", className }: TeamTextProps) {
  const match = TEAM_PATTERN.exec(team);

  if (!match) {
    return (
      <span
        title={team}
        className={cn(
          "min-w-0",
          mode === "truncate" ? "truncate" : "break-words [overflow-wrap:anywhere]",
          className,
        )}
      >
        {team}
      </span>
    );
  }

  const [, code, name] = match;

  return (
    <span
      title={team}
      className={cn(
        "flex min-w-0 gap-x-1.5",
        mode === "truncate" ? "items-baseline" : "flex-wrap items-baseline",
        className,
      )}
    >
      <span className="shrink-0 font-semibold">{code}</span>
      <span
        className={cn(
          "min-w-0 font-normal opacity-70",
          mode === "truncate" ? "truncate" : "break-words [overflow-wrap:anywhere]",
        )}
      >
        ({name})
      </span>
    </span>
  );
}
