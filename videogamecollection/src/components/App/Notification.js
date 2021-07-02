import React from 'react';
import PropTypes from 'prop-types';

// import notif from '../../assets/images/icons/notif.png';

const Message = ({
  saveMessage,
  message,
}) => {
  if (message !== '') {
    setTimeout(() => {
      saveMessage('');
    }, 5000);
  }
  return (
    message ? (
      <div className="notification">
        {/* <img className="notification-logo" src={notif} alt="notification" /> */}
        <p className="notification-text">{message}</p>
      </div>
    ) : ''
  );
};

Message.propTypes = {
  saveMessage: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Message;
