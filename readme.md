# MyStore - E-commerce Website

## How to Run the Project

### 1️. Clone the Repository

```bash
git clone link
cd ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=19f60134d44a06bbf3c12307122f7306fc3168fc9c93e7c86eb12dd0281f8218f08f395a33aaf15a48f1c257e93deb59eecafd8511469050528d4381aa920eca
PORT=3000
```

### 4. Seed the Database with Demo Data

```bash
npm run seed
```

### 5. Start the Server

```bash
npm run dev
```

The app will run at **[http://localhost:3000](http://localhost:3000)**

### 6. Login Credentials

| Role  | Email                                     | Password |
| ----- | ----------------------------------------- | -------- |
| Admin | [admin@gmail.com](mailto:admin@gmail.com) | admin    |
| User  | [user@gmail.com](mailto:user@gmail.com)   | user     |

