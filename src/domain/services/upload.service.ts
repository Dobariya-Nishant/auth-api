import { inject, injectable } from "tsyringe";
import { IStorageRepository } from "../interface/repositories/storage.repository.interface";

@injectable()
export default class StorageService {
  constructor(
    @inject("SessionRepository")
    private sessionRepository: IStorageRepository
  ) {}

  get() {}
}
