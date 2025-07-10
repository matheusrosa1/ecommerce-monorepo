export abstract class FileStorageService {
  abstract save(file: Express.Multer.File): Promise<string>;
  abstract delete(filePath: string): Promise<void>;
}
