import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ saveMessage, message }) => {
  if (message !== '') {
    setTimeout(() => {
      saveMessage('');
    }, 5000);
  }
  return (
    message ? (
      <div className="notification">
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
