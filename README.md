
```markdown
# REST Lab Microservices Application

A containerized, microservices-based application consisting of a React frontend, distinct backend services for Authentication, Payments, and Notifications, along with a MongoDB database and a RabbitMQ message broker.

3. **Access the application**:
   * Frontend Application: [http://localhost:3000](http://localhost:3000)
   * RabbitMQ Management UI: [http://localhost:15672](http://localhost:15672) (Default login: `guest` / `guest`)
   * Auth Service API: `http://localhost:5001`
   * Payment Service API: `http://localhost:5002`
   * Admin Dashboard: [http://localhost:3000/dashboard.html](http://localhost:3000)
---

## ⚡ API Testing with Thunder Client (VS Code)

You can easily test the REST APIs using Thunder Client in VS Code. Below are examples of **POST**, **GET**, **PUT**, and **DELETE** requests for the Auth Service. 

### Manual Request Examples

**1. POST (Login / Create User)**
* **Method:** `POST`
* **URL:** `http://localhost:5001/auth/login`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "mypassword123"
  }
  ```
  *(Note: Copy the `_id` from the response, you will need it for the GET, PUT, and DELETE requests below!)*

**2. GET (Retrieve All Users)**
* **Method:** `GET`
* **URL:** `http://localhost:5001/auth/users`

**3. GET (Retrieve a Single User)**
* **Method:** `GET`
* **URL:** `http://localhost:5001/auth/users/USER_ID_HERE`

**4. PUT (Update User Details)**
* **Method:** `PUT`
* **URL:** `http://localhost:5001/auth/users/USER_ID_HERE`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
  ```json
  {
    "name": "John Smith",
    "email": "john.smith.updated@example.com"
  }
  ```

**5. DELETE (Remove a User)**
* **Method:** `DELETE`
* **URL:** `http://localhost:5001/auth/users/USER_ID_HERE`


##  System Flow Highlights

* **Service Resiliency:** Services are configured to automatically retry connections to RabbitMQ and MongoDB on startup.
* **Asynchronous Messaging:** The application relies on event-driven architecture. The Payment service utilizes RabbitMQ to pass data to the Notification service asynchronously.
* **Database Management:** Services share a single MongoDB instance (`mongo-db`) but maintain their own independent Mongoose connection pools and logical databases (`auth_db` and `payment_db`).

## 🛑 Useful Docker Commands

**Stop the application gracefully:**
```bash
docker compose down
```

**Stop the application and wipe the database (useful for fresh starts):**
```bash
docker compose down -v 
```

**View logs for a specific service:**
```bash
docker logs rest-auth
# or
docker logs rest-payment
```
```