export abstract class FileStorageService {
  abstract save(file: Express.Multer.File): Promise<string>;
}
