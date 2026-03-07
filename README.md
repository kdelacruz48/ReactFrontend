# Blog Frontend

A personal blog built with React and Vite. Dark-themed, fully responsive, and connected to a custom .NET REST API for posts and authentication.

## Features

- JWT authentication with role-based access (Admin and Guest)
- Frosted-glass login screen with live app preview in the background
- Post cards with tag filtering, media badges, and modal viewer
- Embedded image and video support (YouTube, Vimeo, direct URLs)
- Animated skill bars, project cards, and a timeline on the About page
- Responsive layout down to mobile with a custom scrollbar and floating action button

## Tech Stack

- **React** + **Vite**
- **Axios** for API requests
- **Bootstrap** (utility classes only)
- Custom CSS design system using CSS variables for the full dark theme
- Deployed on **Railway**

## Connected API

This frontend connects to a separate ASP.NET Core Web API for all data and auth. See the [Blog API repo](https://github.com/kdelacruz48) for backend details.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root if you want to point to a different API:

```
VITE_API_URL=https://your-api-url.com
```

If not set, it defaults to the production Railway deployment.