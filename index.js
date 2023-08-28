const fs = require('fs');// módulo filesystem
const path = require('path'); // módulo path para trabajar rutas y directorios
const marked = require('marked'); // paquete marked para convertir de markdown a html
const cheerio = require('cheerio'); // importando cheerio
const url = require('url'); // módulo url para resolver rutas

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
      // Convertir el contenido markdown a html y guardarlo en una variable
      const html = marked.parse(result);
      console.log(html);

// Carga el contenido HTML en Cheerio
const $ = cheerio.load(html);
// Selecciona todos los elementos 'a' que tienen el atributo 'href' y extrae sus valores
const links = [];
$('a[href]').each((index, element) => {
    // Resolver la ruta relativa con respecto a la ruta base del archivo
    const href = url.resolve(absolutePath, $(element).attr('href'));
    // Obtener el texto del elemento
    const text = $(element).text();
    // Crear un objeto con las propiedades url y text
    const link = {url: href, text: text};
    // Añadir el objeto al array de links
    links.push(link);
});
console.log(links);

// Usar el método map para transformar el array de links en un array de objetos
const objects = links.map(link => {
    // Devolver un nuevo objeto con las propiedades url y text
    return {url: link.url, text: link.text};
});
console.log(objects);


      // Resolver la promesa con el array de links
      resolve(links);
    } catch (error) {
      reject(error); // Manejar errores al leer el archivo
    }
  });
}; 

mdLinks('./README.md')
