# damMilam

**damMilam** is a marketplace platform tailored for university communities. It enables students to buy and sell items conveniently, with a unique group bargaining feature that allows multiple buyers to collaboratively negotiate with a seller for better deals.

## Features

- University-centered marketplace
- Group bargaining system where buyers can join a negotiation group
- JWT-based user authentication
- Image uploads via Cloudinary
- Email notifications for user activities
- Integrated Khalti API for payments
- Built using the MERN stack (MongoDB, Express.js, React, Node.js)

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Others:** Cloudinary, Nodemailer, JWT, dotenv, Khalti API

## Installation & Setup

### Prerequisites

- Node.js and npm
- MongoDB instance (local or remote)
- Cloudinary account
- Email credentials (e.g., Gmail)
- Khalti API credentials

### Clone and Install

```bash
git clone https://github.com/Xen00n/damMilam.git
cd damMilam && npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PORT=6969
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
KHALTI_PUBLIC_KEY=your_khalti_public_key
KHALTI_SECRET_KEY=your_khalti_secret_key
```

## Running the Project

In the root of the project directory, run the following command:

```bash
npm run dev
```

This will start both the frontend and backend servers.

## Group Bargaining Workflow

1. A seller lists an item with a base price.
2. A buyer starts a bargaining group by making an offer.
3. Other buyers can join this group and submit better offers.
4. The seller can view active groups and choose to accept the best offer, finalizing the deal.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your suggestions or improvements.

## License

This project is licensed under the MIT License.
