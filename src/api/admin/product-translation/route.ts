import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import TranslationManagementService from "../../../services/translation-management";
import type { ProductDetailsWidgetProps } from "@medusajs/admin";

type TranslationRequestBody = {
  product: Pick<ProductDetailsWidgetProps, 'product'>['product'];
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService = req.scope.resolve("translationManagementService");
  const productId = req.query.productId as string;

  if (!productId) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  try {
    const keyNames = await translationManagementService.getProductTranslationKeys(productId);
    res.json({ keyNames });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve namespace",
      error: error.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService = req.scope.resolve("translationManagementService");
  const productId = req.query.productId as string;
  const { product } = req.body as TranslationRequestBody;

  if (!productId || !product || Object.keys(product).length === 0) {
    return res.status(400).json({
      message: "Invalid or missing product data",
    });
  }

  try {
    const response = await translationManagementService.createProductTranslations(productId, product);
    res.status(201).json({
      message: "Product translations created successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error creating product translations:", error);
    res.status(500).json({
      message: "Failed to create product translations",
      error: error.message,
    });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService = req.scope.resolve("translationManagementService");
  const productId = req.query.productId as string;

  if (!productId) {
    return res.status(400).json({
      message: "Invalid or missing productId",
    });
  }

  try {
    const deletionResult = await translationManagementService.deleteProductTranslations(productId);

    if (deletionResult === undefined) { 
      return res.status(404).json({
        message: "No translations found to delete.",
      });
    }

    res.status(200).json({
      message: "Product translations deleted successfully",
      data: deletionResult,
    });
  } catch (error) {
    console.error("Error deleting product translations:", error);
    res.status(500).json({
      message: "Failed to delete product translations",
      error: error.message,
    });
  }
};
