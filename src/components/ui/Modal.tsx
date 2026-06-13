import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-surface-container-lowest w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-fade-in`}>
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-title-md text-title-md text-primary">{title}</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors" onClick={onClose}>
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        {footer && <div className="p-6 bg-surface-container-low flex gap-3">{footer}</div>}
      </div>
    </div>
  );
}
