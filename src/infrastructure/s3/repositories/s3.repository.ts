import { injectable } from "tsyringe";
import { randomUUID } from "crypto";
import { Upload } from "@aws-sdk/lib-storage";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "@/api/server";
import { UnprocessableEntityError } from "@/domain/errors/app-errors";
import { awsUrls, s3 } from "@/infrastructure/s3/client";
import { IStorageRepository } from "@/domain/interface/repositories/storage.repository.interface";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@injectable()
export class S3Repository implements IStorageRepository {
  client: S3Client;

  constructor() {
    this.client = s3;
  }

  getUrls(keys: (string | undefined)[]) {
    return Promise.all(
      keys.map((key) =>
        getSignedUrl(
          this.client,
          new GetObjectCommand({
            Bucket: env.AWS_BUCKET_NAME,
            Key: key!,
          }),
          { expiresIn: 150 } // 2.5 min
        )
      )
    );
  }

  async get({ prefixPath, lastId }: { prefixPath: string; lastId: string }) {
    const res = await this.client.send(
      new ListObjectsV2Command({
        Bucket: env.AWS_BUCKET_NAME,
        Prefix: prefixPath,
        MaxKeys: 20,
        ContinuationToken: lastId,
      })
    );

    const keys = res.Contents?.map((obj) => obj.Key).filter(Boolean) ?? [];

    return this.getUrls(keys);
  }

  async upload({
    userId,
    fileName,
    fileContent,
    contentType,
    fileUrl,
  }: {
    userId: string;
    fileName: string;
    fileContent: any;
    contentType: string;
    fileUrl?: string;
  }): Promise<string> {
    let key: string;

    if (fileUrl) {
      const urlParts = fileUrl.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new UnprocessableEntityError("Invalid S3 file URL.");
      }

      key = urlParts[1];
    } else {
      key = `${userId}/${randomUUID()}_${fileName}`;
    }

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
      },
    });

    await upload.done();

    return key;
  }

  multiUpload(userId: string, files: Array<any>): Promise<Array<string>> {
    if (!Array.isArray(files)) {
      files = [files];
    }

    const uploadPromises = files.map(async (file) => {
      return this.upload({
        userId: userId,
        fileContent: file.file,
        fileName: file.mimetype,
        fileUrl: file.fileUrl,
        contentType: file.mimetype,
      });
    });

    return Promise.all(uploadPromises);
  }

  async deleteFiles(urls: Array<string>): Promise<void> {
    if (!urls?.length) {
      return;
    }

    const objects = urls.map((url) => {
      const urlParts = url.split(awsUrls.S3_BUCKET_URL);

      if (urlParts.length !== 2) {
        throw new Error("Invalid S3 file URL.");
      }

      return { Key: urlParts[1] };
    });

    const deleteParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Delete: {
        Objects: objects,
        Quiet: false,
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);

    const response = await this.client.send(command);

    if (response.Errors && response.Errors.length > 0) {
      console.error("Errors occurred while deleting:", response.Errors);
      throw new UnprocessableEntityError("Some files could not be deleted.");
    }

    return;
  }
}
