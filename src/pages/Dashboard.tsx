import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

import { saveTemplates, loadTemplates } from '../utils/storageUtils';
import { v4 as uuid } from 'uuid';
import type { Template } from '../types';
import { FileText, Trash, WandSparkles } from 'lucide-react';

const Dashboard = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);
  }, []);

  const handleAddTemplate = () => {
    if (templates.length >= 5) {
      alert('You can only create up to 5 templates.');
      return;
    }
    const newTemplate: Template = {
      id: uuid(),
      name: `Template ${templates.length + 1}`,
      sections: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveTemplates(updated);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveTemplates(updated);
  };

  const handleOpenTemplate = (id: string) => {
    navigate(`/builder/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
        <FileText className="w-6 h-6 text-blue-500" />
        <span className="text-gray-900">Form Template Builder</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleOpenTemplate(template.id)}
            className="border border-gray-200 rounded p-4 bg-white cursor-pointer relative group transition-transform transform hover:scale-[1.02] hover:text-gray-700 hover:shadow-md hover:border-violet-300 hover:bg-violet-50 "
          >
            <h2 className="font-semibold text-lg text-gray-500">{template.name}</h2>
            <p className="text-sm text-gray-500">{new Date(template.createdAt).toLocaleDateString()}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTemplate(template.id);
              }}
              className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          "
            >
              <Trash className="w-4 h-4 text-rose-400 cursor-pointer" />
            </button>
          </div>
        ))}

        {templates.length < 5 && (
          <button
            onClick={handleAddTemplate}
            className="border-dashed border-2 border-gray-400 hover:text-violet-600 hover:border-violet-300 cursor-pointer rounded p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition
        "
          >
            <WandSparkles className="w-7 h-7 " />
            <span className="mt-2">Add New Template</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
