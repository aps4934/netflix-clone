Netflix Clone 🎬

A full-stack clone of Netflix — showcasing a streaming UI with movie and TV show browsing, search, and trailer playback using TMDB API.

-------------------------------------------------------------------------------
🚀 Table of Contents
-------------------------------------------------------------------------------
- About
- Features
- Tech Stack
- Architecture & Folder Structure
- Getting Started
  - Prerequisites
  - Installation
  - Running Locally
- Environment Variables
- Usage
- Testing
- Deployment
- Screenshots
- Roadmap & Ideas
- Contributing
- License
- Acknowledgements

-------------------------------------------------------------------------------
📖 About
-------------------------------------------------------------------------------
This project is a Netflix-like streaming service clone. Users can browse movies and TV shows, search for content, and play trailers from a curated library using the TMDB API. The goal is to practice full-stack development: frontend UI, backend APIs, and database integration.

-------------------------------------------------------------------------------
✨ Features
-------------------------------------------------------------------------------
- Browse list of movies and TV shows from TMDB API
- Search functionality for movies and TV shows
- Play trailers in a modal
- Profile selector
- Responsive UI (desktop, tablet, mobile)
- Integration with TMDB content API
- Loading spinners and error handling

-------------------------------------------------------------------------------
🧰 Tech Stack
-------------------------------------------------------------------------------
Frontend : React 19, Tailwind CSS, Axios, React Router DOM
Backend  : FastAPI, Uvicorn, Motor (async MongoDB driver)
Database : MongoDB
APIs     : TMDB API for content, RESTful endpoints
Testing  : Pytest, Black, Isort, Flake8, MyPy
Deploy   : Vercel / Netlify (frontend), Heroku / AWS / DigitalOcean (backend)

-------------------------------------------------------------------------------
🏗 Architecture & Folder Structure
-------------------------------------------------------------------------------

```
netflix-clone/
├── .gitconfig
├── .gitignore
├── README.md
├── test_result.md
├── yarn.lock
├── backend/
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── craco.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── yarn.lock
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── components.js
│       ├── index.css
│       ├── index.js
│       └── components/
│           ├── Header.js
│           ├── Hero.js
│           ├── MovieRow.js
│           ├── VideoModal.js
│           ├── SearchResults.js
│           ├── ProfileSelector.js
│           └── LoadingSpinner.js
└── tests/
    └── __init__.py
```

Each subfolder (frontend / backend) is a separate application that communicates via HTTP APIs.

-------------------------------------------------------------------------------
🛠 Getting Started
-------------------------------------------------------------------------------
Prerequisites:
- Node.js (v18+ recommended)
- Python 3.8+
- Yarn package manager
- MongoDB (local or cloud instance)

Installation:

```
git clone https://github.com/aps4934/netflix-clone.git
cd netflix-clone

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
yarn install
```

Running Locally:

Start backend server:

```
cd backend
uvicorn server:app --reload
```

Start frontend:

```
cd frontend
yarn start
```

Then open http://localhost:3000 in your browser.

-------------------------------------------------------------------------------
🔐 Environment Variables
-------------------------------------------------------------------------------
Create an .env file in backend/ with variables such as:

MONGO_URL=mongodb://localhost:27017
DB_NAME=netflix_clone

For TMDB API, the key is hardcoded in frontend/src/App.js (not recommended for production).

-------------------------------------------------------------------------------
🎮 Usage
-------------------------------------------------------------------------------
1. Browse the homepage to see movie and TV show listings
2. Use the search bar to find specific content
3. Click on items to play trailers
4. Select a profile from the profile selector

-------------------------------------------------------------------------------
🧪 Testing
-------------------------------------------------------------------------------
cd backend
pytest

cd ../frontend
yarn test

-------------------------------------------------------------------------------
🚀 Deployment
-------------------------------------------------------------------------------
Frontend: Vercel, Netlify, or any static host
Backend : Heroku, AWS, DigitalOcean, etc.

Set the required environment variables in production, update API base URLs, 
and ensure CORS / security settings are correct.

-------------------------------------------------------------------------------
📷 Screenshots
-------------------------------------------------------------------------------
(Include some images or GIFs of your UI, e.g., homepage, profile, playback, etc.)

-------------------------------------------------------------------------------
🛤 Roadmap & Ideas
-------------------------------------------------------------------------------
- Add user authentication (register / login / logout)
- Implement favorites / watchlist
- Add pagination / infinite scroll
- Support actual streaming (HLS / DASH)
- User profiles & multiple profiles
- Ratings & reviews
- Subscription / payment model
- Admin dashboard for adding/removing content
- Recommendations / personalization

-------------------------------------------------------------------------------
🤝 Contributing
-------------------------------------------------------------------------------
1. Fork the project
2. Create a branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m "Add some feature"
4. Push to branch: git push origin feature/YourFeature
5. Open a Pull Request ⭐

-------------------------------------------------------------------------------
📄 License
-------------------------------------------------------------------------------
This project is licensed under the MIT License — see the LICENSE file for details.

-------------------------------------------------------------------------------
🙏 Acknowledgements
-------------------------------------------------------------------------------
- Netflix UI inspiration / designs
- TMDB API for movie and TV show data
- Tutorials, blogs, and open-source projects that helped you
- Libraries & tools used (React, FastAPI, Tailwind CSS, etc.)

-------------------------------------------------------------------------------
Made with ❤️ by Aditya Pratap Singh (https://github.com/aps4934)
