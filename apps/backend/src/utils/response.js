export const response = {
  success: (reply, data, statusCode = 200) => {
    return reply.status(statusCode).send({
      success: true,
      data,
    });
  },
  error: (reply, message, statusCode = 500, code = 'INTERNAL_ERROR') => {
    return reply.status(statusCode).send({
      success: false,
      error: {
        message,
        code,
      },
    });
  },
};
