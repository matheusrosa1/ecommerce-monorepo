import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express'; // 1. Importe o tipo 'Request'
import { unlinkSync } from 'fs';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // 2. Adicione a tipagem <Request> aqui
        const request = context.switchToHttp().getRequest<Request>();
        const file = request.file;

        if (file) {
          // Se um erro ocorrer, apaga o arquivo que foi salvo pelo FileInterceptor
          unlinkSync(file.path);
        }

        // Relança o erro para que ele seja tratado pelo Exception Filter do NestJS
        return throwError(() => error as unknown);
      }),
    );
  }
}
