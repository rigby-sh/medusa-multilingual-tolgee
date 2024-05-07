import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import TranslationManagementService from "../../../services/translation-management";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const translationManagementService: TranslationManagementService = req.scope.resolve("translationManagementService");

  try {
    const defaultLanguage = await translationManagementService.getDefaultLanguage();
    const availableLanguages = await translationManagementService.getAvailableLanguages();

    res.json({
      defaultLanguage,
      availableLanguages
    });
  } catch (error) {
    console.error("Error retrieving multilingual options:", error);
    res.status(500).json({
      message: "Failed to retrieve options",
      error: error.message,
    });
  }
};
