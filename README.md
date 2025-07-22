# 🚀 Form Template Builder

An **intuitive, flexible Form Template Builder** allowing users to **create, customize, and preview form templates with drag-and-drop fields**, and dynamically render forms to record structured data, all with a clean, modern UI.

Built with **Vite + React + TypeScript + Tailwind CSS**, using **@dnd-kit/core** for smooth drag-and-drop functionality.

---

## ✨ Features

✅ Dashboard to view, create, and manage up to 5 form templates.  
✅ Template Builder with:
- Sections & customizable field additions.
- Drag-and-drop arrangement within sections.
- Supports:
  - Label (H1, H2, H3)
  - Text input
  - Number input
  - Boolean (toggle/checkbox)
  - Enum (dropdown)
  - File/image upload via Cloudinary.
- Live preview and draft saving (Local Storage).

✅ Dynamic Form Renderer with validation.  
✅ Clean, modern UI with icons and animations.  
✅ Fully responsive design.

---

## 🛠️ Tech Stack

| Category | Tech |
|---|---|
| **Frontend Framework** | React, TypeScript |
| **Bundler** | Vite |
| **Styling** | Tailwind CSS |
| **State Management** | React Context, Local State |
| **Drag-and-Drop** | @dnd-kit/core |
| **Icon Pack** | lucide-react |
| **Cloud Upload** | Cloudinary |
| **Version Control** | Git + GitHub |

---

## 📂 Folder Structure

```bash
form-template-builder/
│
├── public/
│   └── book.svg                  # App favicon/logo
│
├── src/
│   │
│   ├── components/               # Reusable UI components
│   │   ├── AddFileds.tsx
│   │   ├── FieldPalette.tsx
│   │   └── FieldPalette.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useLocalStorage.ts
│   │
│   ├── pages/                    # Route-level pages
│   │   ├── Builder.tsx           # Template builder UI
│   │   ├── Dashboard.tsx         # Template list & management
│   │   └── FormPage.tsx          # Dynamic form renderer
│   │
│   ├── types/                    # TypeScript types/interfaces
│   │   └── index.ts
│   │
│   ├── utils/                    # Helper utilities
│   │   ├── uploadToCloudinary.ts # Cloudinary upload logic
│   │   └── storageUtils.ts
│   │
│   ├── App.tsx                   # App layout and routing
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind + global styles
│   
│
├── index.html
├── .prettierrc                   # Prettier configuration
├── package.json
└── vite.config.ts                # Vite configuration
```




## 🚀 Getting Started

### 1️⃣ Clone the Repository:
```bash
https://github.com/ManSOorcode/Form_Builder_Task.git
cd Form_Builder_Task
