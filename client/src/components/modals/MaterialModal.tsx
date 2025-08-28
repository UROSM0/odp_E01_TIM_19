import { useState, useEffect } from "react";
import type { MaterialDto } from "../../models/materials/MaterialDto";
import { useAuth } from "../../hooks/auth/useAuthHook";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (m: MaterialDto) => void;
  courseId: number;
  initialData?: MaterialDto;
}

export function MaterialModal({ isOpen, onClose, onSave, courseId, initialData }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewFileName, setPreviewFileName] = useState(initialData?.filePath || "");
  const { token, user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setPreviewFileName(initialData.filePath);
      setFile(null);
    } else {
      setTitle("");
      setDescription("");
      setFile(null);
      setPreviewFileName("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewFileName(f?.name || "");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Naziv materijala je obavezan!");
    if (!token || !user) return alert("Nedostaje token ili korisnik nije ulogovan");
    if (!file && !initialData) return alert("Morate izabrati fajl!");

    try {
      let fileData = { path: previewFileName, mimeType: "" };

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(
          `${API_URL}materials/upload`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        fileData = uploadRes.data;
      }

      const savedMaterial = await axios.post(
        `${API_URL}materials`,
        {
          courseId,
          authorId: user.id,
          title,
          description,
          filePath: fileData.path,
          fileMime: fileData.mimeType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSave(savedMaterial.data);
      onClose();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Greška pri upload-u ili čuvanju materijala");
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{initialData ? "Izmeni materijal" : "Novi materijal"}</h2>

        <input
          type="text"
          placeholder="Naziv"
          className="border w-full p-2 mb-2 rounded focus:ring-2 focus:ring-yellow-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Opis (opciono)"
          className="border w-full p-2 mb-2 rounded focus:ring-2 focus:ring-yellow-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="border w-full p-2 mb-2 rounded"
        />

        {previewFileName && <p className="mb-2">Izabrani fajl: {previewFileName}</p>}

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-300" onClick={onClose}>Otkaži</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={handleSubmit}>Sačuvaj</button>
        </div>
      </div>
    </div>
  );
}
