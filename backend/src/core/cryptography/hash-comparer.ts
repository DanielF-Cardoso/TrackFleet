export abstract class HashComparer {
  abstract compareHash(plain: string, hash: string): Promise<boolean>
}
