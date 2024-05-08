import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import TranslationManagementService from "../../../services/translation-management";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {

  const translationManagementService: TranslationManagementService =
    req.scope.resolve("translationManagementService");

  const defaultLanguage = translationManagementService.getDefaultLanguage();
  const availableLanguages =
    translationManagementService.getAvailableLanguages();

  res.json({
    defaultLanguage,
    availableLanguages,
  });
};
