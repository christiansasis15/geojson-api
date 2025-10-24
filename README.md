# How to Run the Application

Follow the steps below to set up and run the application:

---

### 1. Create Credentials
Create an account and credentials on [Sentinel Hub](https://login.planet.com/u/login/identifier?state=hKFo2SBxa3Yzb0tpTEFZSkxyZkVmWUlJblIyQzVwdGpTUnpZOKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDBJLXROdzZQQVcyS2ZTSFlNd3FDbTJSSmpsS2ZXeU96o2NpZNkgbDJ4OGp6OWJDbDI1RW9ndkhxNWEwNHltQVowNFVDVjg).

---

### 2. Create an OAuth Client
1. In your Sentinel Hub dashboard, go to **User Settings**.  
2. Find the **OAuth Clients** section on the right side.  
3. Copy your **Client ID** and **Client Secret**.

---

### 3. Create a `.env` File
In the root directory of your project, create a file named `.env` and paste the following lines:

```env
CLIENT_ID=<Your Client ID>
CLIENT_SECRET=<Your Client Secret>
```
---

### 4. Install Dependencies
Open your terminal and run:
```npm install```

--- 

### 5. Run the application
Finally, start the application with:
```npm run dev```
