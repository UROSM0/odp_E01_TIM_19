import type { MaterialDto } from "../../../models/materials/MaterialDto";
import { MaterialModal } from "../../modals/MaterialModal";



interface Props {
  materials: MaterialDto[];
  user: any;
  courseId: number;
  onSave: (m: MaterialDto) => void;
  onDelete: (id: number) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export function MaterialsSection({
  materials,
  user,
  courseId,
  onSave,
  onDelete,
  modalOpen,
  setModalOpen
}: Props) {

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden"; 
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = ""; 
  };

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Materijali</h2>
        {user?.uloga === "professor" && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={openModal}
          >
            + Dodaj materijal
          </button>
        )}
      </div>

      {materials.length === 0 ? <p>Nema materijala za ovaj kurs.</p> : (
        <ul className="space-y-4">
          {materials.map(m => (
            <li key={m.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{m.title}</p>
                {m.description && <p>{m.description}</p>}
                <a
                  href={`http://localhost:4000/${m.filePath}`}
                  download
                  className="text-blue-600 underline"
                >
                  Preuzmi fajl
                </a>
              </div>
              {user?.uloga === "professor" && (
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => onDelete(m.id)}
                >
                  Obriši
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <MaterialModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={onSave}
        courseId={courseId}
      />
    </section>
  );
}
