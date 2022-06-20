import { Dialog } from "@headlessui/react";
import { useState } from "react";

function Modal({ title, description, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="p-6 bg-white shadow-md rounded-md max-w-lg mx-auto">
          {title && <Dialog.Title>{title}</Dialog.Title>}
          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default Modal;
