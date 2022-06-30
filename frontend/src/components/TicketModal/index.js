import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import RegisterEvent from './RegisterEvent';

function TicketModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Register</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <RegisterEvent />
        </Modal>
      )}
    </>
  );
}

export default TicketModal;
