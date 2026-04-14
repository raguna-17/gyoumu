const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{ background: "rgba(0,0,0,0.5)", position: "fixed", inset: 0 }}>
      <div style={{ background: "#fff", margin: "100px auto", padding: "20px", width: "300px" }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;