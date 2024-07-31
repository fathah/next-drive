## NEXT Drive
An in-built file server for modern JS Apps


## Setup
This is a light weight server to start with default `node_modules` folder of your existing project.

1. Clone the repo to your existing project.
2. Rename the folder as required Eg: drive
3. Install Packages
```
npm i express formidable cors
```
4. Run the server with command 
```
node drive/server.js
```

## API Endpoints

### 1. `/upload`
To upload files to the drive.
Just send as Formdata. Rest will be handled and returns the file name to store in your db.
```ts
const formData = new FormData();
formData.append('folder','thumbs');
formData.append('file', file);

fetch('http://localhost:4000/upload', 
{
    method: 'POST',
    body : formData
});

```


