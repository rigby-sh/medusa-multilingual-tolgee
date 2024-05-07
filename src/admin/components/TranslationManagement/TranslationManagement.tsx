import { useEffect, useState } from "react";
import {
  useAdminCustomQuery,
  useAdminCustomPost,
  useAdminCreateBatchJob,
} from "medusa-react";
import { Table, Select, Button } from "@medusajs/ui";
import formatKeyName from "../../utils/formatKeyName";
import { useTranslate } from "@tolgee/react";

import TranslationSyncStatus from "../TranslationSyncStatus";
import {
  Props,
  RequestQuery,
  ResponseData,
  TranslationRequest,
  TranslationResponse,
} from "./types";

const TranslationManagement = ({
  product,
  notify,
  availableLanguages,
  defaultLanguage,
  handleLanguageChange,
  refreshObserver,
  refreshKey
}: Props) => {
  const { t } = useTranslate(product.id);
  const [keyNames, setKeyNames] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [batchJobId, setBatchJobId] = useState<string | null>(null);
  const createBatchJob = useAdminCreateBatchJob();

  const postProductTranslations = useAdminCustomPost<
    TranslationRequest,
    TranslationResponse
  >(`/admin/product-translation?productId=${product.id}`, [
    "productTranslation",
  ]);

  const { data } = useAdminCustomQuery<RequestQuery, ResponseData>(
    "/admin/product-translation",
    ["keyNames", refreshKey],
    { productId: product.id }
  );

  useEffect(() => {
    if (data) {
      setKeyNames(data.keyNames);
    }
  }, [data]);

  const addProductTranslation = () => {
    setIsAdding(true);
    postProductTranslations.mutate(
      {
        product: product,
      },
      {
        onSuccess: () => {
          notify.success("success", "Product translations created.");
          setIsAdding(false);
          refreshObserver();
        },
        onError: (error) => {
          console.error("Failed to create product translations:", error);
          notify.error("error", "Failed to create product translations.");
          setIsAdding(false);
        },
      }
    );
  };

  const syncAllTranslations = () => {
    setIsSyncing(true);
    createBatchJob.mutate(
      {
        type: "translation-sync",
        context: {},
        dry_run: false,
      },
      {
        onSuccess: ({ batch_job }) => {
          notify.success(
            "success",
            "Translations sync confirmed and processing."
          );
          setBatchJobId(batch_job.id);
        },
        onError: (error) => {
          console.error("Failed to sync all translations:", error);
          notify.error("error", "Failed to sync translations.");
          setIsSyncing(false);
        },
      }
    );
  };

  const handleSyncStatus = (status: boolean) => {
    setIsSyncing(status);
    refreshObserver();
  };

  return (
    <div className="px-xlarge pt-large pb-xlarge rounded-rounded bg-grey-0 border-grey-20 border">
      <div className="flex items-center justify-between">
        <h1 className="text-grey-90 inter-xlarge-semibold">
          Translation management
        </h1>
        <div className="flex items-center gap-x-2"></div>
      </div>
      <div className="gap-y-xsmall mt-base flex flex-col overflow-hidden">
        {keyNames.length > 0 ? (
          <div>
            {" "}
            <div className="w-full mb-base">
              <div className="mb-base">
                <p className="inter-base-regular text-grey-50">
                  To translate a word, press the ALT button and click on the
                  word in the Value column.
                </p>
              </div>
              <div className="flex justify-between">
                <div className="inter-base-regular text-grey-50">
                  Select language
                </div>
                <div className="mr-1">
                  <Select
                    onValueChange={handleLanguageChange}
                    defaultValue={defaultLanguage}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select a language" />
                    </Select.Trigger>
                    <Select.Content>
                      {availableLanguages.map((item) => (
                        <Select.Item key={item.tag} value={item.tag}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
              </div>
            </div>
            <Table>
              <Table.Header>
                <Table.Row className="[&_td:first-child]:pl-0 [&_th:first-child]:pl-0">
                  <Table.HeaderCell className="pl-0">Key</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {keyNames.map((keyName) => (
                  <Table.Row
                    className="[&_td:first-child]:pl-0 [&_th:first-child]:pl-0"
                    key={keyName}
                  >
                    <Table.Cell>{formatKeyName(keyName)}</Table.Cell>
                    <Table.Cell className="flex items-center">
                      <div className="w-80 overflow-hidden">
                        <p className="truncate">
                          {t(
                            keyName,
                            "Not translated (press ALT + click the word)"
                          )}
                        </p>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>{" "}
          </div>
        ) : (
          <div className="gap-y-xsmall flex flex-col">
            <div>The product has no translations yet.</div>
            <div className="flex ml-1 mb-1">
              <Button
                variant="secondary"
                className="mt-base"
                onClick={() => addProductTranslation()}
                disabled={isAdding}
              >
                {isAdding ? "Loading..." : "Add product translations"}
              </Button>
              <Button
                variant="secondary"
                className="mt-base ml-2"
                onClick={() => syncAllTranslations()}
                disabled={isSyncing}
              >
                {isSyncing ? "Loading..." : "Sync all translations"}
              </Button>
              <div className="inter-small-regular text-grey-50 mt-base flex items-center ml-2">
                {batchJobId && (
                  <TranslationSyncStatus
                    batchJobId={batchJobId}
                    handleSyncStatus={handleSyncStatus}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationManagement;
