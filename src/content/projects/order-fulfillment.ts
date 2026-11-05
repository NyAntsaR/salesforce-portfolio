import type { Project } from "../types";

// Planned project: everything below describes intended scope, not built work.
export const orderFulfillment: Project = {
  slug: "event-driven-order-fulfillment",
  title: "Event-Driven Order Fulfillment",
  tagline:
    "Publish order events from Salesforce with Platform Events and process them in an external subscriber.",
  status: "planned",
  summary:
    "A planned project exploring publish–subscribe integration: Salesforce publishes order events, and an external service subscribes, " +
    "processes them, and recovers from failures. Nothing has been built yet.",
  problem:
    "Point-to-point callouts couple Salesforce to every downstream system. An event-driven design lets fulfillment systems react to " +
    "orders independently, but it has to handle missed events, duplicates, and failures.",
  stack: ["Platform Events", "Apex", "Publish–subscribe", "External subscriber"],
  capabilities: [
    { label: "Salesforce Platform Events", status: "planned", detail: "Planned." },
    { label: "Publish–subscribe architecture", status: "planned", detail: "Planned." },
    { label: "External event subscriber", status: "planned", detail: "Planned." },
    { label: "Event replay and duplicate handling", status: "planned", detail: "Planned." },
    { label: "Error recovery", status: "planned", detail: "Planned." },
  ],
  architecture: {
    title: "Planned event flow",
    description:
      "Planned design: Salesforce publishes an order Platform Event to the event bus, and an external subscriber consumes it, " +
      "with replay and duplicate handling. Nothing in this diagram is built yet.",
    nodes: [
      { id: "order", label: "Order in Salesforce", column: 0, row: 0, status: "planned" },
      { id: "event", label: "Platform Event", sublabel: "publish", column: 1, row: 0, status: "planned" },
      { id: "bus", label: "Event bus", sublabel: "replay", column: 2, row: 0, status: "planned" },
      { id: "subscriber", label: "External subscriber", sublabel: "dedupe · recovery", column: 3, row: 0, status: "planned" },
    ],
    edges: [
      { from: "order", to: "event" },
      { from: "event", to: "bus" },
      { from: "bus", to: "subscriber", label: "subscribe" },
    ],
  },
  components: [],
  decisions: [],
  screenshots: [],
  demo: { label: "Demo", note: "Not started." },
  links: [{ label: "Source code" }],
};
