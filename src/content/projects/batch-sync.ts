import type { Project } from "../types";

// Planned project: everything below describes intended scope, not built work.
export const batchSync: Project = {
  slug: "customer-data-batch-sync",
  title: "Customer Data Batch Synchronization",
  tagline:
    "Synchronize customer records between Salesforce and an external system on a schedule, in bulk.",
  status: "planned",
  summary:
    "A planned project for large-volume, scheduled synchronization: Batch and Schedulable Apex page through an external REST API " +
    "and upsert records by External ID, handling partial failures and reporting on each run. Nothing has been built yet.",
  problem:
    "Keeping customer data consistent across systems needs a sync that handles large volumes, paging, and records that fail " +
    "individually without stopping the whole run.",
  stack: ["Batch Apex", "Schedulable Apex", "REST API", "External ID upsert"],
  capabilities: [
    { label: "Batch Apex and Schedulable Apex", status: "planned", detail: "Planned." },
    { label: "REST API integrations", status: "planned", detail: "Planned." },
    { label: "External ID upsert", status: "planned", detail: "Planned." },
    { label: "Pagination and bulk processing", status: "planned", detail: "Planned." },
    { label: "Partial failure handling and monitoring", status: "planned", detail: "Planned." },
  ],
  architecture: {
    title: "Planned sync flow",
    description:
      "Planned design: a scheduled job starts a batch that pages through an external REST API and upserts records by External ID, " +
      "logging partial failures. Nothing in this diagram is built yet.",
    nodes: [
      { id: "schedule", label: "Schedulable Apex", column: 0, row: 0, status: "planned" },
      { id: "batch", label: "Batch Apex", sublabel: "pagination", column: 1, row: 0, status: "planned" },
      { id: "api", label: "External REST API", column: 2, row: 0, status: "planned" },
      { id: "upsert", label: "Upsert by External ID", sublabel: "partial success", column: 1, row: 1, status: "planned" },
      { id: "monitor", label: "Run monitoring", sublabel: "failures · totals", column: 2, row: 1, status: "planned" },
    ],
    edges: [
      { from: "schedule", to: "batch", label: "start" },
      { from: "batch", to: "api", label: "fetch page" },
      { from: "batch", to: "upsert" },
      { from: "upsert", to: "monitor" },
    ],
  },
  components: [],
  decisions: [],
  screenshots: [],
  demo: { label: "Demo", note: "Not started." },
  links: [{ label: "Source code" }],
};
