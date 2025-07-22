import { useState, useEffect } from 'react';
import type { Field } from '../types';
import { Plus, Save, X, XCircle } from 'lucide-react';
// import { Field } from "../types";

interface FieldEditModalProps {
  field: Field | null;
  onClose: () => void;
  onSave: (updatedField: Field) => void;
}

const FieldEditModal = ({ field, onClose, onSave }: FieldEditModalProps) => {
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (field) {
      setLabel(field.label);
      setRequired(field.required ?? false);
      setOptions(field.options ?? []);
    }
  }, [field]);

  const handleSave = () => {
    if (!field) return;
    const updatedField: Field = {
      ...field,
      label,
      required,
      options: field.type === 'enum' ? options : undefined,
    };
    onSave(updatedField);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  if (!field) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Save className="w-5 h-5 text-blue-500" />
          Edit Field
        </h2>

        {/* Label */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 p-2 w-full rounded mb-3 outline-none transition"
        />

        {/* Required checkbox */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="mr-2 accent-blue-500"
          />
          <label className="text-gray-700">Required</label>
        </div>

        {/* Enum options */}
        {field.type === 'enum' && (
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium text-gray-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 p-1 flex-1 rounded mr-2 outline-none transition"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="text-rose-500 hover:text-rose-600 transition cursor-pointer"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="flex items-center text-blue-500 hover:text-blue-600 text-sm mt-1 transition cursor-pointer"
              type="button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Option
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-5 space-x-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:scale-[1.02] cursor-pointer transition "
            type="button"
          >
            <XCircle className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className="
          flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-[1.02] transition cursor-pointer
        "
            type="button"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditModal;
