import {
  ProductService,
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/medusa";
import TranslationManagementService from "../services/translation-management";

interface ProductCreationEventData {
  id: string;
}

export default async function productCreationHandler({
  data,
  container,
}: SubscriberArgs<ProductCreationEventData>) {
  const productService: ProductService = container.resolve("productService");
  const translationService: TranslationManagementService = container.resolve(
    "translationManagementService"
  );

  const { id } = data;

  const product = await productService.retrieve(id);

  await translationService.createProductTranslations(product.id, product);
}

export const config: SubscriberConfig = {
  event: ProductService.Events.CREATED,
  context: {
    subscriberId: "product-creation-handler",
  },
};
