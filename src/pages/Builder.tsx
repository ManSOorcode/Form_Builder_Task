import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

import { saveTemplates, loadTemplates } from '../utils/storageUtils';
import { v4 as uuid } from 'uuid';
import type { Field, FieldType, FieldTypeObject, Section, Template } from '../types';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import FieldEditModal from '../components/AddFileds';
import toast from 'react-hot-toast';
import FieldPalette from '../components/FieldPalette';
import HeaderBar from '../components/HeaderBar';
import { Edit, Eye, Plus, X } from 'lucide-react';

interface DroppableProps {
  id: string;

  children: React.ReactNode;
}

function Droppable({ id, children }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style = isOver ? 'bg-blue-50' : '';

  return (
    <div ref={setNodeRef} className={style}>
      {children}
    </div>
  );
}

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [activeFieldType, setActiveFieldType] = useState<FieldTypeObject | null>(null);

  const [editingField, setEditingField] = useState<Field | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const templates = loadTemplates();
    const found = templates.find((t) => t.id === id);
    if (found) {
      setTemplate(found);
    }
  }, [id]);

  const updateTemplate = (updatedTemplate: Template) => {
    const templates = loadTemplates();
    const updatedTemplates = templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t));
    saveTemplates(updatedTemplates);
    setTemplate(updatedTemplate);
  };

  const handleAddSection = () => {
    if (!template) return;
    const newSection: Section = {
      id: uuid(),
      title: `Section ${template.sections.length + 1}`,
      fields: [],
    };
    const updatedTemplate: Template = {
      ...template,
      sections: [...template.sections, newSection],
    };
    updateTemplate(updatedTemplate);

    if (template.sections.length >= 10) {
      toast.error('You can only have up to 10 sections.');
      return;
    }
  };

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    if (!template) return;
    const updatedSections = template.sections.map((section) =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    );
    const updatedTemplate: Template = {
      ...template,
      sections: updatedSections,
    };
    updateTemplate(updatedTemplate);
  };

  const handleFieldDrop = (sectionId: string, fieldType: FieldType) => {
    if (!template) return;
    const newField: Field = {
      id: uuid(),
      label: `${fieldType?.toUpperCase()} Field`,
      type: fieldType,
      required: false,
      options: fieldType === 'enum' ? ['Option 1', 'Option 2'] : undefined,
    };

    const updatedSections = template.sections.map((section) =>
      section.id === sectionId ? { ...section, fields: [...section.fields, newField] } : section
    );
    updateTemplate({
      ...template,
      sections: updatedSections,
    });

    toast.success('Field added!');
  };

  const handleFieldSave = (updatedField: Field) => {
    if (!template) return;
    const updatedSections = template.sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => (field.id === updatedField.id ? updatedField : field)),
    }));
    updateTemplate({ ...template, sections: updatedSections });
    setEditingField(null);
    toast.success('Field Update!');
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading template...</p>
      </div>
    );
  }

  const handleDeleteField = (sectionId: string, fieldId: string) => {
    if (!template) return;
    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.filter((field) => field.id !== fieldId),
        };
      }
      return section;
    });
    updateTemplate({ ...template, sections: updatedSections });

    toast.success('Field Deleted!');
  };
  const handleDeleteSection = (sectionId: string) => {
    if (!template) return;
    const updatedSections = template.sections.filter((section) => section.id !== sectionId);
    updateTemplate({ ...template, sections: updatedSections });

    toast.success('Field Deleted!');
  };

  const handleUploadTypeChange = (sectionId: string, fieldId: string, uploadType: 'image' | 'file' | 'both') => {
    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId) {
        const updatedFields = section.fields.map((field) => {
          if (field.id === fieldId) {
            return { ...field, uploadType };
          }
          return field;
        });
        return { ...section, fields: updatedFields };
      }
      return section;
    });
    updateTemplate({ ...template, sections: updatedSections });
  };

  console.log(template);

  const handleSaveDraft = () => {
    localStorage.setItem(`template-${template.id}`, JSON.stringify(template));
    toast.success('Template saved as draft!');
    navigate('/');
  };

  const handlePreview = () => {
    navigate(`/form/${template.id}`);
  };

  return (
    <>
      <HeaderBar onSave={handleSaveDraft} onPreview={handlePreview} templateId={template.id} />

      <DndContext
        onDragStart={(event) => {
          console.log(event.active);
          setActiveFieldType(event?.active?.data?.current as FieldTypeObject);
        }}
        onDragEnd={(event) => {
          const overId = event.over?.id;

          if (typeof overId === 'string' && activeFieldType) {
            handleFieldDrop(overId, activeFieldType?.fieldType as FieldType);
          }
          setActiveFieldType(null);
        }}
      >
        <DragOverlay>
          {activeFieldType ? (
            <div className="px-4 py-2 bg-white border rounded shadow-lg">{activeFieldType?.label?.toUpperCase()}</div>
          ) : null}
        </DragOverlay>
        <div className="flex h-screen mt-10">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{template.name}</h1>

              <Link to={`/form/${template.id}`}>
                <div className="relative group w-fit">
                  <button className=" py-2 text-blue-400 flex items-center gap-2 rounded transition-colors duration-300">
                    <span>Preview</span>
                    <Eye className="w-6 h-6" />
                  </button>
                  <span className=" absolute bottom-0 left-0 h-0.5 w-full bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 "></span>
                </div>
              </Link>
            </div>

            {template.sections.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No sections added yet. Click "Add Section" to start building your form.
              </div>
            ) : (
              template.sections.map((section) => (
                <Droppable key={section.id} id={section.id}>
                  <div className="border rounded shadow p-4 mb-4 bg-white">
                    <div className="flex justify-between items-center">
                      <input
                        value={section.title}
                        onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                        className="text-lg font-semibold border-b w-full mb-2 focus:outline-none cursor-pointer"
                      />

                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-red-500 text-sm ml-2 cursor-pointer"
                        title="Delete Field"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="min-h-[50px] border rounded p-2 bg-gray-50">
                      {section.fields.length === 0 ? (
                        <p className="text-sm text-gray-400">Drop fields here</p>
                      ) : (
                        section.fields.map((field) => (
                          <div
                            key={field.id}
                            className="relative p-2 border rounded bg-white mb-2 hover:bg-gray-50 transition "
                            onClick={() => setEditingField(field)}
                          >
                            <label className="block text-sm font-medium mb-1 cursor-pointer">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === 'text' && (
                              <input
                                type="text"
                                placeholder="Text input"
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                                disabled
                              />
                            )}

                            {field.type === 'number' && (
                              <input
                                type="number"
                                placeholder="Number input"
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                                disabled
                              />
                            )}

                            {field.type === 'boolean' && (
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" className="cursor-not-allowed" disabled />
                                <span>Checkbox</span>
                              </div>
                            )}

                            {field.type === 'enum' && (
                              <select className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed" disabled>
                                {field.options?.map((option, idx) => (
                                  <option key={idx}>{option}</option>
                                ))}
                              </select>
                            )}
                            {field.type === 'upload' && (
                              <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                                <label className="text-xs text-gray-600">Upload Type</label>
                                <select
                                  value={field.uploadType || 'both'}
                                  onChange={(e) =>
                                    handleUploadTypeChange(
                                      section.id,
                                      field.id,
                                      e.target.value as 'image' | 'file' | 'both'
                                    )
                                  }
                                  className="w-full border rounded p-1 text-sm"
                                >
                                  <option value="both">Allow Both</option>
                                  <option value="image">Images Only</option>
                                  <option value="file">Files Only</option>
                                </select>
                              </div>
                            )}

                            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 hover:opacity-100 transition">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingField(field);
                                }}
                                className="text-blue-500 text-sm"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 " />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteField(section.id, field.id);
                                }}
                                className="text-red-500 text-sm"
                                title="Delete"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </Droppable>
              ))
            )}

            <button
              onClick={handleAddSection}
              className={`mt-4 px-4 py-2 ${
                template.sections.length >= 10 ? 'hidden' : 'flex'
              } gap-2 text-blue-400 border border-blue-400 hover:text-white rounded hover:bg-blue-400 cursor-pointer transition duration-75`}
            >
              <Plus className="w-6 h-6" /> <span>Add Section</span>
            </button>
          </div>

          <FieldPalette />
        </div>
        <FieldEditModal field={editingField} onClose={() => setEditingField(null)} onSave={handleFieldSave} />
      </DndContext>
    </>
  );
};

export default Builder;
