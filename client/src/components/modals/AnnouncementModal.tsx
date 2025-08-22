import { useState, useEffect } from "react";
import type { AnnouncementDto } from "../../models/announcements/AnnouncementDto";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (a: AnnouncementDto) => void;
  initialData?: AnnouncementDto;
  courseId: number;
}

export function AnnouncementModal({ isOpen, onClose, onSave, initialData, courseId }: Props) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { token, user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setText(initialData.text || "");
      setPreviewUrl(initialData.imageUrl ? `http://localhost:4000/${initialData.imageUrl}` : "");
      setImageFile(null);
    } else {
      setText("");
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return alert("Tekst obaveštenja ne može biti prazan!");
    if (!token || !user) return alert("Nedostaje token");

    const formData = new FormData();
    formData.append("courseId", courseId.toString());
    formData.append("authorId", user.id.toString());
    formData.append("text", text.trim());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = initialData?.id
        ? await fetch(`http://localhost:4000/api/v1/announcements/${initialData.id}`, {
            method: "PUT",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
          })
        : await fetch("http://localhost:4000/api/v1/announcements", {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
          });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("GRESKA:", errorText);
        return alert("Greška pri čuvanju obaveštenja");
      }

      const savedAnnouncement: AnnouncementDto = await res.json();
      onSave(savedAnnouncement);
      onClose();
    } catch (err) {
      console.error("Greška:", err);
      alert("Greška pri komunikaciji sa serverom");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{initialData ? "Izmeni objavu" : "Nova objava"}</h2>

        <textarea
          className="border w-full p-2 mb-4 rounded focus:ring-2 focus:ring-yellow-300"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border w-full p-2 mb-2 rounded"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mb-4 w-full h-48 object-contain border rounded"
          />
        )}

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-300" onClick={onClose}>Otkaži</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>Sačuvaj</button>
        </div>
      </div>
    </div>
  );
}
