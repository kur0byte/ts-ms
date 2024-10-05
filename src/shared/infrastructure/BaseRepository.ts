/**
 * @abstract
 * @example class UserRepository extends BaseRepository<User> {
 * @template T
 * @property {T} save
 * @returns BaseRepository
 */
export abstract class BaseRepository<T> {
  /**
   * @param id string
   * @property {T} findById
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * @param entity T
   */
  abstract save(entity: T): Promise<void>;
}
