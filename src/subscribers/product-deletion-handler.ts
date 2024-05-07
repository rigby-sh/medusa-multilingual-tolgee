import {
  ProductService,
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/medusa";
import TranslationManagementService from "../services/translation-management";

interface ProductDeletionEventData {
  id: string;
}

export default async function productDeletionHandler({
  data,
  container,
}: SubscriberArgs<ProductDeletionEventData>) {
  const translationService: TranslationManagementService = container.resolve(
    "translationManagementService"
  );
  const { id } = data;

  await translationService.deleteProductTranslations(id);
}

export const config: SubscriberConfig = {
  event: ProductService.Events.DELETED,
  context: {
    subscriberId: "product-deletion-handler",
  },
};
