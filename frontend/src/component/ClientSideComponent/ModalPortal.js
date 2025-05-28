import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const ModalPortal = ({ children }) => {
  const [modalContainer, setModalContainer] = useState(null);

  useEffect(() => {
    const el = document.getElementById("modal-root");
    setModalContainer(el);
  }, []);

  if (!modalContainer) return null;

  return createPortal(children, modalContainer);
};

export default ModalPortal;
