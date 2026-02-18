# MongoDB Atlas Setup Guide

This guide will help you set up a free MongoDB Atlas cluster and connect it to your **SystemDesignLab** backend.

## 1. Create an Account
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Sign up for a free account (or log in).

## 2. Create a Cluster
1.  Click **+ Create** or **Build a Database**.
2.  Select **M0 Free** (Shared) tier.
3.  Choose a provider (AWS, Google Cloud, or Azure) and region close to you.
4.  Click **Create Cluster**.
5.  Wait a few minutes for the cluster to provision.

## 3. Configure Security (Network & Database Access)

### Database Access (Create a User)
1.  Go to **Database Access** in the left sidebar.
2.  Click **+ Add New Database User**.
3.  **Authentication Method**: Password.
4.  **Username**: `admin` (or your choice).
5.  **Password**: Generate a secure password and **SAVE IT**. You will need this for the connection string.
6.  **Database User Privileges**: "Read and write to any database".
7.  Click **Add User**.

### Network Access (IP Whitelist)
1.  Go to **Network Access** in the left sidebar.
2.  Click **+ Add IP Address**.
3.  Select **Allow Access from Anywhere** (0.0.0.0/0) for easiest testing, OR **Add Current IP Address** for better security (you will need to update this if your IP changes).
4.  Click **Confirm**.

## 4. Get Connection String
1.  Go back to **Database** (Clusters).
2.  Click **Connect** on your cluster.
3.  Select **Drivers**.
4.  You will see a connection string like:
    ```
    mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    ```
5.  Copy this string.

## 5. Configure Your Backend
1.  Open your `.env` file in `system-design-lab-backend/`.
2.  Update the `MONGODB_URI` variable:

    ```env
    MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD_HERE@cluster0.abcde.mongodb.net/systemdesignlab?retryWrites=true&w=majority
    ```
    *Replace `YOUR_PASSWORD_HERE` with the password you created in Step 3.*
    *Replace `systemdesignlab` (after the `/`) with your desired database name.*

3.  Restart your backend server:
    ```bash
    npm run dev
    ```

## 6. Verify Connection
Check your terminal console. You should see:
```
Connected to MongoDB
```
If you see an error, double-check your:
-   Password (did you paste it correctly?)
-   Network Access (is your IP allowed?)
