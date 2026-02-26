# REST Lab Microservices Application

A containerized, microservices-based application consisting of a React frontend, distinct backend services for Authentication, Payments, and Notifications, along with a MongoDB database and a RabbitMQ message broker.

3. **Access the application**:
   * Frontend Application: [http://localhost:3000](http://localhost:3000)
   * RabbitMQ Management UI: [http://localhost:15672](http://localhost:15672) (Default login: `guest` / `guest`)
   * Auth Service API: `http://localhost:5001`
   * Payment Service API: `http://localhost:5002`
   * Admin Dashboard: [http://localhost:3000/dashboard.html](http://localhost:3000)
---
### Here is the exact step-by-step test to do this:

**1. Stop the Notification Service:**
Run this command in your terminal:
```bash
docker stop notification-service
```

**2. Generate some Messages (Produce):**
Go to Thunder Client and send a few `POST` requests to your Payment Service (`http://localhost:5002/api/payments`). Send it 3 or 4 times. 
* *Your API will still respond with success because the payment service and RabbitMQ are still running.*

**3. Watch the Queue Pile Up:**
Open the RabbitMQ Management UI in your browser: [http://localhost:15672](http://localhost:15672)
* Go to the **Queues** tab.
* Look at your queue. You will now see **3 or 4 messages sitting in the "Ready" column**. They aren't resolving because the consumer is turned off!

**4. Start the Service and Watch it Drain (Consume):**
Now, turn the notification service back on to see RabbitMQ do its job:
```bash
docker start notification-service
```
If you look at the RabbitMQ UI again (or check the logs with `docker logs notification-service`), you will see it instantly process all the backlogged messages, and the queue will drop back down to **0**. 

This is the exact magic of message brokers—they ensure you never lose data even if a background service crashes or goes offline for maintenance!

##  API Testing with Thunder Client (VS Code)

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


##  Useful Docker Commands

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