
```markdown
# REST Lab Microservices Application

A containerized, microservices-based application consisting of a React frontend, distinct backend services for Authentication, Payments, and Notifications, along with a MongoDB database and a RabbitMQ message broker.

##  Architecture & Services

The application is composed of 6 distinct containers communicating over a shared Docker network:

| Service Name | Container Name | Image Used | Port | Description |
|---|---|---|---|---|
| **Frontend** | `rest-fe` | `preranabl/rest-fe:0.1.0` | `3000` | User interface running at `http://localhost:3000` |
| **Auth Service** | `rest-auth` | `preranabl/rest-auth:0.1.0` | `5001` | Handles user authentication and CRUD operations. |
| **Payment Service** | `rest-payment` | `preranabl/rest-payment:0.6.0` | `5002` | Manages transactions and publishes events to RabbitMQ. |
| **Notification Service**| `notification-service` | `preranabl/rest-noti:0.1.0` | N/A | Listens for messages on RabbitMQ to process notifications. |
| **Message Broker** | `message_broker` | `rabbitmq:3-management` | `5672` / `15672` | RabbitMQ broker (includes management UI at `http://localhost:15672`). |
| **Database** | `mongo-db` | `mongo:latest` | `27017` | Central MongoDB database used by Auth and Payment services. |


### Installation & Running

1. **Clone the repository** and navigate to your project directory.
2. **Start the application** using Docker Compose:
   ```bash
   docker compose up -d
   ```
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