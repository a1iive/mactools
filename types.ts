
export interface WebTool {
  id: string;
  name: string;
  url: string;
  icon: string;
  openMode?: 'iframe' | 'window';
}

export enum ToolView {
  DASHBOARD = 'DASHBOARD',
  TIMESTAMP = 'TIMESTAMP',
  BASE_CONVERTER = 'BASE_CONVERTER',
  WEB_TOOLS = 'WEB_TOOLS',
  CALCULATOR = 'CALCULATOR',
  TRANSLATOR = 'TRANSLATOR',
  SETTINGS = 'SETTINGS'
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  OPENAI_COMPATIBLE = 'OPENAI_COMPATIBLE'
}

export interface AIConfig {
  provider: AIProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
}
