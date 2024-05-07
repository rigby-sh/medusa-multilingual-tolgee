import {
  ProductService,
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/medusa";
import TranslationManagementService from "../../services/translation-management";

interface ProductDeletionEventData {
  id: string;
}

export default async function productDeletionHandler({
  data,
  container,
}: SubscriberArgs<ProductDeletionEventData>) {
  const translationService: TranslationManagementService = container.resolve("translationManagementService");
  const { id } = data;

  try {
    await translationService.deleteProductTranslations(id);
  } catch (error) {
    console.error("Error in product translation deletion:", error);
    throw new Error(`Failed to delete translations for product ${id}: ${error.message}`);
  }
}

export const config: SubscriberConfig = {
  event: ProductService.Events.DELETED,
  context: {
    subscriberId: "product-deletion-handler",
  },
};
