import { useAdminBatchJob } from "medusa-react";
import { useState, useEffect } from "react";

const TranslationSyncStatus = ({ batchJobId, handleSyncStatus }) => {
  const { batch_job, isLoading } = useAdminBatchJob(batchJobId);
  const [syncStatus, setSyncStatus] = useState("Synchronization in progress...");

  useEffect(() => {
    if (batch_job && batch_job.status === "completed") {
      handleSyncStatus(false);
      setSyncStatus("Synchronization completed.");
    }
  }, [batch_job, isLoading]);

  return <>{syncStatus}</>;
};

export default TranslationSyncStatus;
