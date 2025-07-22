export type FieldType =
  | "label"
  | "text"
  | "number"
  | "boolean"
  | "enum"
  | "paragraph"
  | "upload";

export interface FieldTypeObject {
  type: string;
  fieldType: string;
  label: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // for enum dropdown
  uploadType?: "image" | "file" | "both"; // for uploade
}

export interface Section {
  id: string;
  title: string;
  fields: Field[];
}

export interface Template {
  id: string;
  name: string;
  sections: Section[];
  createdAt: string;
}
