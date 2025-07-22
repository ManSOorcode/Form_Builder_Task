import { Eye, FileText, Save, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface HeaderBarProps {
  onSave: () => void;
  onPreview: () => void;
  templateId: string;
}

const HeaderBar = ({ onSave, onPreview, templateId }: HeaderBarProps) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/form/${templateId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-4 py-2 border-b">
      <FileText className="w-6 h-6 text-blue-500" />

      <div className="flex space-x-4">
        <div className="relative group w-fit">
          <button
            onClick={onSave}
            className="flex items-center cursor-pointer gap-1 pb-1 text-blue-500 text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </div>

        <div className="relative group w-fit">
          <button
            onClick={onPreview}
            className="flex items-center cursor-pointer gap-1 pb-1 text-green-500 text-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-green-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </div>

        <div className="relative group w-fit">
          <button
            onClick={handleShare}
            className="flex items-center cursor-pointer gap-1 pb-1 text-gray-500 text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-400 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
