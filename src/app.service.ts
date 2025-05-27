import { Injectable } from '@nestjs/common';

// Acá estaba la anterior interface
// Acá estaba la base de datos simulada

@Injectable()
export class AppService {
  getTracks(): string[] {
    return [];
  }
}
