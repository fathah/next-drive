"use server";

export async function uploadFile(folder:string,formData: FormData) {

    const URL = `http://localhost:4000/upload/${folder}`;

   try {
    const resp = await fetch(URL, {
        method: "POST",
        body: formData
    });
    const data = await resp.json();
    return data;
   } catch (error) {
    console.error(error);
    return {success:false, message:"Failed to upload"}
    
   }
}