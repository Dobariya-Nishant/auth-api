export interface IStorageRepository {
  upload({
    userId,
    fileName,
    fileContent,
    fileUrl,
  }: {
    userId: string;
    fileName: string;
    fileContent: any;
    fileUrl?: string;
  }): Promise<string>;

  multiUpload(userId: string, files: Array<any>): Promise<Array<string>>;

  deleteFiles(urls: Array<string>): Promise<void>;
}
