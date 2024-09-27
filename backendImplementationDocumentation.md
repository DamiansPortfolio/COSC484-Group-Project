
## **Project Overview**

The project integrates a React frontend with a Node.js/Express.js backend, which serves artist data via an API. The backend provides filtering and sorting functionality, which is utilized by the frontend to display artist recommendations. This documentation explains how the backend is set up and its interaction with the frontend.

---

### **Backend Structure**

The backend folder structure is as follows:

```
backend/
├── server.js                # Entry point for the Express server
├── artistData.js            # Mock artist data file
├── controllers/
│   └── artistController.js   # Controller for handling artist-related API logic
└── routes/
    └── artistRoutes.js       # API routes for artist-related endpoints
```

---

### **Key Backend Files**

#### 1. **`server.js`**: Main Server File

- This is the entry point for the backend, responsible for initializing the Express server, enabling CORS, and routing API requests.
  
- **CORS Configuration**:  
  To allow requests from the frontend (running on `http://localhost:5173`), CORS is enabled in the following way:

  ```javascript
  app.use(cors({
      origin: 'http://localhost:5173'
  }));
  ```

- **Routes**:  
  Artist-related API routes are registered using:

  ```javascript
  app.use('/api/artists', artistRoutes);
  ```

#### 2. **`artistRoutes.js`**: Artist Routes

- This file defines the routes for handling artist-related requests. It currently supports a `GET` request to `/api/artists`.

- The route is mapped to the controller function `getArtists`:

  ```javascript
  router.get('/', getArtists);
  ```

#### 3. **`artistController.js`**: Artist Controller

- The `getArtists` function in the controller handles fetching and filtering of artist data. It processes query parameters for filtering by skill and sorting by name or rating.

  - **Filtering by Skill**:
    ```javascript
    if (skill) {
        filteredArtists = filteredArtists.filter(artist => artist.skills.includes(skill));
    }
    ```

  - **Sorting by Name or Rating**:
    ```javascript
    if (sort === 'name') {
        filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'rating') {
        filteredArtists.sort((a, b) => b.rating - a.rating);
    }
    ```

#### 4. **`artistData.js`**: Mock Artist Data

- This file contains an array of mock artist data used by the backend. Each artist object includes attributes such as `id`, `name`, `skills`, `rating`, and `portfolioItems`.

---

### **Frontend Interaction**

- The React frontend, specifically the `Recommendations.jsx` component, interacts with the backend by sending a `GET` request to the `/api/artists` endpoint. It passes query parameters to filter artists by skills or to sort them.

- **API Request in `Recommendations.jsx`**:

  ```javascript
  let url = `http://localhost:5001/api/artists?`;
  if (selectedSkill) url += `skill=${selectedSkill}&`;
  if (sortOption) url += `sort=${sortOption}`;

  const response = await fetch(url);
  const data = await response.json();
  ```

---

### **How to Extend the Backend**

1. **Add More Filters**:
   - To add new filtering options, modify the `getArtists` function in `artistController.js`. For example, if you want to filter artists by location:
     
     ```javascript
     if (location) {
         filteredArtists = filteredArtists.filter(artist => artist.location === location);
     }
     ```

2. **Add More API Endpoints**:
   - To add new endpoints, create new route files in the `routes/` folder and corresponding controller functions in the `controllers/` folder.
   - For example, to add a new endpoint for fetching a single artist by ID:
     
     In `artistRoutes.js`:
     ```javascript
     router.get('/:id', getArtistById);
     ```

     In `artistController.js`:
     ```javascript
     export const getArtistById = (req, res) => {
         const artist = artistData.find(artist => artist.id === req.params.id);
         if (artist) {
             res.json(artist);
         } else {
             res.status(404).json({ message: 'Artist not found' });
         }
     };
     ```

---

### **Running the Backend**

1. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:

   ```bash
   npm start
   ```

The backend server will run on `http://localhost:5001` and can be accessed via API calls from the React frontend.

---

### Running the project (both frontend and backend)

- **Frontend**:  
  In the root directory, run:  
  ```bash
  npm run dev --prefix ./frontend
  ```
  Or navigate to the frontend folder and run:
  ```bash
  npm run dev
  ```

- **Backend**:  
  In the root directory, run:  
  ```bash
  npm run dev --prefix ./backend
  ```
  Or navigate to the backend folder and run:
  ```bash
  npm run dev
  ``` 

This allows you to start both parts of the project separately from the root directory or their respective folders.

### **Conclusion**

This setup allows seamless interaction between the React frontend and the Express.js backend. The backend provides flexible filtering and sorting functionality that can be extended further as needed. The architecture is modular, making it easy to add new features and endpoints. The sorting and filtering is just an example usecase of how the backend can be used but most likely this component will change. 
