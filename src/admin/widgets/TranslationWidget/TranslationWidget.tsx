import { useEffect, useState } from "react";
import type { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";
import { useAdminCustomQuery } from "medusa-react";
import { Tolgee, TolgeeProvider, FormatSimple } from "@tolgee/react";
import { InContextTools } from "@tolgee/web/tools";

import TranslationManagement from "../../components/TranslationManagement";

interface Language {
  label: string;
  tag: string;
}

export interface ResponseData {
  defaultLanguage: string;
  availableLanguages: Language[];
}

const TranslationWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
  const [tolgee, setTolgee] = useState(null);
  const [refreshKey, setRefreshKey] = useState(false);

  const { data } = useAdminCustomQuery<undefined, ResponseData>(
    "/admin/multilingual-options",
    ["defaultLanguage", "availableLanguages"]
  );

  useEffect(() => {
    if (data && !tolgee) {
      const languages = data.availableLanguages.map((lang) => lang.tag);

      const tolgeeInstance = Tolgee()
        .use(FormatSimple())
        .init({
          language: data.defaultLanguage,
          apiUrl: process.env.MEDUSA_ADMIN_TOLGEE_API_URL,
          apiKey: process.env.MEDUSA_ADMIN_TOLGEE_API_KEY,
          availableLanguages: languages,
          observerOptions: {
            highlightColor: "rgba(0,0,0,0.7)",
          },
        });

      tolgeeInstance.addPlugin(InContextTools());
      setTolgee(tolgeeInstance);
    }
  }, [data]);

  const handleLanguageChange = async (lang: string) => {
    if (tolgee) {
      await tolgee.changeLanguage(lang);
    }
  };

  const refreshObserver = () => {
    setRefreshKey(!refreshKey);
    tolgee.addPlugin(InContextTools());
  };

  return (
    <>
      {tolgee ? (
        <TolgeeProvider tolgee={tolgee} fallback="Loading...">
          <TranslationManagement
            product={product}
            notify={notify}
            availableLanguages={data?.availableLanguages || []}
            defaultLanguage={data?.defaultLanguage || "en"}
            handleLanguageChange={handleLanguageChange}
            refreshObserver={refreshObserver}
            refreshKey={refreshKey}
          />
        </TolgeeProvider>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default TranslationWidget;
