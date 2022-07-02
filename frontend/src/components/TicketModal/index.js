import React, { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal';
import RegisterEvent from './RegisterEvent';

function TicketModal({ eventId, regId, setRegId, isRegistered, setIsRegistered }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      if (Number.isFinite(regId)) setIsRegistered(true)
      else setIsRegistered(false);
  }, []);

  return (
    <> { !isRegistered &&
      <button onClick={() => setShowModal(true)}>Register</button>
       }
       { isRegistered &&
        <button onClick={() => setShowModal(true)}>Edit Registration</button>
       }
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <RegisterEvent eventId={eventId} regId={regId} setRegId={setRegId} isRegistered={isRegistered} setIsRegistered={setIsRegistered}/>
        </Modal>
      )}
    </>
  );
}

export default TicketModal;
