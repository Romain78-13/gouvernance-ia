import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-2xl" }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <div
        className="fixed inset-0 bg-black/40"
        style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel
          className={`bg-card w-full ${maxWidth} my-8 max-h-[90vh] flex flex-col rounded-[20px] animate-modalin`}
        >
          <div className="flex items-center justify-between px-8 pt-7 pb-4">
            <Dialog.Title className="h3">{title}</Dialog.Title>
            <button
              onClick={onClose}
              className="text-muted hover:text-ink transition-colors -mr-1"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <div className="px-8 pb-8 overflow-y-auto">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
