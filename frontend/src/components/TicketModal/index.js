import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import RegisterEvent from './RegisterEvent';

function TicketModal({ eventId }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Register</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <RegisterEvent eventId={eventId} />
        </Modal>
      )}
    </>
  );
}

export default TicketModal;
