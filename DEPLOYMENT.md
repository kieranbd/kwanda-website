# Tag-based Deployments

This repo promotes commits into the `dev` and `main` branches by pushing tags with specific prefixes. GitHub Actions workflows in `.github/workflows/` listen for these tag pushes, update the corresponding branch to the tagged commit, and then run deployment logic.

## Workflow Matrix

| Tag Pattern       | Workflow File                     | Target Branch | Purpose                |
|-------------------|-----------------------------------|---------------|------------------------|
| `deploy-dev-*`    | `.github/workflows/deploy-dev.yml`  | `dev`         | Promote to dev env     |
| `deploy-main-*`   | `.github/workflows/deploy-main.yml` | `main`        | Promote to production  |

## How to Deploy

1. Commit and push your changes.
2. Create an annotated tag that matches your target environment:
   ```bash
   git tag -a deploy-dev-2025-11-14 -m "Deploy dev"
   git tag -a deploy-main-2025-11-14 -m "Deploy main"
   ```
3. Push the tag to GitHub:
   ```bash
   git push origin deploy-dev-2025-11-14
   ```
4. GitHub Actions will:
   - Check out the tagged commit
   - Fast-forward the corresponding branch (`dev` or `main`)
   - Run the deployment steps defined in the workflow

Replace the placeholder `echo` step in each workflow with the actual deployment commands (build, upload, invalidate cache, etc.). Keep the `contents: write` permission if the workflow needs to push back to the repo.
