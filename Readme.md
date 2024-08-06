# NEXT DRIVE
An in-built file server for modern JS Apps


## Setup
This is a light weight upload server.

1. Clone the repo.
2. Setup `config.js` with foldername, PORT, API_KEY

For better security use `.env` to store API_KEY

3. Install Packages
```
npm install
```
4. Start the server 
```
npm run start
```

## API Endpoints

### 1. `/upload/{foldername}`
To upload files to the drive.
Just send as Formdata. Rest will be handled and returns the file name to store in your db.
```ts
const formData = new FormData();
formData.append('files', file);


fetch('http://localhost:4000/upload/{foldername}', 
{
    method: 'POST',
    body : formData,
    {
        headers : {
            'X-API-KEY' : 'API_KEY_ADDED_IN_CONFIG.JS'
        }
    }
});

```


