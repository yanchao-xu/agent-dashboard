import { useState, useEffect } from "react";
import type { RestApi } from "../../icp-extension.types";
import { useI18n } from "../i18n";
import EChartRenderer from "./EChartRenderer";
import type { EChartSchema } from "./EChartRenderer";

interface Props {
  period: string;
  restApi?: RestApi;
}

interface SchemaResponse {
  schemaId: string;
  id: number;
  pbcId: number;
  name: string;
  description: string | null;
  schemaJson: string;
  contentVersion: string;
  currentUserPermission: unknown;
}

interface ParsedSchema {
  form: { title: string };
  fields: EChartSchema[];
}

const SCHEMA_URL = "/form/api/form-entity-page/get-by-schema-id/workbench-intelligence/custom-chart";

export default function BusinessTrendChart({ period, restApi }: Props) {
  const { t } = useI18n();
  const [chartSchemas, setChartSchemas] = useState<EChartSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restApi) {
      setLoading(false);
      return;
    }

    async function loadSchema() {
      try {
        const res: SchemaResponse = await restApi!.get(SCHEMA_URL);
        const parsed: ParsedSchema = JSON.parse(res.schemaJson);
        // Filter only EChart components
        const charts = (parsed.fields || []).filter(
          (field) => field.component === "EChart"
        );
        setChartSchemas(charts);
      } catch (err) {
        console.error("Failed to load chart schema:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSchema();
  }, [restApi]);

  return (
    <div className="ad-trend-panel">
      <div className="ad-trend-header">
        <h3 className="ad-section-title">{t("agent-dashboard>trend>title")}</h3>
        <span className="ad-period-badge">{period} ▾</span>
      </div>

      <div className="ad-trend-chart">
        {loading && <div className="ad-loading">加载中...</div>}
        {!loading && chartSchemas.length === 0 && (
          <div className="ad-empty">暂无图表配置</div>
        )}
        {chartSchemas.map((schema, index) => (
          <EChartRenderer
            key={index}
            schema={schema}
            restApi={restApi}
          />
        ))}
      </div>
    </div>
  );
}
