import type { ProductDetailsWidgetProps } from "@medusajs/admin";

export interface Language {
  label: string;
  tag: string;
};

export interface Props extends ProductDetailsWidgetProps {
  availableLanguages: Language[];
  defaultLanguage: string;
  handleLanguageChange: (lang: string) => void;
  refreshObserver: () => void;
  refreshKey: boolean;
};

export interface RequestQuery {
  productId: string;
};

export interface ResponseData {
  keyNames: string[];
};

export interface TranslationRequest {
  product: Pick<ProductDetailsWidgetProps, 'product'>['product'];
}

export interface TranslationResponse {
  message: string;
  data: any;
}
