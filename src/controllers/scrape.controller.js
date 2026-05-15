const { extraerDatosLocal, extraerDatosRemoto } = require('../services/scrape.service');

const scrapeLocal = (req, res, next) => {
  try {
    const resultado = extraerDatosLocal();
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

const scrapeUrl = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'Parámetro requerido',
        detalle: 'Envía ?url=https://...'
      });
    }

    try { new URL(url); } catch {
      return res.status(400).json({
        error: 'URL inválida',
        detalle: `"${url}" no es una URL válida`
      });
    }

    const resultado = await extraerDatosRemoto(url);
    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { scrapeLocal, scrapeUrl };
