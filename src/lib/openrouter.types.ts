/**
 * Typ dla danych, które mogą być użyte w schemacie odpowiedzi
 */
export type SchemaValue = string | number | boolean | null | SchemaObject | SchemaArray;

/**
 * Typ dla obiektu schematu
 */
export interface SchemaObject {
  [key: string]: SchemaValue;
}

/**
 * Typ dla tablicy schematu
 */
export type SchemaArray = SchemaValue[];

/**
 * Interfejs dla opcji konfiguracyjnych serwisu OpenRouter
 */
export interface OpenRouterOptions {
  apiKey?: string;
  apiEndpoint?: string;
  defaultModelName?: string;
  defaultParameters?: OpenRouterModelParameters;
  systemMessage?: string;
  responseFormat?: OpenRouterResponseFormat;
}

/**
 * Interfejs dla parametrów modelu
 */
export interface OpenRouterModelParameters {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Interfejs dla formatu odpowiedzi
 */
export interface OpenRouterResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, SchemaValue>;
  };
}

/**
 * Interfejs dla odpowiedzi API
 */
export interface OpenRouterAPIResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Interfejs dla przetworzonej odpowiedzi
 */
export interface ProcessedResponse {
  message: string;
  metadata?: Record<string, SchemaValue>;
}

/**
 * Interfejs dla konfiguracji serwisu
 */
export interface ServiceConfiguration {
  lastPayload?: Record<string, SchemaValue>;
  [key: string]: SchemaValue | undefined;
}

/**
 * Interfejs dla kontekstu błędu
 */
export interface ErrorContext {
  response?: unknown;
  rawResponse?: OpenRouterAPIResponse;
  [key: string]: unknown;
}
