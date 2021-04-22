/* eslint-disable no-console */

const logMiddleware = () => (next) => (action) => {
  next(action);
};

export default logMiddleware;
