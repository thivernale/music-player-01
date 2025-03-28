import { Client, Databases, ID, Models, Query, Storage } from 'appwrite';
import { env } from '../config/env';

type PostResponse = Models.Document & Post;
export type Post = {
  $id?: string;
  slug?: string;
  title: string;
  content: string;
  featuredImage?: string;
  active?: boolean;
  userId?: string;
};

export class StorageService {
  private static readonly DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID;
  private static readonly COLLECTION_ID = env.VITE_APPWRITE_COLLECTION_ID;
  private static readonly BUCKET_ID = env.VITE_APPWRITE_BUCKET_ID;
  private readonly client: Client;
  private databases: Databases;
  private storage: Storage;

  constructor() {
    this.client = new Client()
      .setEndpoint(env.VITE_APPWRITE_URL)
      .setProject(env.VITE_APPWRITE_PROJECT_ID);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  private static _instance: StorageService;

  static get instance(): StorageService {
    if (!StorageService._instance) {
      StorageService._instance = new StorageService();
    }
    return StorageService._instance;
  }

  async getPost(slug: string) {
    try {
      return this.stripPost(
        await this.databases.getDocument<PostResponse>(
          StorageService.DATABASE_ID,
          StorageService.COLLECTION_ID,
          slug,
        ),
      );
    } catch (e) {
      console.error('Appwrite service getPost()', e);
    }
  }

  async getPosts(queries: string[] = [Query.equal('active', true)]) {
    try {
      return (
        await this.databases.listDocuments<PostResponse>(
          StorageService.DATABASE_ID,
          StorageService.COLLECTION_ID,
          queries,
        )
      ).documents.map((document) => this.stripPost(document));
    } catch (e) {
      console.error('Appwrite service getPosts()', e);
    }
  }

  async createPost(post: Post) {
    const { slug, ...data } = post;
    try {
      return this.stripPost(
        await this.databases.createDocument<PostResponse>(
          StorageService.DATABASE_ID,
          StorageService.COLLECTION_ID,
          slug as string,
          data,
        ),
      );
    } catch (e) {
      console.error('Appwrite service createPost()', e);
    }
  }

  async updatePost(slug: string, post: Post) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $id, userId, slug: s, ...data } = post;
    try {
      return this.stripPost(
        await this.databases.updateDocument<PostResponse>(
          StorageService.DATABASE_ID,
          StorageService.COLLECTION_ID,
          slug,
          data,
        ),
      );
    } catch (e) {
      console.error('Appwrite service updatePost()', e);
    }
  }

  async deletePost(slug: string) {
    try {
      await this.databases.deleteDocument(
        StorageService.DATABASE_ID,
        StorageService.COLLECTION_ID,
        slug,
      );
      return true;
    } catch (e) {
      console.error('Appwrite service deletePost()', e);
    }
  }

  async uploadFile(file: File) {
    try {
      return await this.storage.createFile(
        StorageService.BUCKET_ID,
        ID.unique(),
        file,
      );
    } catch (e) {
      console.error('Appwrite service uploadFile()', e);
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.storage.deleteFile(StorageService.BUCKET_ID, fileId);
      return true;
    } catch (e) {
      console.error('Appwrite service deleteFile()', e);
    }
  }

  getFilePreview(fileId: string) {
    return this.storage.getFileView(StorageService.BUCKET_ID, fileId);
  }

  /**
   * Remove all appwrite-specific properties that start with $, apart from $id
   * @param post
   * @private
   */
  private stripPost(post: Post): Post {
    return Object.fromEntries(
      Object.entries(post).filter(([k]) => !k.startsWith('$') || k === '$id'),
    ) as Post;
  }
}

export const storageService = StorageService.instance;
