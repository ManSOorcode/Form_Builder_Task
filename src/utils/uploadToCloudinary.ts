export const uploadToCloudinary = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "form_builder"); // replace with your preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dt30lmgpb/image/upload", // or video/upload if handling video
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const json = await res.json();
  return json.secure_url as string;
};
