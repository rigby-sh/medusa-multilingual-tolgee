import {
  AbstractBatchJobStrategy,
  BatchJobService,
  ProductService,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import TranslationManagementService from "../services/translation-management";

class TranslationSyncStrategy extends AbstractBatchJobStrategy {
  static identifier = "translation-sync-strategy";
  static batchType = "translation-sync";

  protected batchJobService_: BatchJobService;
  protected productService_: ProductService;
  protected translationService_: TranslationManagementService;
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;

  constructor({productService, translationManagementService, manager, batchJobService }) {
    super(arguments[0]);
    this.productService_ = productService;
    this.batchJobService_ = batchJobService;
    this.translationService_ = translationManagementService;
    this.manager_ = manager;
  }

  async processJob(batchJobId: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager) => {
        const productList = await this.productService_
          .withTransaction(transactionManager)
          .list({});

        for (const product of productList) {
          console.log(`Creating translations for product ${product.id}`);
          await this.translationService_.createProductTranslations(product.id, product);
        }
          
        await this.batchJobService_
          .withTransaction(transactionManager)
          .update(batchJobId, {
            result: {
              advancement_count: productList.length,
            },
          });
      }
    );
  }

  async buildTemplate(): Promise<string> {
    return "";
  }
}

export default TranslationSyncStrategy;
