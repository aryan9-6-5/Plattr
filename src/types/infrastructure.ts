export interface ServicePipeline {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  img_src: string;
  bg_class: string;
  is_full_bleed: boolean;
  display_order: number;
}

export interface ComboPack {
  id: string;
  name: string;
  diet_type: string;
  price: number;
  image_url: string;
  items: string[];
  display_order: number;
}

export interface SnackPack {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  diet_type: string;
  tags?: string[];
  serves: string;
}

export interface ServiceConfig {
  id: string;
  config_type: string;
  key: string;
  label: string;
  value: unknown;
}

export interface TrayValue {
  slots: number;
  imgSrc?: string;
}
