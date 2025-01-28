# NestJS API Documentation

This document provides a quick overview of the endpoints and functionality implemented in this NestJS application. It includes routes for user authentication and blog post management.

## Authentication Routes

Base URL: `http://localhost:5000/api/v1/auth`

1. **Get all users**  
   **GET** `/`

   - Retrieves a list of all users.

2. **Login user**  
   **POST** `/login`

   - Authenticates a user with valid credentials.

3. **Register user**  
   **POST** `/register`

   - Creates a new user.

4. **Delete user**  
   **DELETE** `/delete`

   - Deletes a specific user.

5. **Check user auth status**  
   **GET** `/status`
   - Verifies the current authentication status of a user.

---

## Blog Routes

Base URL: `http://localhost:5000/api/v1/blog`

1. **Get all posts**  
   **GET** `/`

   - Retrieves all blog posts. Supports pagination using query parameters:  
     Example: `/posts?page=2&limit=5`

2. **Get posts by user ID**  
   **GET** `/user`

   - Retrieves all posts created by a specific user.

3. **Get post by ID**  
   **GET** `/:id`

   - Retrieves details of a specific post using its ID.

4. **Create post**  
   **POST** `/`

   - Creates a new blog post.

5. **Delete post**  
   **DELETE** `/:id`

   - Deletes a specific post by its ID.

6. **Update post**  
   **PATCH** `/:id`
   - Updates a specific post by its ID.

---

This documentation provides all the required endpoints and their purposes. Use it as a reference while working on or integrating with this NestJS application.
