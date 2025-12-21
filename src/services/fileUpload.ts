import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileUploadService {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: File): Promise<string> {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      
      return `/uploads/${fileName}`;
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;
    
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    const filePath = path.join(this.uploadDir, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];

    if (file.size > maxSize) {
      return { valid: false, error: 'Файл слишком большой. Максимум 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Недопустимый тип файла' };
    }

    return { valid: true };
  }
}