import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { FileStorageService } from './file-storage-service';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  async save(file: Express.Multer.File): Promise<string> {
    // Verificação mais específica com type guard
    if (!file || !file.path) {
      throw new InternalServerErrorException(
        'Erro ao salvar o arquivo. O arquivo pode não ter sido enviado ou está corrompido.',
      );
    }
    // Agora o TypeScript tem certeza de que file.path é uma string
    return Promise.resolve(file.path);
  }

  async delete(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Erro ao excluir o arquivo: ${errorMessage}`,
      );
    }
  }
}
