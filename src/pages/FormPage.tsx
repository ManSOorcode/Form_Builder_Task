import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
// import { Template, Field, Section } from "../types";
import { loadTemplates } from '../utils/storageUtils';
import type { Field, Section, Template } from '../types';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import toast from 'react-hot-toast';
import { Check, Home, RefreshCcw, X } from 'lucide-react';

interface FormData {
  [key: string]: string | number | boolean;
}

const FormPage = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const templates = loadTemplates();
    const found = templates.find((t) => t.id === id);
    if (found) setTemplate(found);
  }, [id]);

  const handleChange = (fieldId: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleUpload = async (fieldId: string, file: File) => {
    try {
      const url = await uploadToCloudinary(file);
      handleChange(fieldId, url);
      toast.success('File uploaded successfully!');
    } catch (err) {
      if (err as Error) {
        toast.error('Upload failed');
      } else {
        toast.error('Not working try with diffrent file');
      }
    }
  };

  const handleSubmit = () => {
    if (!template) return;
    let valid = true;
    template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && (formData[field.id] === undefined || formData[field.id] === '')) {
          alert(`Field "${field.label}" is required.`);
          valid = false;
        }
      });
    });

    if (!valid) return;

    const formKey = `form_data_${template.id}`;
    localStorage.setItem(formKey, JSON.stringify(formData));
    setSubmitted(true);
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gray-50">
        <p className="text-2xl font-semibold text-green-600 flex items-center gap-2">✅ Form Submitted Successfully!</p>

        <button
          onClick={() => setSubmitted(false)}
          className="
          flex items-center gap-2
          px-4 py-2
          bg-blue-500 text-white
          rounded shadow-sm
          hover:bg-blue-600 hover:scale-[1.02]
          transition
          cursor-pointer
        "
        >
          <RefreshCcw className="w-5 h-5" />
          <span>Fill Again</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="
          flex items-center gap-2
          px-4 py-2
          bg-gray-500 text-white
          rounded shadow-sm
          hover:bg-gray-600 hover:scale-[1.02]
          transition
           cursor-pointer
        "
        >
          <Home className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">{template.name}</h1>
      {template.sections.map((section: Section) => (
        <div key={section.id} className="border rounded p-4 mb-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          {section.fields.map((field: Field) => (
            <div key={field.id} className="mb-3">
              {field.type === 'label' ? (
                <h3 className="font-semibold text-md">{field.label}</h3>
              ) : (
                <>
                  <label className="block mb-1 text-sm">
                    {field.label}
                    {field.required && '*'}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="border p-2 w-full rounded"
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={(formData[field.id] as number) || ''}
                      onChange={(e) => handleChange(field.id, Number(e.target.value))}
                      className="border p-2 w-full rounded"
                    />
                  )}
                  {field.type === 'boolean' && (
                    <input
                      type="checkbox"
                      checked={Boolean(formData[field.id])}
                      onChange={(e) => handleChange(field.id, e.target.checked)}
                      className="mr-2"
                    />
                  )}
                  {field.type === 'enum' && (
                    <select
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="border p-2 w-full rounded"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === 'paragraph' && (
                    <textarea
                      required={field.required}
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  )}

                  {field.type === 'upload' && (
                    <input
                      type="file"
                      required={field.required}
                      accept={
                        field.uploadType === 'image' ? 'image/*' : field.uploadType === 'file' ? '*/*' : undefined
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpload(field.id, file);
                        }
                      }}
                      // value={(formData[field.id] as string) || ""}
                      className="border p-2 rounded w-full"
                    />
                  )}
                </>
              )}

              {typeof formData[field.id] === 'string' &&
                (formData[field.id] as string).startsWith('http') &&
                (field.uploadType === 'image' ? (
                  <img
                    src={formData[field.id] as string}
                    alt="Uploaded"
                    className="mt-2 rounded shadow w-32 h-32 object-cover"
                  />
                ) : (
                  <a
                    href={formData[field.id] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 inline-block"
                  >
                    View Uploaded File
                  </a>
                ))}
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-1 text-green-400 cursor-pointer border-2 border-green-400 rounded hover:bg-green-400 hover:text-white"
        >
          <Check className="h-5 w-5" />
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-1 text-gray-500 cursor-pointer  rounded border-gray-400 border-2 hover:bg-rose-400 hover:text-white hover:border-rose-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FormPage;
