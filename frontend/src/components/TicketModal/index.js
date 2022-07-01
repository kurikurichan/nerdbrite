import React, { useState, useEffect } from 'react';
import { Modal } from '../../context/Modal';
import RegisterEvent from './RegisterEvent';

function TicketModal({ eventId, regId, setRegId, isRegistered, setIsRegistered }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      console.log("we have entered the useEffect in index.js")
      console.log("THE REGID IN INDEX.JS: ", regId);
      if (Number.isFinite(regId)) setIsRegistered(true)
      else setIsRegistered(false);
      console.log(`registered from index.js: ${isRegistered}`)
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
