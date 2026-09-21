import appError from '../errors/appError.js';

function errorMiddlewares(err, req, res, next) {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  if (err.code) {
    console.error(`[Erro MySQL - Code: ${err.code}]:`, err.sqlMessage || err.message);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'error',
        message: 'Registro duplicado. Este dado já existe no sistema.'
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Erro na operação do banco de dados.'
    });
  }

  console.error('erro critico:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor.'
  });
}

export default errorMiddlewares;