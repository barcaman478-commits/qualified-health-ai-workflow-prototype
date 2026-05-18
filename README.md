# Qualified Health AI Adoption Workflow Prototype

This is a self-contained React prototype for guiding health-system clients through responsible AI adoption. It is positioned as a Business Analyst / Product Analyst artifact for Qualified Health:

1. Discover
2. Map Workflow
3. Identify Opportunities
4. Assess Readiness
5. Plan Deployment

## Hiring Reviewer Context

The prototype demonstrates stakeholder discovery, workflow mapping, opportunity prioritization, readiness scoring, governance/risk thinking, and rollout planning. It is meant to show how an analyst could help a healthcare client translate operational pain points into responsible AI deployment plans.

For a send-ready overview, see:

```text
QUALIFIED_HEALTH_PROTOTYPE_OVERVIEW.md
QUALIFIED_HEALTH_SEND_NOTE.md
```

The app uses locally vendored React browser files and a tiny static server, so it does not require npm.

## Run

Double-click:

```text
RUN_APP.cmd
```

Or from PowerShell in this folder:

```powershell
.\RUN_APP.cmd
```

Then open:

```text
http://localhost:4173
```

If port `4173` is already in use, the server automatically tries the next available port.

## Temporary Share Link

After `tools/cloudflared.exe` has been downloaded, run:

```powershell
.\SHARE_APP.cmd
```

The script prints a temporary public URL and writes it to `.share/public-url.txt`. Keep the computer awake while the recruiter is using the link.

You can also double-click:

```text
scripts\launch-share.cmd
```

That opens minimized windows for the local app server and Cloudflare tunnel. The `node scripts/share-link.js` command is easier when you want the URL printed in the same window.

## Public Hosting

This project is also suitable for static hosting through GitHub Pages because the live app is fully client-side and does not require a backend or paid API service.
