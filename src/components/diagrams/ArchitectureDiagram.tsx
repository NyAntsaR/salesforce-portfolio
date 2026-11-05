import type { ArchitectureDiagram as Diagram, DiagramNode } from "@/content/types";

const NODE_WIDTH = 188;
const NODE_HEIGHT = 64;
const COLUMN_GAP = 72;
const ROW_GAP = 64;
const PADDING = 16;

interface Box {
  x: number;
  y: number;
  cx: number;
  cy: number;
}

function boxFor(node: DiagramNode): Box {
  const x = PADDING + node.column * (NODE_WIDTH + COLUMN_GAP);
  const y = PADDING + node.row * (NODE_HEIGHT + ROW_GAP);
  return { x, y, cx: x + NODE_WIDTH / 2, cy: y + NODE_HEIGHT / 2 };
}

/** Point where the line from a box's center toward (dx, dy) leaves the box. */
function edgePoint(box: Box, dx: number, dy: number) {
  const scale = Math.min(
    dx === 0 ? Infinity : NODE_WIDTH / 2 / Math.abs(dx),
    dy === 0 ? Infinity : NODE_HEIGHT / 2 / Math.abs(dy),
  );
  return { x: box.cx + dx * scale, y: box.cy + dy * scale };
}

/**
 * Renders an architecture diagram from project content as inline SVG: no client JavaScript,
 * themed through CSS variables, with a text equivalent for screen readers and small screens.
 */
export function ArchitectureDiagram({ diagram, id }: { diagram: Diagram; id: string }) {
  const boxes = new Map(diagram.nodes.map((node) => [node.id, boxFor(node)]));
  const nodesById = new Map(diagram.nodes.map((node) => [node.id, node]));
  const columns = Math.max(...diagram.nodes.map((n) => n.column)) + 1;
  const rows = Math.max(...diagram.nodes.map((n) => n.row)) + 1;
  const width = PADDING * 2 + columns * NODE_WIDTH + (columns - 1) * COLUMN_GAP;
  const height = PADDING * 2 + rows * NODE_HEIGHT + (rows - 1) * ROW_GAP;
  const hasPlanned = diagram.nodes.some((n) => n.status !== "done");

  return (
    <figure className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
          className="h-auto w-full"
          style={{ minWidth: Math.min(width, 640) }}
        >
          <title id={`${id}-title`}>{diagram.title}</title>
          <desc id={`${id}-desc`}>{diagram.description}</desc>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted" />
            </marker>
          </defs>

          {diagram.edges.map((edge) => {
            const from = boxes.get(edge.from);
            const to = boxes.get(edge.to);
            if (!from || !to) return null;
            const dx = to.cx - from.cx;
            const dy = to.cy - from.cy;
            const start = edgePoint(from, dx, dy);
            const end = edgePoint(to, -dx, -dy);
            const planned =
              nodesById.get(edge.from)?.status !== "done" || nodesById.get(edge.to)?.status !== "done";
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className="stroke-muted"
                  strokeWidth={1.5}
                  strokeDasharray={planned ? "5 4" : undefined}
                  markerEnd={`url(#${id}-arrow)`}
                />
                {edge.label && (
                  <g>
                    <rect
                      x={midX - edge.label.length * 3.4 - 6}
                      y={midY - 10}
                      width={edge.label.length * 6.8 + 12}
                      height={18}
                      rx={4}
                      className="fill-surface"
                    />
                    <text x={midX} y={midY + 3} textAnchor="middle" className="fill-muted" fontSize={11}>
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {diagram.nodes.map((node) => {
            const box = boxes.get(node.id)!;
            const built = node.status === "done";
            return (
              <g key={node.id}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={10}
                  className={built ? "fill-accent-soft stroke-accent" : "fill-surface-muted stroke-planned"}
                  strokeWidth={1.5}
                  strokeDasharray={built ? undefined : "6 4"}
                />
                <text
                  x={box.cx}
                  y={node.sublabel ? box.cy - 4 : box.cy + 5}
                  textAnchor="middle"
                  className={built ? "fill-foreground" : "fill-planned"}
                  fontSize={13}
                  fontWeight={600}
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text x={box.cx} y={box.cy + 14} textAnchor="middle" className="fill-muted" fontSize={10.5}>
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-4 text-sm text-muted">
        {diagram.description}
        {hasPlanned && (
          <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-3 w-5 rounded border-[1.5px] border-accent bg-accent-soft" />
              Built
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-5 rounded border-[1.5px] border-dashed border-planned bg-surface-muted"
              />
              Not built yet
            </span>
          </span>
        )}
      </figcaption>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-accent">Diagram as text</summary>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted">
          {diagram.edges.map((edge) => {
            const from = nodesById.get(edge.from);
            const to = nodesById.get(edge.to);
            if (!from || !to) return null;
            const planned = from.status !== "done" || to.status !== "done";
            return (
              <li key={`${edge.from}-${edge.to}`}>
                {from.label} → {to.label}
                {edge.label ? ` (${edge.label})` : ""}
                {planned ? " — not built yet" : ""}
              </li>
            );
          })}
        </ol>
      </details>
    </figure>
  );
}
