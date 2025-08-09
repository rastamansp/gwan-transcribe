export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  getFileUrl(fileUrl: string): Promise<string>;
}
