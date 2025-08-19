import { useState, useEffect } from "react";
import type { MaterialDto } from "../../models/materials/MaterialDto";
import { useAuth } from "../../hooks/auth/useAuthHook";
//import { materialsApi } from "../../api_services/materials/MaterialsAPIService";
import axios from "axios";

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

    // Upload fajla preko axios-a
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(
        "http://localhost:4000/api/v1/materials/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload fajla response:", uploadRes.data);
      fileData = uploadRes.data;
    }

    // Kreiranje materijala
    const savedMaterial = await axios.post(
      "http://localhost:4000/api/v1/materials",
      {
        courseId,
        authorId: user.id, // ID ulogovanog korisnika
        title,
        description,
        filePath: fileData.path,
        fileMime: fileData.mimeType,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Kreirani materijal:", savedMaterial.data);
    onSave(savedMaterial.data);
    onClose();
  } catch (err: any) {
    console.error("Greška pri upload-u ili kreiranju materijala:", err.response?.data || err.message);
    alert("Greška pri upload-u ili čuvanju materijala");
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{initialData ? "Izmeni materijal" : "Novi materijal"}</h2>

        <input
          type="text"
          placeholder="Naziv"
          className="border w-full p-2 mb-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Opis (opciono)"
          className="border w-full p-2 mb-2 rounded"
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
