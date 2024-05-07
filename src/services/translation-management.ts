import {
  TransactionBaseService,
  MedusaContainer,
  Product,
} from "@medusajs/medusa";
import { AxiosInstance, default as axios } from "axios";
import { MedusaError } from "@medusajs/utils";

type Language = {
  label: string;
  tag: string;
};

type MutlilingualTolgeeConfig = {
  defaultLanguage?: string;
  availableLanguages?: Language[];
  productsKeys?: string[];
  projectId?: string;
  apiKey: string;
};

const TOLGEE_BASE_URL = "https://app.tolgee.io/v2/projects/";

class TranslationManagementService extends TransactionBaseService {
  protected client_: AxiosInstance;
  readonly options_: MutlilingualTolgeeConfig;

  constructor(container: MedusaContainer, options: MutlilingualTolgeeConfig) {
    super(container);

    this.client_ = axios.create({
      baseURL: `${TOLGEE_BASE_URL}/${options.projectId}`,
      headers: {
        Accept: "application/json",
        "X-API-Key": options.apiKey,
      },
      maxBodyLength: Infinity,
    });

    this.options_ = {
      ...options,
      defaultLanguage: options.defaultLanguage ?? "en",
      availableLanguages: options.availableLanguages ?? [
        { label: "English", tag: "en" },
      ],
      productsKeys: options.productsKeys ?? [
        "title",
        "subtitle",
        "description",
      ],
    };
  }

  getDefaultLanguage() {
    return this.options_.defaultLanguage;
  }

  getAvailableLanguages() {
    return this.options_.availableLanguages;
  }

  async getNamespaceKeys(productId: string): Promise<string[]> {
    try {
      const response = await this.client_.get(
        `/keys/select?filterNamespace=${productId}`
      );

      return response.data.ids;
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to fetch namespace keys for product ${productId}: ${error.message}`
      );
    }
  }

  async getKeyName(keyId: string): Promise<string> {
    try {
      const response = await this.client_.get(`/keys/${keyId}`);

      return response.data.name;
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to fetch key name for key ID ${keyId}: ${error.message}`
      );
    }
  }

  async getProductTranslationKeys(
    productId: string
  ): Promise<string[] | any[]> {
    const ids = await this.getNamespaceKeys(productId);

    return await Promise.all(ids.map((keyId) => this.getKeyName(keyId)));
  }

  async createNewKeyWithTranslation(
    productId: string,
    keyName: string,
    translation: string
  ): Promise<any> {
    try {
      const response = await this.client_.post(`/keys`, {
        name: `${productId}.${keyName}`,
        namespace: productId,
        translations: { [this.options_.defaultLanguage]: translation },
      });

      return response.data;
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create new key with translation for ${keyName}: ${error.message}`
      );
    }
  }

  async createProductTranslations(
    productId: string,
    product: Product
  ): Promise<any[]> {
    const results = [];

    try {
      for (const productKey of this.options_.productsKeys) {
        const result = await this.createNewKeyWithTranslation(
          productId,
          productKey,
          product[productKey]
        );
        results.push(result);
      }
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to create translations for product ${productId}: ${error.message}`
      );
    }

    return results;
  }

  async deleteProductTranslations(productId: string): Promise<void> {
    const productTranslationKeys = await this.getNamespaceKeys(productId);

    try {
      const response = await this.client_.delete(
        `/keys/${productTranslationKeys}`
      );

      return response.data;
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to delete product translations for product ${productId}: ${error.message}`
      );
    }
  }
}

export default TranslationManagementService;
