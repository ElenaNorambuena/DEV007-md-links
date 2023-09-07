const fs = require('fs');// módulo filesystem
const path = require('path'); // módulo path para trabajar rutas y directorios
const marked = require('marked'); // paquete marked para convertir de markdown a html
const cheerio = require('cheerio'); // importando cheerio
const url = require('url'); // módulo url para resolver rutas
const axios = require('axios'); // importando axios

const isMd = function (route){// función para testing
      // Verificar si el archivo tiene extensión .md
      if (path.extname(route) !== '.md') {
        return false; // Salir de la función si no es un archivo .md
      } return true;
};

const isAbsolute = function (filePath){// función para testing
  // Verificar si la ruta es absoluta
  if (path.isAbsolute(filePath)) {// 
    return true; // 
  } return false
};

const impDir = function(absolutePath){
  if (path.impDir(absolutePath)){
  return true;
  } return false
};

// Definir la función mdLinks con un parámetro opcional validate
const mdLinks = (filePath, validate = false) => {// exporta una función anónima como el valor de 'module.exports'para que otros archivos lo importen.

  return new Promise((resolve, reject) => {
    let absolutePath = filePath
    if (isAbsolute(filePath) === false){// si la ruta no es absoluta(osea es relativa)
      absolutePath = path.resolve(filePath);// si la ruta es relativa se resuelve a absoluta
    };
    if (impDir(absolutePath) === true){
      const dirName = path.dirName(absolutePath); // Obtener el directorio del archivo
      console.log(dirName); // Imprimir el directorio en la consola
    };
    

    // Verificar si el archivo tiene extensión .md
    if (isMd(absolutePath) === false) {
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
      $('a[href]').each((_, element) => {
          // Resolver la ruta relativa con respecto a la ruta base del archivo
          const href = url.resolve(absolutePath, $(element).attr('href'));
          // Obtener el texto del elemento
          const text = $(element).text();
          // Crear un objeto con las propiedades url y text
          const link = { href, text};
          // Añadir el objeto al array de links
          links.push(link);
      });
      console.log(links);

      // verifico si validate es true
      if (validate) {
        // map para transformar array de links en un array de promesas
        const promises = links.map(link => {
          // petición HTTP al enlace
          return axios.get(link.href)
            .then(response => {
              // Si la petición tiene éxito, devolver un objeto con las propiedades href, text, file, status y ok
              return {
                href: link.href,
                text: link.text,
                file: dirName,
                status: response.status,
                ok: response.statusText
              };
            })
            .catch(error => {
              // Si falla, devuelve un objeto con las propiedades href, text, file y message
              return {
                href: link.href,
                text: link.text,
                file: dirName,
                message: error.message
              };
            });
        });

        // Usar Promise.all para esperar a que todas las promesas se resuelvan y devolver un nuevo array de objetos
        return Promise.all(promises)
          .then(objects => {
            console.log(objects);
            resolve(objects); // resuelve la promesa con el array de objetos validados
          })
          .catch(error => {
            reject(error); // maneja errores al validar los enlaces
          });
      } else {
        // si validate es false o undefined, devuelve array de links sin validar
        resolve(links); // resuelve la promesa con el array de links sin validar
      }
    } catch (error) {
      reject(error);
    }
  });
};
mdLinks('./README.md', true)
module.exports = {isMd}