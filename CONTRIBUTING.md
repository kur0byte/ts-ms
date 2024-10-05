# Contribution Guidelines

## 1. Creating a Feature Branch

### Starting from `develop` Branch

- All feature branches must be created from the **`develop`** branch. This branch serves as the integration branch for features.
- Ensure the **`develop`** branch is up-to-date with the latest changes before branching out.

### Naming the Feature Branch
PENDING

### Creating the Branch

Use the following Git command to create and switch to the new branch:

```bash
git checkout -b [feature-branch-name] develop
```

## 2. Commit Message Format

We have precise rules for formatting Git commit messages to ensure an easier-to-read commit history. Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the **Commit Message Header** format. The `body` is mandatory for all commits except those of type "docs." When the body is present, it must be at least 20 characters long and must conform to the **Commit Message Body** format. The `footer` is optional and follows the **Commit Message Footer** format.

### Commit Message Header

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: entity|service|repository|controller|config|util|integration|auth|test|worker
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory; the `(<scope>)` field is optional.

**Type**

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (e.g., gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (e.g., Github Actions, Google CI)
- **docs**: Documentation-only changes (OpenAPI, JSDoc, DBML)
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests

**Scope**

The scope should be the name of the architecture layer affected (as perceived by the person reading the changelog generated from commit messages). Supported scopes include:

- `entity` for changes related to domain entities
- `service` for changes to the business logic layer
- `repository` for changes related to data access layers or repositories
- `controller` for changes related to routing logic or API gateways
- `config` for configuration changes
- `util` for utility or helper functions
- `auth` for changes related to authentication and authorization
- `integration` for third-party service integrations
- `test` for changes related to tests
- `worker` for changes related to service workers

Additional scopes:

- `changelog`: for updating release notes in [CHANGELOG.md](http://changelog.md/)
- `dev-infra`: for dev-infra related changes within the directories /scripts and /tools
- `migrations`: for changes to ORM and database migrations

### Commit Message Body

Use the imperative, present tense: "fix" not "fixed" nor "fixes." Explain the motivation for the change, providing a comparison of the previous behavior with the new behavior to illustrate the impact of the change.

### Commit Message Footer

The footer can contain information about breaking changes and deprecations and is also the place to reference GitHub issues, Shortcut tickets, and other PRs that this commit closes or is related to.

**Example:**

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

### Revert Commits

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. The body should contain information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`, along with a clear description of the reason for reverting the commit.

## 3. Submitting a Pull Request

A well-crafted PR description sets the stage for an efficient and effective code review. Once the feature implementation is complete, push the final changes and create a pull request to merge the feature branch into **`develop`**.

### PR Template

Use the following template for the PR description:

```
## What?
## Why?
## How?
## Testing?
## Screenshots (optional)
## Anything Else?
```

**The What**

Clearly explain the changes you’ve made. Provide a concise summary of the PR’s overall effect.

**The Why**

Explain the purpose behind the changes. Highlight the business or engineering goals achieved by the PR.

**The How**

Describe the implementation details and significant design decisions.

**Testing**

Detail the tests you’ve added or run. Explain how the changes were tested and any potential edge cases.

**Screenshots (Optional)**

Include screenshots for UI changes or any visual evidence that can assist in understanding the impact of the changes.

**Anything Else?**

Mention any additional considerations, potential technical debt, or future enhancements.

### Example PR Description

```
## What?
I've added support for authentication to implement Key Result 2 of OKR1. It includes model, table, controller, and test. For more background, see ticket #JIRA-123.

## Why?
These changes complete the user login and account creation experience. See #JIRA-123 for more information.

## How?
This includes a migration, model, and controller for user authentication. I'm using Devise to do the heavy lifting. I ran Devise migrations, and those are included here.

## Testing?
I've added coverage for testing all new methods. I used Faker for a few random user emails and names.

## Screenshots (optional)

## Anything Else?
Consider using a 3rd party authentication provider to offload MFA and other considerations. AWS Cognito and Firebase are good options. Also, consider breaking this out into its own service for reuse across other apps.
```

## 4. Code Review Process

**Our code review process aims to:**

- Ensure high-quality code in terms of both functionality and readability.
- Detect and fix bugs early in the development process.
- Maintain a consistent coding style throughout the codebase.

All code submitted to our repositories undergoes review, regardless of whether it's contributed by team members or the community. Reviewers collaborate with contributors to enhance the quality of the code. Contributors are encouraged to engage actively in the review process to get their pull requests merged successfully.

### The Process

The PR review process involves several stages:

1. **Assignment:**
    - Once a pull request is submitted, an on-call team member assigns it to a reviewer.
    - Reviewers are selected based on their expertise and to evenly distribute the workload.
    - It may take a few days for a reviewer to be assigned and to start the review. This delay is normal.
2. **Feedback:**
    - During this stage, the reviewer will provide suggestions and requests for changes.
    - Feedback can range from minor stylistic adjustments to significant structural changes.
    - Reviewers typically use GitHub's code review tools to consolidate feedback into a single notification.
3. **Discussion:**
    - Contributors can respond to feedback, seek clarification, or discuss the implications of suggested changes.
    - The goal is to collaboratively improve the code, not to "win" arguments.
    - Open, respectful communication is key to a productive discussion.
4. **Revision:**
    - Contributors revise their code based on the feedback received.
    - After making revisions, contributors should tag their reviewers to notify them of the updates.
    - Discussion and revision may overlap, with ongoing dialogue as changes are made.
5. **Repetition:**
    - The reviewer will reassess the revised code and may provide additional feedback.
    - This iterative process continues until the reviewer is satisfied with the changes.
    - Subsequent reviews often focus on minor issues but can still involve significant adjustments.
6. **Merge:**
    - Once the review process is complete and all feedback is addressed, the pull request is merged.
    - This marks the successful integration of the contribution into the project.

## 5. Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you work:

- **Test:** All features or bug fixes must be tested by one or more specs (unit-tests, integration-tests).
- **Document Changes:** Update documentation as part of the feature development process (OpenAPI, JSDoc, DBML).
- **One pull request per feature:** If you want to do more than one thing, send multiple pull requests.
- **English Preference:** Pull Request descriptions as well as branch names and commits should be preferrably in english.
- **Send coherent history:** Make sure each individual commit in your pull request is meaningful. If you had to make multiple intermediate commits while developing, please [squash them](https://www.git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Changing-Multiple-Commit-Messages) before submitting.
- **Regularly Pull from `develop`:** Keep your feature branch up-to-date with the **`develop`** branch to minimize merge conflicts.
- **Code Reviews:** Ensure that all PRs undergo thorough code reviews before merging.
- **Commit Often:** Make small, frequent commits to document the development process and simplify code reviews.
