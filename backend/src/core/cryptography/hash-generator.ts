export abstract class HashGenerator {
  abstract generateHash(plain: string): Promise<string>
}
