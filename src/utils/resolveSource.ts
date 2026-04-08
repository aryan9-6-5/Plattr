import { supabase } from "@/lib/supabaseClient";
import { logger } from "./logger";

export type SourceInfo = {
  name: string;
  subtitle: string;
  link: string;
};

const tableMap: Record<
  string,
  { table: string; nameField: string; subtitleField: string; linkPrefix: string }
> = {
  HOME_CHEF: {
    table: "chefs",
    nameField: "name",
    subtitleField: "specialty",
    linkPrefix: "/chefs/",
  },
  CLOUD_KITCHEN: {
    table: "kitchens",
    nameField: "name",
    subtitleField: "city",
    linkPrefix: "/kitchens/",
  },
  RESTAURANT: {
    table: "restaurants",
    nameField: "name",
    subtitleField: "brand",
    linkPrefix: "/restaurants/",
  },
};

export const resolveSourceName = async (
  sourceType: string,
  sourceId: string
): Promise<SourceInfo> => {
  const config = tableMap[sourceType];
  if (!config) {
    logger.warn(`Attempted to resolve unknown source type: ${sourceType}`);
    return { name: "Unknown", subtitle: "", link: "#" };
  }

  try {
    const { data, error } = await supabase
      .from(config.table)
      .select(`id, ${config.nameField}, ${config.subtitleField}`)
      .eq("id", sourceId)
      .maybeSingle();

    if (error) {
      logger.error(`Database error resolving source ${sourceType}:${sourceId}`, error);
      return { name: "Error", subtitle: "Source lookup failed", link: "#" };
    }

    if (!data) {
      logger.warn(`No source found for ${sourceType} with ID ${sourceId}`);
      return { name: "Not Found", subtitle: "", link: "#" };
    }

    const name = (data as Record<string, unknown>)[config.nameField] as string || "Unknown";
    const subtitle = (data as Record<string, unknown>)[config.subtitleField] as string || "";

    return {
      name,
      subtitle,
      link: config.linkPrefix + sourceId,
    };
  } catch (err) {
    logger.error(`Critical failure in resolveSourceName`, err);
    return { name: "System Error", subtitle: "", link: "#" };
  }
};
