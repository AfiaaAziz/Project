interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve({
          public_id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          secure_url: reader.result as string,
          width: img.width,
          height: img.height,
          bytes: file.size,
          format: file.type.split('/')[1] || 'jpg'
        });
      };
      img.onerror = () => {
        resolve({
          public_id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          secure_url: reader.result as string,
          width: 800,
          height: 600,
          bytes: file.size,
          format: file.type.split('/')[1] || 'jpg'
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const generateThumbnailUrl = (publicId: string): string => {

  return publicId;
};

export const generateWatermarkUrl = (publicId: string): string => {
  
  return publicId;
};