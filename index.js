const fs = require('fs'); // Se importa el módulo file system de Node.js

const path = require('path'); // Se importa el módulo 'path' de Node.js (para trabajar con rutas y directorios, en este caso rutas)

const marked = require('marked'); // Se importa paquete 'marked' para convertir Markdown a HTML.

const mdLinks= (filePath) => { // Se exporta una función anónima como el valor de 'module.exports', lo que permitirá que otros archivos lo importen.

  return new Promise((resolve, reject) => { // Nueva Promesa.

    const absolutePath = path.resolve(filePath); // Convertimos la ruta relativa en absoluta con módulo 'path'.

   const result= fs.readFileSync(absolutePath, 'utf8') // Se lee contenido del archivo en formato UTF-8 usando promesas de módulo 'fs'.
    console.log(result);
        const links = []; // Creamos un arreglo vacío para almacenar los enlaces encontrados.

        const renderer = new marked.Renderer(); // Creamos una instancia del renderizador personalizado proporcionado por el paquete 'marked'.

        renderer.link = (href, title, text) => { // Sobreescribimos el método 'link' del renderizador para extraer y almacenar los enlaces encontrados.
          links.push({ href, text, file: absolutePath }); // Agregamos un objeto al arreglo 'links' con la URL (href), el texto y la ruta del archivo.
        };

        marked(result, { renderer }); // Utilizamos el renderizador personalizado para analizar el contenido Markdown y extraer los enlaces.

        if (links.length === 0) { // Si no se encontraron enlaces en el archivo, rechazamos la promesa con un error.
          reject(new Error('No se encontraron enlaces en el archivo.'));
        } else { // Si se encontraron enlaces, resolvemos la promesa con el arreglo de enlaces.
          resolve(links);
        }
  });
};
mdLinks('./README.md')