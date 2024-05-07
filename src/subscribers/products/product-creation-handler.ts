import {
  ProductService,
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/medusa";
import TranslationManagementService from "../../services/translation-management";

interface ProductCreationEventData {
  id: string;
}

export default async function productCreationHandler({
  data,
  container,
}: SubscriberArgs<ProductCreationEventData>) {
  const productService: ProductService = container.resolve("productService");
  const translationService: TranslationManagementService = container.resolve("translationManagementService");

  const { id } = data;

  try {
    const product = await productService.retrieve(id);

    if (product) {
      await translationService.createProductTranslations(product.id, product);
    } else {
      console.error("No product found with ID:", id);
    }
  } catch (error) {
    console.error("Error in product translation creation:", error);

    throw new Error(`Failed to create translations for product ${id}: ${error.message}`);
  }
}

export const config: SubscriberConfig = {
  event: ProductService.Events.CREATED,
  context: {
    subscriberId: "product-creation-handler",
  },
};
