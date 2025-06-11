import axios from "axios";
export const CLOUDINARY_CLOUD_NAME = 'dd4fykqvw';
export const CLOUDINARY_UPLOAD_PRESET = 'beautyspa_upload';

export const uploadImageToCloudinary = async (imageUri: string) => {
  const formData = new FormData();
  
  if (imageUri.startsWith('blob:') || imageUri.startsWith('data:')) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    formData.append('file', blob, 'upload.jpg');
  } else {
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
  }

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.secure_url) {
      return response.data.secure_url;
    }
    throw new Error(response.data.error?.message || 'Unknown upload error');
  } catch (error) {
    console.error('❌ Upload image failed:', error);
    throw error;
  }
};