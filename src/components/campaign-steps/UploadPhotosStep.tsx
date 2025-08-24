import React,
{
  useState,
  useCallback
}
from "react";
import {
  useDropzone
}
from "react-dropzone";
import {
  Upload,
  X,
  CheckCircle
}
from "lucide-react";
import {
  Campaign
}
from "../../types";
import {
  uploadToCloudinary
}
from "../../lib/cloudinary"; 
import toast from "react-hot-toast";

interface UploadPhotosStepProps {
  data: Partial < Campaign > ;
  onUpdate: (data: Partial < Campaign > ) => void;
  onNext: () => void;
  onBack: () => void;
}

const UploadPhotosStep: React.FC < UploadPhotosStepProps > = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState <
    Array < {
      id: string;
      file: File;
      url: string;
      uploading: boolean;
      uploaded: boolean;
    } >
    >
    ([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);

    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: "",
      uploading: true,
      uploaded: false,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    for (const fileData of newFiles) {
      try {
        const result = await uploadToCloudinary(fileData.file);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ?
            {
              ...f,
              url: result.secure_url,
              uploading: false,
              uploaded: true
            } :
            f
          )
        );
        toast.success(`${fileData.file.name} uploaded successfully!`);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(`Failed to upload ${fileData.file.name}`);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ?
            { ...f,
              uploading: false,
              uploaded: false
            } :
            f
          )
        );
      }
    }
    setIsUploading(false);
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".heic"]
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedPhotoUrls = uploadedFiles
      .filter((f) => f.uploaded)
      .map((f) => f.url);
    onUpdate({
      photos: uploadedPhotoUrls,
      photo_count: uploadedPhotoUrls.length,
    });
    onNext();
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    console.log("Sending invite to:", inviteEmail);
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  return ( <
    form onSubmit = {
      handleSubmit
    }
    className = "space-y-8 max-w-2xl mx-auto" >
    <
    div { ...getRootProps()
    }
    className = {
      `border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 bg-gray-50 hover:border-orange-400"
        }`
    } >
    <
    input { ...getInputProps()
    }
    /> <
    Upload className = "w-10 h-10 text-gray-400 mx-auto mb-4" / >
    <
    p className = "text-gray-600 mb-2 font-medium" >
    Drag and drop photos here <
    /p> <
    p className = "text-gray-500 text-sm mb-4" >
    or click to browse your computer <
    /p> <
    button type = "button"
    className = "bg-white text-gray-700 px-5 py-2 border border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors" >
    Choose Files <
    /button> <
    p className = "text-xs text-gray-400 mt-4" >
    Supported formats: JPEG, PNG, HEIC.Max 50 MB per file. <
    /p> <
    /div>

    {
      /* Uploaded Files Display (Optional, can be added if needed) */
    }

    <
    div className = "flex items-center space-x-4" >
    <
    hr className = "flex-grow border-gray-300" / >
    <
    span className = "text-gray-500 font-semibold text-sm" > Or < /span> <
    hr className = "flex-grow border-gray-300" / >
    <
    /div>

    <
    div >
    <
    label htmlFor = "invite_email"
    className = "block text-sm font-semibold text-gray-700 mb-1" >
    Invite Photographer / Organizer <
    /label> <
    div className = "flex space-x-3" >
    <
    input id = "invite_email"
    type = "email"
    value = {
      inviteEmail
    }
    onChange = {
      (e) => setInviteEmail(e.target.value)
    }
    className = "flex-grow px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
    placeholder = "Photographer@example.com" /
    >
    <
    button type = "button"
    onClick = {
      handleSendInvite
    }
    className = "px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition-colors text-sm" >
    Send Invite <
    /button> <
    /div> <
    /div>

    <
    div className = "flex justify-between items-center pt-6" >
    <
    button type = "button"
    onClick = {
      onBack
    }
    className = "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors text-sm" >
    «Back <
    /button> <
    button type = "submit"
    className = "px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors text-sm disabled:opacity-50"
    disabled = {
      isUploading
    } >
    {
      isUploading ? "Uploading..." : "Next »"
    } <
    /button> <
    /div> <
    /form>
  );
};

export default UploadPhotosStep;