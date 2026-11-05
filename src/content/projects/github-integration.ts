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
    "The escalation rules, the asynchronous callout, the write-back to the Case, and integration logging are built and unit tested. " +
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
        "CaseEscalationService.escalateToEngineering() validates the Case, applies the escalation rules, marks it Pending, and enqueues the callout job.",
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
        "GitHubIssueQueueable implements Database.AllowsCallouts, creates the issue, and writes the result back to the Case.",
    },
    {
      label: "Transactional Outbox Pattern",
      status: "planned",
      detail:
        "Not implemented. Today the job is enqueued directly in the same transaction that marks the Case Pending.",
    },
    {
      label: "Retry with exponential backoff",
      status: "planned",
      detail:
        "Not implemented. Integration logs record an attempt count, and a Failed escalation can be retried by escalating the Case again.",
    },
    {
      label: "Idempotency and duplicate prevention",
      status: "partial",
      detail:
        "Built: the Case row is locked while it is checked, a Case that already has a GitHub Issue or a Pending/Processing escalation is rejected, " +
        "and each escalation gets a unique correlation ID. Not yet handled: a callout that succeeds at GitHub but whose Salesforce update then fails.",
    },
    {
      label: "Integration logging and failure recovery",
      status: "partial",
      detail:
        "Built: every attempt writes an Integration Log with operation, status, HTTP status code, correlation ID, and a sanitized error message, " +
        "and failures mark the Case as Failed. Not yet built: automatic recovery of failed attempts.",
    },
    {
      label: "Apex unit testing",
      status: "done",
      detail:
        "26 test methods across three test classes, using HttpCalloutMock for every callout scenario.",
    },
  ],
  architecture: {
    title: "Case escalation flow",
    description:
      "Planned: an agent submits the escalation from an LWC on the Case page. Built: CaseEscalationService validates the Case and enqueues " +
      "GitHubIssueQueueable, which calls the GitHub REST API through the GithubAPI Named Credential, writes the result back to the Case, " +
      "and records the attempt in Integration_Log__c. Dashed parts are not built yet.",
    nodes: [
      { id: "agent", label: "Support agent", sublabel: "Case record page", column: 0, row: 0, status: "done" },
      { id: "lwc", label: "Escalation LWC", sublabel: "button + form", column: 0, row: 1, status: "planned" },
      { id: "service", label: "CaseEscalationService", sublabel: "rules · row lock · Pending", column: 1, row: 0, status: "done" },
      { id: "log", label: "Integration_Log__c", sublabel: "status · HTTP code · correlation ID", column: 1, row: 1, status: "done" },
      { id: "queueable", label: "GitHubIssueQueueable", sublabel: "Database.AllowsCallouts", column: 2, row: 0, status: "done" },
      { id: "client", label: "GitHubApiService", sublabel: "validation · error mapping", column: 2, row: 1, status: "done" },
      { id: "case", label: "Case", sublabel: "issue #, URL, sync status", column: 3, row: 0, status: "done" },
      { id: "nc", label: "Named Credential", sublabel: "GithubAPI · OAuth", column: 3, row: 1, status: "done" },
      { id: "github", label: "GitHub REST API", sublabel: "POST /repos/{owner}/{repo}/issues", column: 4, row: 1, status: "done" },
    ],
    edges: [
      { from: "agent", to: "lwc", label: "clicks" },
      { from: "lwc", to: "service", label: "submit" },
      { from: "service", to: "queueable", label: "enqueue" },
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
        "Entry point for an escalation. Queries the Case in user mode with FOR UPDATE, confirms edit access, blocks duplicates, marks the Case Pending, and enqueues the job with a new correlation ID.",
      sourceHref: src("classes/CaseEscalationService.cls"),
      status: "done",
    },
    {
      name: "GitHubIssueQueueable",
      kind: "Queueable Apex",
      description:
        "Runs the callout asynchronously, writes the issue ID, number, URL, and sync status back to the Case, and records the attempt in Integration_Log__c.",
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
        "Least-privilege access for the integration: the External Credential principal, read/edit on Case (no create or delete), and create/read/edit on Integration Logs.",
      sourceHref: src("permissionsets/GitHub_Integration_Access.permissionset-meta.xml"),
      status: "done",
    },
    {
      name: "Engineering Escalation Console",
      kind: "Lightning app & record page",
      description:
        "Console app with a Case record page built with Dynamic Forms: GitHub fields on the Details tab, Integration Logs on the Related tab, and a sidebar reserved for the escalation component.",
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
        "Queueable Apex was chosen over a future method because it accepts typed state (the Case ID and correlation ID) and can be chained later for retries.",
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
        "The escalation query uses FOR UPDATE, so two clicks on the same Case are serialized and the second one sees the Pending status. " +
        "Correlation IDs are a unique external ID on the log, ready for upserts once retries reuse them.",
    },
    {
      title: "Enforce the user's permissions",
      detail:
        "Queries run WITH USER_MODE and updates run as the user, so sharing and field-level security apply. A user who cannot edit the Case cannot escalate it.",
    },
    {
      title: "Callout before DML",
      detail:
        "Salesforce does not allow a callout after uncommitted DML in the same transaction. The queueable therefore calls GitHub first, then updates the Case and inserts the log. " +
        "This is also why the Processing status is not used yet.",
    },
    {
      title: "Readable, sanitized errors",
      detail:
        "GitHub responses are mapped to clear messages (authentication, permissions, not found, rate limits, validation). Only GitHub's own message text is kept, never headers or full bodies.",
    },
  ],
  testing: {
    summary:
      "Every callout path is tested with HttpCalloutMock. On 2026-11-04 the three test classes passed in a Developer Edition org, " +
      "with code coverage of 100% for GitHubApiService, 93% for CaseEscalationService, and 100% for GitHubIssueQueueable.",
    points: [
      "Successful issue creation, including the request URL, headers, and JSON body.",
      "Input validation, including attempts to change the URL path with slashes or '..'.",
      "Each mapped HTTP error (401, 403, 404, 410, 422, 429, 5xx), timeouts, and non-JSON responses.",
      "Escalation rules: missing Case, existing GitHub Issue, and Pending or Processing escalations.",
      "Write-back to the Case and Integration Log contents on success, HTTP failure, and missing configuration.",
      "Not yet covered: the 'no edit access' check, which needs a second test user.",
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
