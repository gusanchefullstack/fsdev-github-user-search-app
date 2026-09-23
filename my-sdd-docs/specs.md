# Specifications

## Expected Behavior

- On first load, show the profile information for Octocat.
- Display an error message (as shown in the design) if no user is found when a new search is made.
- If a GitHub user hasn't added their name, show their username where the name would be without the `@` symbol and again below with the `@` symbol.
- If a GitHub user's bio is empty, show the text "This profile has no bio" with transparency added (as shown in the design). The lorem ipsum text in the designs shows how the bio should look when it is present.
- If any of the location, website, twitter, or company properties are empty, show the text "Not Available" with transparency added (as shown in the design).
- Website, twitter, and company information should all be links to those resaources. For the company link, it should remove the `@` symbol and link to the company page on GitHub. For Octocat, with `@github` being returned for the company, this would lead to a URL of `https://github.com/github`.

## Design

The design can be found at Figma Desktop at:

- System Design:
  https://www.figma.com/design/svNW2c62E4bYae1DYYCNF6/github-user-search-app?node-id=1-69
- Designs for Desktop, Tablet and Mobile:
  https://www.figma.com/design/svNW2c62E4bYae1DYYCNF6/github-user-search-app?node-id=1-704

You will find all the required assets in the `/assets` folder. The assets are already optimized.

## Domain Rules and Business Logic

Your challenge is to build out this GitHub user search app using the [GitHub users API](https://docs.github.com/en/rest/reference/users#get-a-user) and get it looking as close to the design as possible.

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Your users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Search for GitHub users by their username
- See relevant user information based on their search
- Switch between light and dark themes
- **Bonus**: Have the correct color scheme chosen for them based on their computer preferences. _Hint_: Research `prefers-color-scheme` in CSS.

### Data Source: GitHub API

Use the [GitHub users API](https://docs.github.com/en/rest/reference/users#get-a-user)

## Front-end Architecture and Style Guide

### Front-end Architecture

- Use vite as deploying server for frontend
- The source code should be in src/ folder under the project root. CSS styles and Typescript files should inside corresponding subfolders. Use logical reactjs components created in a /components folder
- Use vitest for testing use cases
- Use best practices for frontend development naming convention, semantic html among others.
- Use semantic HTML (header, nav, main, aside, footer, article, section) consistently. It clarifies structure for users and assistive tech and reduces the need for extra ARIA.
- One main per page is a simple, high-impact rule to remember. Wrap the primary page content in a single <main> element (and remove any other main roles/elements). If there are multiple sections that look “main-like,” choose one principal area and mark others with appropriate semantics (section, aside, nav).
- Only one h1 element should exist in html
- Avoid to use Multiple links with identical text, which makes it hard to determine each link's purpose when list of links is read out of surrounding context by assistive technology. This causes screen reader users and anyone scanning links quickly to be unsure which plan each action applies to, increasing cognitive load and risking mistaken clicks. Consider using best practices of WCAG.

### Front-end Style Guide

1. Layout

Use the index.html file where to contain app. Keep this file at the project root, which is
where Vite expects the entry HTML. It references the application entry point in `/src`, so
all application source still lives under `src/` as described above.

## Testing

- Use vitest as testing framework
- Test implementation with browser screen at 375px (mobile), 768px (tablet) and 1440px (desktop) screens.
- Test key and edge cases that can apply
- Use test to validate functionality/features after important changes.

## Documentation

- Add comments in plain style for key elements of code.
- Create a README.md following README-template.md but also considering skill /create-readme once the project is finished
- Update the Author section in README with the following contact info. Add badges to each related link address. Arrange them in inline row.
  https://www.linkedin.com/in/gustavosanchezgalarza/
  https://github.com/gusanchefullstack
  https://hashnode.com/@gusanchedev
  https://x.com/gusanchedev
  https://bsky.app/profile/gusanchedev.bsky.social
  https://www.freecodecamp.org/gusanchedev
  https://www.frontendmentor.io/profile/gusanchefullstack

- Once finished implementation, take screenshots for 375px strictly and 1440px strictly viewport (responsive view) and add them first to the /screenshots folder in root and them insert from here to the readme in the screenshots section.
- Screenshots to include in README.md for 375px should be 40% width of 1440px shots.

## Deployment

- Once I confirm the project is done and the github repos were created, deploy the frontend project to vercel under my account (gustavosanchezgalarza@gmail.com). If the project has backend component, use www.render.com to deploy the backend.

## Post Implementation Tasks

Execute the following tasks:

1. Submit project to frontendmentor.io. Use @frontendmentor-submitter to submit the project. Follow the ["Complete guide to submitting solutions"](https://www.frontendmentor.io/guides/how-to-submit-solutions) for tips on how to do this.

The url of the project is:
https://www.frontendmentor.io/challenges/github-user-search-app-Q09YOgaH6?tab=submit

2. Get Solution URL (in frontendmentor.io) and live site URL (in vercel) and once you have them update the git hub repo README.md. Also be sure to update the live site url in the repo page.

3. Update my landing page. Ask for confirmation first. If yes, Use @landing-page-portfolio-updater to update my portafolio with this project.

4. Fixing issues of FrontendMentor.io.
   Use @frontend-mentor-issue-fixer to fix issues detected by frontendmentor.io for improving score of app submitted.
