import { useState, useEffect } from "react";
import type { MaterialDto } from "../../models/materials/MaterialDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (m: MaterialDto) => void;
  courseId: number;
  initialData?: MaterialDto;
}

export function MaterialModal({ isOpen, onClose, onSave, courseId, initialData }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [filePath, setFilePath] = useState("");
  const [fileMime, setFileMime] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setFilePath(initialData.filePath);
      setFileMime(initialData.fileMime);
    } else {
      setTitle("");
      setDescription("");
      setFilePath("");
      setFileMime("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      id: initialData?.id || 0,
      courseId,
      authorId: initialData?.authorId || 0,
      title,
      description,
      filePath,
      fileMime,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    });
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
          type="text"
          placeholder="Putanja do fajla"
          className="border w-full p-2 mb-2 rounded"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <input
          type="text"
          placeholder="MIME tip fajla"
          className="border w-full p-2 mb-4 rounded"
          value={fileMime}
          onChange={(e) => setFileMime(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-300" onClick={onClose}>Otkaži</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={handleSubmit}>Sačuvaj</button>
        </div>
      </div>
    </div>
  );
}
