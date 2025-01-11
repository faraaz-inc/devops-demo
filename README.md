# KoinX hiring assignment

## Folder Structure

<pre>
src      # Source Code
 ├── api/       # API Server
      ├── routes.ts        # API Routes
      └── types.ts
 ├── store/     # Database handlers
      ├── db.ts         # MongoDB connection setup
      ├── ops.ts        # DB Operations
      └── types.ts
 ├── app.ts         # Express app config
 └── index.ts       # Entry point of server
</pre>

## Deployment
### Deployed on Microsoft Azure VM

- Base URL

    [KoinX Assignment](http://koinx.frztech.me/)

    - "/stats" endpoint
        <pre>"/api/v1/stats"</pre>
    - "/deviation" endpoint
        <pre>"/api/v1/deviation"</pre>
    
