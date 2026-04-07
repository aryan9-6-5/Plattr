import { supabase } from "@/lib/supabaseClient";

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
  if (!config) return { name: "Unknown", subtitle: "", link: "#" };

  const { data } = await supabase
    .from(config.table)
    .select(`id, ${config.nameField}, ${config.subtitleField}`)
    .eq("id", sourceId)
    .single();

  return {
    name: (data as Record<string, string>)?.[config.nameField] || "Unknown",
    subtitle: (data as Record<string, string>)?.[config.subtitleField] || "",
    link: config.linkPrefix + sourceId,
  };
};
