import { TransactionBaseService, MedusaContainer } from "@medusajs/medusa";
import tolgeeClient from "../utils/tolgeeClient";

type Language = {
  label: string;
  tag: string;
};

interface TranslationServiceOptions {
  defaultLanguage?: string;
  availableLanguages?: Language[];
  productsKeys?: string[];
  projectId?: string;
}

class TranslationManagementService extends TransactionBaseService {
  private defaultLanguage: string;
  private availableLanguages: Language[];
  private productsKeys: string[];
  private projectId: string;

  constructor(container: MedusaContainer, options: TranslationServiceOptions) {
    super(container);

    this.defaultLanguage = options.defaultLanguage || "en";
    this.availableLanguages = options.availableLanguages || [
      { label: "English", tag: "en" },
    ];
    this.productsKeys = options.productsKeys || ["title", "subtitle", "description"];
    this.projectId = options.projectId || "1";
  }

  getDefaultLanguage(): string {
    return this.defaultLanguage;
  }

  getAvailableLanguages(): Language[] {
    return this.availableLanguages;
  }

  async getNamespaceKeys(productId: string): Promise<string[]> {
    try {
      const response = await tolgeeClient.get(
        `${this.projectId}/keys/select?filterNamespace=${productId}`
      );

      return response.data.ids;
    } catch (error) {
      console.error("Error checking namespace keys:", error);
      throw new Error(`Failed to fetch namespace keys for product ${productId}: ${error.message}`);
    }
  }

  async getKeyName(keyId: string): Promise<string> {
    try {
      const response = await tolgeeClient.get(
        `${this.projectId}/keys/${keyId}`
      );

      return response.data.name;
    } catch (error) {
      console.error("Error checking namespace keys:", error);
      throw new Error(`Failed to fetch key name for key ID ${keyId}: ${error.message}`);
    }
  }

  async getProductTranslationKeys(productId: string, returnIds: boolean = false): Promise<string[] | any[]> {
    const ids = await this.getNamespaceKeys(productId);

    if (ids.length === 0) return [];

    if (returnIds) return ids;

    return await Promise.all(ids.map((keyId) => this.getKeyName(keyId)));
  }

  async createNewKeyWithTranslation(productId: string, keyName: string, translation: string): Promise<any> {
    try {
      const response = await tolgeeClient.post(`${this.projectId}/keys`, {
        name: `${productId}.${keyName}`,
        namespace: productId,
        translations: { [this.defaultLanguage]: translation },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating new key with translations:", error);
      throw new Error(`Failed to create new key with translation for ${keyName}: ${error.message}`);
    }
  }

  async createProductTranslations(productId: string, product: any): Promise<any[]> {
    const results = [];

    for (const productKey of this.productsKeys) {
      try {
        const result = await this.createNewKeyWithTranslation(productId, productKey, product[productKey]);
        results.push(result);
      } catch (error) {
        console.error("Error creating key for:", productKey, error);
      }
    }

    return results;
  }

  async deleteProductTranslations(productId: string): Promise<void> {
    const productTranslationKeys = await this.getProductTranslationKeys(productId, true);

    if (productTranslationKeys.length === 0) {
      return;
    }

    try {
      const response = await tolgeeClient.delete(`${this.projectId}/keys/${productTranslationKeys}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product translations:", error);
      throw new Error(`Failed to delete product translations for product ${productId}: ${error.message}`);
    }
  }
}

export default TranslationManagementService;
