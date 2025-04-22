
import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Images, FileImage } from "lucide-react";

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
}

const PhotoUploader = ({ photos, onPhotosChange }: PhotoUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  // Ajout de nouvelles images dans Firebase Storage
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const storage = getStorage();
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storage, `produit_photos/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      uploadedUrls.push(url);
    }
    setUploading(false);
    onPhotosChange([...photos, ...uploadedUrls]);
  };

  // Supprimer une photo
  const handleRemovePhoto = (url: string) => {
    onPhotosChange(photos.filter(photoUrl => photoUrl !== url));
    // Option: supprimer du storage ici (à rajouter si besoin, gestion avancée)
  };

  return (
    <div>
      <label className="font-semibold block mb-2">Photos</label>
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <div className="flex flex-wrap gap-2 my-3">
        {photos.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 border border-gray-200 rounded bg-gray-50 flex items-center justify-center">
            <img src={url} alt={`Photo du produit ${idx + 1}`} className="object-cover w-full h-full rounded" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-0 right-0"
              onClick={() => handleRemovePhoto(url)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      {uploading && <span className="text-blue-500">Chargement...</span>}
    </div>
  );
};

export default PhotoUploader;
