const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const extraerDatosLocal = () => {
  const filePath = path.join(__dirname, '../../public/index.html');

  if (!fs.existsSync(filePath)) {
    const error = new Error('No se encontró el archivo HTML local');
    error.statusCode = 404;
    throw error;
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  if (!html || html.trim().length === 0) {
    const error = new Error('El archivo HTML está vacío');
    error.statusCode = 400;
    throw error;
  }

  const $ = cheerio.load(html);

  // Campo 1: título → selector: title
  const titulo = $('title').first().text().trim() || 'Sin título';

  // Campo 2: meta descripción → selector: meta[name="description"]
  const descripcion = $('meta[name="description"]').attr('content')?.trim() || 'Sin descripción';

  // Campo 3: headings → selector: h1, h2
  const headings = [];
  $('h1, h2').each((i, el) => {
    headings.push({ tipo: el.tagName.toUpperCase(), texto: $(el).text().trim() });
  });

  // Campo 4: campos del formulario → selector: .campo
  const camposFormulario = [];
  $('.campo').each((i, el) => {
    const label = $(el).find('label').first().text().trim();
    const input = $(el).find('input[type="text"], input[type="email"], input[type="tel"]');

    if (input.length > 0) {
      camposFormulario.push({
        campo: label,
        tipo: input.attr('type'),
        nombre: input.attr('name'),
        placeholder: input.attr('placeholder') || 'Sin placeholder',
      });
    }

    const radios = $(el).find('input[type="radio"]');
    if (radios.length > 0) {
      const opciones = [];
      radios.each((j, radio) => opciones.push($(radio).attr('value')));
      camposFormulario.push({ campo: 'Género', tipo: 'radio', nombre: 'genero', opciones });
    }
  });

  if (camposFormulario.length === 0) {
    const error = new Error('No se encontraron campos en el formulario');
    error.statusCode = 404;
    throw error;
  }

  return {
    fuente: 'local (public/index.html)',
    extraidoEn: new Date().toISOString(),
    totalCampos: camposFormulario.length,
    datos: { titulo, descripcion, headings, camposFormulario },
  };
};

const extraerDatosRemoto = async (url) => {
  let html;
  try {
    const respuesta = await axios.get(url, { timeout: 8000 });
    html = respuesta.data;
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      const error = new Error('La URL respondió con 404 - No encontrada');
      error.statusCode = 404;
      throw error;
    }
    throw new Error(`No se pudo obtener el HTML: ${err.message}`);
  }

  if (!html || html.trim().length === 0) {
    const error = new Error('El HTML recibido está vacío');
    error.statusCode = 400;
    throw error;
  }

  const $ = cheerio.load(html);
  const titulo = $('title').first().text().trim() || 'Sin título';
  const descripcion = $('meta[name="description"]').attr('content')?.trim() || 'Sin descripción';
  const headings = [];
  $('h1, h2').each((i, el) => {
    headings.push({ tipo: el.tagName.toUpperCase(), texto: $(el).text().trim() });
  });

  return {
    fuente: url,
    extraidoEn: new Date().toISOString(),
    datos: { titulo, descripcion, headings },
  };
};

module.exports = { extraerDatosLocal, extraerDatosRemoto };
