import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import TranslationManagementService from "../../../../services/translation-management";
import type { ProductDetailsWidgetProps } from "@medusajs/admin";

type TranslationRequestBody = {
  product: Pick<ProductDetailsWidgetProps, "product">["product"];
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService =
    req.scope.resolve("translationManagementService");
  const { product_id } = req.params;

  const keyNames = await translationManagementService.getProductTranslationKeys(
    product_id
  );

  res.json({ keyNames });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService =
    req.scope.resolve("translationManagementService");
  const { product_id } = req.params;

  const { product } = req.body as TranslationRequestBody;

  const data = await translationManagementService.createProductTranslations(
    product_id,
    product
  );

  res.status(201).json(data);
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService =
    req.scope.resolve("translationManagementService");
  const { product_id } = req.params;

  const result = await translationManagementService.deleteProductTranslations(
    product_id
  );

  res.status(200).json(result);
};
