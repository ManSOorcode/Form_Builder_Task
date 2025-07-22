import { useDraggable } from "@dnd-kit/core";
import {
  Text,
  List,
  Hash,
  CheckSquare,
  ChevronDown,
  Upload,
} from "lucide-react";

interface FieldObjType {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const FIELD_TYPES = [
  { id: "text", label: "Short Answer", icon: Text },
  { id: "paragraph", label: "Paragraph", icon: List },
  { id: "number", label: "Number", icon: Hash },
  { id: "boolean", label: "Yes/No", icon: CheckSquare },
  { id: "enum", label: "Dropdown", icon: ChevronDown },
  { id: "upload", label: "Upload", icon: Upload },
];

const DraggablePaletteItem = ({ field }: { field: FieldObjType }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.id,
    data: { type: "palette", fieldType: field.id, label: field.label },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 mb-2 border rounded bg-white shadow hover:bg-gray-100 cursor-pointer text-sm flex items-center space-x-2 select-none ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <field.icon className="text-gray-500 w-4 h-4" />
      <span>{field.label}</span>
    </div>
  );
};

const FieldPalette = () => {
  return (
    <div className="w-64 p-4 border-l bg-gray-50 h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Field Palette</h2>
      {FIELD_TYPES.map((field) => (
        <DraggablePaletteItem key={field.id} field={field} />
      ))}
    </div>
  );
};

export default FieldPalette;
