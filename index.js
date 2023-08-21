const fs = require('fs');// módulo filesystem
const path = require('path'); // módulo path para trabajar rutas y directorios
const marked = require('marked'); // paquete marked para convertir de markdown a html

const mdLinks = (filePath) => {// exporta una función anónima como el valor de 'module.exports'para que otros archivos lo importen.

  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);// de relativa a absoluta

    // Verificar si el archivo tiene extensión .md
    if (path.extname(absolutePath) !== '.md') {
      reject(new Error('El archivo debe ser de formato .md'));
      return; // Salir de la función si no es un archivo .md
    }

    try {
      const result = fs.readFileSync(absolutePath, 'utf8');// leyendo contenido UTF-8 usando promesas de módulo 'fs'
      console.log(result);
      const links = [];// array vacío para links encontrados

      const renderer = new marked.Renderer();// instancia del renderizador personalizado proporcionado por el paquete 'marked'

      renderer+9.link = (href, title, text) => {
        links.push({ href, text, file: absolutePath });
      };

      marked(result, { renderer });

      if (links.length === 0) {
        reject(new Error('No se encontraron enlaces en el archivo.'));
      } else {
        resolve(links);
      }
    } catch (error) {
      reject(error); // Manejar errores al leer el archivo
    }
  });
};

mdLinks('./README.md')