import multer from "fastify-multer";
import { randomUUID } from "node:crypto";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

// Cria função para receber mais de um diretorio
const getDirectories = (source: string): string[] =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// Variável tmpFolder recebe o caminho da pasta tmp
const tmpFolder = './src/tmp';

// Cria array de diretorios tipo string vazia com
const tempDirectories: string[] = getDirectories(tmpFolder);

// Filtra o diretorio recebido retornando em um Objeto.assign
export const tmpDirectoriesUploadConfig = tempDirectories
  .map((directory) => {
    const tmpPath = resolve(`${tmpFolder}/${directory}`);
    return {
      [directory]: {
        directory: tmpPath,
        storage: multer.diskStorage({
          destination: tmpPath,
          filename(request, file, callback) {
            const fileHash = randomUUID();
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
          },
        }),
      },
    };
  })
  .reduce((object, item) => {
    const [key] = Object.keys(item);
    return Object.assign(object, { [key]: item[key] });
  }, {});
