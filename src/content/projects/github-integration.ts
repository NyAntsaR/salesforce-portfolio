import type { Project } from "../types";

// Source links point at the branch where this work lives. Update SOURCE_REF
// once the branch is merged (for example to "main").
const REPO = "https://github.com/NyAntsaR/Integration_Practice";
const SOURCE_REF = "feature/github-integration";
const src = (path: string) => `${REPO}/blob/${SOURCE_REF}/Integration_Project/force-app/main/default/${path}`;

export const githubIntegration: Project = {
  slug: "salesforce-github-integration",
  title: "Salesforce ↔ GitHub Integration",
  tagline:
    "Escalate a Service Cloud Case to Engineering by creating a GitHub Issue from Salesforce, asynchronously and with an audit trail.",
  status: "in-progress",
  summary:
    "Support agents escalate a Case to Engineering, and Salesforce creates a matching GitHub Issue in the background. " +
    "Each escalation is tracked as a durable Integration Operation with an idempotency key, a processing lease, and a status that separates " +
    "safe-to-retry failures from outcomes that need reconciliation. The flow is unit tested and has been run end to end against a real GitHub repository. " +
    "The agent-facing Lightning Web Component and automatic retries are next.",
  problem:
    "When a support Case needs an engineering fix, agents copy details into GitHub by hand. Links between the Case and the issue get lost, " +
    "the same Case can be escalated twice, and nobody can see whether the handoff actually succeeded.",
  stack: [
    "Apex",
    "Queueable Apex",
    "Named & External Credentials",
    "OAuth 2.0",
    "GitHub REST API",
    "Custom Metadata Types",
    "Lightning App Builder",
    "Dynamic Forms",
    "Salesforce DX",
  ],
  capabilities: [
    {
      label: "Create GitHub Issue button on the Case",
      status: "planned",
      detail:
        "The Case record page has a reserved placeholder in the sidebar. The button itself is not built yet.",
    },
    {
      label: "LWC issue creation form",
      status: "planned",
      detail: "Not started. It will call the existing Apex escalation service.",
    },
    {
      label: "Apex handles the submission",
      status: "done",
      detail:
        "CaseEscalationService.escalateToEngineering() validates the Case, records an Integration Operation (or reuses a Failed one for a retry), marks the Case Pending, and enqueues the job.",
    },
    {
      label: "OAuth 2.0 through Named Credentials",
      status: "done",
      detail:
        "Callouts use the GithubAPI Named Credential, backed by an External Credential that uses an OAuth authentication provider. " +
        "No tokens appear in code. The credential is configured in the org and is not yet in source control.",
    },
    {
      label: "Queueable Apex for asynchronous callouts",
      status: "done",
      detail:
        "GitHubIssueQueueable runs in two steps: the first job claims the operation (Processing, with a lease), and a second job holding that lease calls GitHub and writes the result back to the Case.",
    },
    {
      label: "Transactional Outbox Pattern",
      status: "partial",
      detail:
        "Built: the Integration Operation record is saved in the same transaction that marks the Case Pending and enqueues the job, so all three commit or roll back together. " +
        "Not yet built: a scheduled dispatcher that picks up Pending operations on its own instead of relying on the directly enqueued job.",
    },
    {
      label: "Retry with exponential backoff",
      status: "planned",
      detail:
        "Not implemented. A Failed operation can be retried manually by escalating the Case again, which reuses the same operation and keeps its attempt count. " +
        "Next Retry At and a Retry Scheduled status exist on the operation but are not used yet.",
    },
    {
      label: "Idempotency and duplicate prevention",
      status: "partial",
      detail:
        "Built: each Case gets one operation with a unique idempotency key, the Case and operation rows are locked while they are checked, " +
        "only the job holding the operation's lease may call GitHub, and Cases already linked to an issue are never sent again. " +
        "Not yet handled: automatic recovery of an operation whose lease expired, for example if Salesforce fails to save the result after GitHub created the issue.",
    },
    {
      label: "Integration logging and failure recovery",
      status: "partial",
      detail:
        "Built: every attempt writes an Integration Log, and the operation records the last HTTP status and error. " +
        "A 4xx response is marked Failed and can be retried; a timeout, 5xx, or unreadable response is marked Reconciliation Required, because GitHub may have created the issue. " +
        "Not yet built: automatic retries and tooling to reconcile uncertain outcomes.",
    },
    {
      label: "Apex unit testing",
      status: "done",
      detail:
        "39 test methods across three test classes, using HttpCalloutMock for every callout scenario, including timeouts.",
    },
  ],
  architecture: {
    title: "Case escalation flow",
    description:
      "Planned: an agent submits the escalation from an LWC on the Case page. Built: CaseEscalationService validates the Case and enqueues " +
      "GitHubIssueQueueable, which claims the Integration Operation, calls the GitHub REST API through the GithubAPI Named Credential, " +
      "writes the result back to the Case and the operation, and records the attempt in Integration_Log__c. Dashed parts are not built yet.",
    nodes: [
      { id: "agent", label: "Support agent", sublabel: "Case record page", column: 0, row: 0, status: "done" },
      { id: "lwc", label: "Escalation LWC", sublabel: "button + form", column: 0, row: 1, status: "planned" },
      { id: "service", label: "CaseEscalationService", sublabel: "rules · row lock · Pending", column: 1, row: 0, status: "done" },
      { id: "operation", label: "Integration_Operation__c", sublabel: "idempotency key · lease · status", column: 1, row: 1, status: "done" },
      { id: "log", label: "Integration_Log__c", sublabel: "status · HTTP code · correlation ID", column: 1, row: 2, status: "done" },
      { id: "queueable", label: "GitHubIssueQueueable", sublabel: "Database.AllowsCallouts", column: 2, row: 0, status: "done" },
      { id: "client", label: "GitHubApiService", sublabel: "validation · error mapping", column: 2, row: 1, status: "done" },
      { id: "case", label: "Case", sublabel: "issue #, URL, sync status", column: 3, row: 0, status: "done" },
      { id: "nc", label: "Named Credential", sublabel: "GithubAPI · OAuth", column: 3, row: 1, status: "done" },
      { id: "github", label: "GitHub REST API", sublabel: "POST /repos/{owner}/{repo}/issues", column: 4, row: 1, status: "done" },
    ],
    edges: [
      { from: "agent", to: "lwc", label: "clicks" },
      { from: "lwc", to: "service", label: "submit" },
      { from: "service", to: "operation", label: "record" },
      { from: "service", to: "queueable", label: "enqueue" },
      { from: "queueable", to: "operation", label: "claim · result" },
      { from: "queueable", to: "client", label: "createIssue" },
      { from: "client", to: "nc" },
      { from: "nc", to: "github", label: "HTTPS" },
      { from: "queueable", to: "case", label: "write back" },
      { from: "queueable", to: "log", label: "log attempt" },
    ],
  },
  components: [
    {
      name: "CaseEscalationService",
      kind: "Apex class",
      description:
        "Entry point for an escalation. Queries the Case in user mode with FOR UPDATE, confirms edit access, blocks duplicates, records or retries the Integration Operation, marks the Case Pending, and enqueues the job.",
      sourceHref: src("classes/CaseEscalationService.cls"),
      status: "done",
    },
    {
      name: "GitHubIssueQueueable",
      kind: "Queueable Apex",
      description:
        "Two-step job: claims the operation with a lease, then calls GitHub, classifies any failure as Failed or Reconciliation Required, writes the issue ID, number, URL, and sync status back to the Case, and records the attempt in Integration_Log__c.",
      sourceHref: src("classes/GitHubIssueQueueable.cls"),
      status: "done",
    },
    {
      name: "GitHubApiService",
      kind: "Apex class",
      description:
        "GitHub REST client. Validates the owner, repository, and title before building the URL, maps GitHub's JSON explicitly, and turns HTTP errors into readable exceptions with a status code.",
      sourceHref: src("classes/GitHubApiService.cls"),
      status: "done",
    },
    {
      name: "Integration_Log__c",
      kind: "Custom object",
      description:
        "One record per attempt: operation, status, HTTP status code, attempt count, correlation ID (unique external ID), sanitized error message, and timestamp. Private sharing.",
      sourceHref: `${REPO}/tree/${SOURCE_REF}/Integration_Project/force-app/main/default/objects/Integration_Log__c`,
      status: "done",
    },
    {
      name: "Integration_Operation__c",
      kind: "Custom object",
      description:
        "One durable record per escalation: unique idempotency key, Case, status (Pending, Processing, Success, Failed, Reconciliation Required), attempt count, " +
        "external issue ID, last HTTP status and error, and lease owner and expiry. Private sharing.",
      sourceHref: `${REPO}/tree/${SOURCE_REF}/Integration_Project/force-app/main/default/objects/Integration_Operation__c`,
      status: "done",
    },
    {
      name: "GitHub_Integration_Setting__mdt",
      kind: "Custom metadata type",
      description:
        "Holds the target repository owner and name, so changing repositories needs no code change.",
      sourceHref: `${REPO}/tree/${SOURCE_REF}/Integration_Project/force-app/main/default/objects/GitHub_Integration_Setting__mdt`,
      status: "done",
    },
    {
      name: "Case fields",
      kind: "Custom fields",
      description:
        "GitHub Issue Number, URL, and ID, Engineering Status, Engineering Sync Status, and Last Engineering Sync.",
      sourceHref: `${REPO}/tree/${SOURCE_REF}/Integration_Project/force-app/main/default/objects/Case/fields`,
      status: "done",
    },
    {
      name: "GitHub_Integration_Access",
      kind: "Permission set",
      description:
        "Least-privilege access for the integration: the External Credential principal, read/edit on Case (no create or delete), and create/read/edit on Integration Logs and Integration Operations, with no delete.",
      sourceHref: src("permissionsets/GitHub_Integration_Access.permissionset-meta.xml"),
      status: "done",
    },
    {
      name: "Engineering Escalation Console",
      kind: "Lightning app & record page",
      description:
        "Console app with tabs for Cases, Integration Logs, and Integration Operations. The Case record page uses Dynamic Forms: GitHub fields on the Details tab, Integration Logs and Integration Operations on the Related tab, and a sidebar reserved for the escalation component.",
      sourceHref: src("flexipages/Engineering_Escalation_Case_Page.flexipage-meta.xml"),
      status: "done",
    },
    {
      name: "Escalation component",
      kind: "Lightning Web Component",
      description: "The agent-facing button and form. Not built yet.",
      status: "planned",
    },
  ],
  decisions: [
    {
      title: "Asynchronous callout through Queueable Apex",
      detail:
        "The agent's request only validates the Case and enqueues a job, so a slow or failing GitHub API never blocks the agent's screen. " +
        "Queueable Apex was chosen over a future method because it accepts typed state (the operation ID and lease) and can be chained, which the two-step claim-then-call design relies on.",
    },
    {
      title: "Credentials stay out of code",
      detail:
        "All callouts go through the GithubAPI Named Credential, so Apex never handles tokens. " +
        "Access to the credential is granted through a permission set rather than to everyone.",
    },
    {
      title: "Duplicate prevention at the database",
      detail:
        "The escalation query uses FOR UPDATE, so two clicks on the same Case are serialized. The idempotency key (org + Case) is a unique field, " +
        "so even a missed check cannot create a second operation for the same Case. A retry reuses the operation and its correlation ID, so every attempt stays linked.",
    },
    {
      title: "Enforce the user's permissions",
      detail:
        "The escalation service queries the Case WITH USER_MODE, checks edit access, and updates the Case as the user, so a user who cannot edit the Case cannot escalate it. " +
        "The background job then saves its results with sharing enforced, in system context.",
    },
    {
      title: "Callout before DML",
      detail:
        "Salesforce does not allow a callout after uncommitted DML in the same transaction, so a job cannot save a Processing status and then call GitHub. " +
        "The work is split into two jobs: the first saves the claim and lease, and the second, holding that lease, calls GitHub first and saves the results afterwards.",
    },
    {
      title: "Readable, sanitized errors",
      detail:
        "GitHub responses are mapped to clear messages (authentication, permissions, not found, rate limits, validation). Only GitHub's own message text is kept, never headers or full bodies.",
    },
    {
      title: "Classify failures by certainty",
      detail:
        "A 4xx response means GitHub rejected the request, so no issue exists and the operation can be retried. A timeout, a 5xx, or an unreadable success response " +
        "means the issue may already exist, so the operation is marked Reconciliation Required and blocks a blind retry that could create a duplicate.",
    },
  ],
  testing: {
    summary:
      "Every callout path is tested with HttpCalloutMock. On 2026-11-05 all 39 test methods passed in a Developer Edition org, " +
      "with code coverage of 100% for GitHubApiService, 97% for CaseEscalationService, and 96% for GitHubIssueQueueable. " +
      "The same day, a test Case was escalated end to end in that org: both job steps completed, GitHub returned HTTP 201, and the issue was linked back to the Case.",
    points: [
      "Successful issue creation, including the request URL, headers, and JSON body.",
      "Input validation, including attempts to change the URL path with slashes or '..'.",
      "Each mapped HTTP error (401, 403, 404, 410, 422, 429, 5xx), timeouts, and non-JSON responses.",
      "Escalation rules: missing Case, existing GitHub Issue, an operation already in progress, and a second click on the same Case.",
      "Retries: a Failed operation is reused and reset; Success and Reconciliation Required operations block a new escalation.",
      "The two job steps: claiming takes a lease without calling GitHub, and a job without the lease never calls GitHub.",
      "Failure classification: 4xx becomes Failed; 5xx and timeouts become Reconciliation Required.",
      "Write-back to the Case, the operation, and the Integration Log on success, HTTP failure, and missing configuration.",
      "Not yet covered: the 'no edit access' check, which needs a second test user, and the hand-off between the two job steps, because Apex tests cannot chain queueable jobs.",
    ],
  },
  screenshots: [
    {
      alt: "Case record page in the Engineering Escalation Console",
      caption: "Case record page with the GitHub Engineering Information section.",
    },
    {
      alt: "Integration Logs related list on a Case",
      caption: "Integration Logs showing the status of each attempt.",
    },
    {
      alt: "GitHub Issue created from a Salesforce Case",
      caption: "The resulting GitHub Issue.",
    },
  ],
  demo: {
    label: "Demo video",
    note: "A walkthrough will be added once the escalation component is built.",
  },
  links: [
    { label: "Source code on GitHub", href: `${REPO}/tree/${SOURCE_REF}/Integration_Project` },
    { label: "Commit history", href: `${REPO}/commits/${SOURCE_REF}` },
  ],
  lastVerified: "2026-11-05",
};
