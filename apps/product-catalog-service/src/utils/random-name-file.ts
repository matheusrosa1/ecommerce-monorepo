/* filename: (req, file, cb) => {
import { randomNameFile } from 'src/utils/random-name-file';
  // Gera um nome de arquivo único para evitar conflitos
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${randomName}${extname(file.originalname)}`);
},
*/
export const randomNameFile = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
): void => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const extension = file.originalname.split('.').pop() || 'txt'; // Default to
  // 'txt' if no extension is found
  cb(null, `${randomName}.${extension}`);
};
