
# Bitespeed Backend Task: Identity Reconciliation

This is a Node.js backend application that exposes an `/identify` endpoint to handle contact identification and linking based on email and phone number.

## Overview

Bitespeed aims to provide a personalized customer experience by linking different orders made with various contact information to the same person. This application collects contact details from shoppers and manages them in a MongoDB database.

## Features

- **Endpoint**: `/identify` for handling HTTP POST requests.
- **Request Handling**: Accepts JSON payloads with optional fields for `email` and `phoneNumber`.
- **Response Format**: Returns consolidated contact information in a structured JSON format.
- **Contact Linking**: Links multiple contact entries based on shared email or phone number.
- **Database Interaction**: Uses MongoDB to store and manage contact records.

## Prerequisites

- Node.js installed on your machine.
- MongoDB instance running (either locally or on a cloud service).
- Postman for testing the API.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/bitespeed-backend.git

2. Navigate to the project directory:

    ```bash 
    cd bitespeed-backend

3. Install Dependancies

    ```bash
    npm install

4. Create a .env file in the root directory and add your MongoDB connection URI:

    ```bash
    MONGODB_URI=mongodb://<username>:<password>@localhost:27017/bitespeed

Replace <username> and <password> with your MongoDB credentials.


    
## Usage

1. Start the server:

    ```bash
    npm start

2. The server will start running on http://localhost:3000.

3. Use Postman to send POST requests to http://localhost:3000/identify with a JSON payload containing email and/or phoneNumber.

Example request body:

```json
{
    "email": "mcfly@hillvalley.edu",
    "phoneNumber": "123456"
}
```
The server will respond with the consolidated contact information.





## Deployment

The application is deployed on Render.com and can be accessed at: https://bitespeed-nqgo.onrender.com

Please use Postman to test the API at: https://bitespeed-nqgo.onrender.com/identify


## Response Format

When a request is made to the /identify endpoint, the response will be in the following format:

```bash
{
   "contact": {
       "primaryContactId": number,
       "emails": string[], // first element being email of primary contact 
       "phoneNumbers": string[], // first element being phoneNumber of primary contact
       "secondaryContactIds": number[] // Array of all Contact IDs that are "secondary"
   }
}
```

## Handling Different Scenarios

- If there are no existing contacts against an incoming request, the service will create a new Contact row with linkPrecedence="primary" and return it with an empty array for secondaryContactIds.

- A secondary contact is created if an incoming request has either phoneNumber or email common to an existing contact but contains new information.

## Example of Creating a Secondary Contact

Existing state of database:

```json
{
   "id": 1,
   "phoneNumber": "123456",
   "email": "lorraine@hillvalley.edu",
   "linkedId": null,
   "linkPrecedence": "primary",
   "createdAt": "2023-04-01T00:00:00.374Z",
   "updatedAt": "2023-04-01T00:00:00.374Z",
   "deletedAt": null
}
```

Identify request:


```json
{
   "email": "mcfly@hillvalley.edu",
   "phoneNumber": "123456"
}
```

New state of database:


```json
{
   "id": 1,
   "phoneNumber": "123456",
   "email": "lorraine@hillvalley.edu",
   "linkedId": null,
   "linkPrecedence": "primary",
   "createdAt": "2023-04-01T00:00:00.374Z",
   "updatedAt": "2023-04-01T00:00:00.374Z",
   "deletedAt": null
},
{
   "id": 23,
   "phoneNumber": "123456",
   "email": "mcfly@hillvalley.edu",
   "linkedId": 1,
   "linkPrecedence": "secondary",
   "createdAt": "2023-04-20T05:30:00.11Z",
   "updatedAt": "2023-04-20T05:30:00.11Z",
   "deletedAt": null
}
```
