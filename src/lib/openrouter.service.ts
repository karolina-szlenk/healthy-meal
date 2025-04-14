import { z } from "zod";
import type {
  ErrorContext,
  OpenRouterAPIResponse,
  OpenRouterModelParameters,
  OpenRouterOptions,
  OpenRouterResponseFormat,
  ProcessedResponse,
  SchemaValue,
  ServiceConfiguration,
} from "./openrouter.types";

/**
 * Schemat dla walidacji odpowiedzi
 */
const defaultResponseSchemaValidator = z.object({
  message: z.string(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Serwis do integracji z OpenRouter API
 */
export class OpenRouterService {
  // Publiczne pola
  public apiEndpoint: string;
  public defaultModelName: string;
  public defaultParameters: OpenRouterModelParameters;
  public responseFormat: OpenRouterResponseFormat;

  // Prywatne pola
  private _apiKey: string;
  private _retryCount = 3;
  private _configurationCache: ServiceConfiguration = {};
  private _systemMessage: string;

  /**
   * Konstruktor serwisu OpenRouter
   * @param options Opcje konfiguracyjne
   */
  constructor(options?: OpenRouterOptions) {
    // Inicjalizacja z parametrów lub wartości domyślnych
    this._apiKey = options?.apiKey || import.meta.env.OPENROUTER_API_KEY || "";
    this.apiEndpoint = options?.apiEndpoint || "https://openrouter.ai/api/v1/chat/completions";
    this.defaultModelName = options?.defaultModelName || "openrouter-llm-v1";
    this.defaultParameters = {
      temperature: 0.7,
      top_p: 1,
      max_tokens: 150,
      ...options?.defaultParameters,
    };

    // Domyślny komunikat systemowy
    this._systemMessage =
      options?.systemMessage || "System: Inicjuję komunikację z OpenRouter API w celu uzupełnienia konwersacji.";

    // Konfiguracja formatu odpowiedzi
    this.responseFormat = options?.responseFormat || {
      type: "json_schema",
      json_schema: {
        name: "ChatResponse",
        strict: true,
        schema: {
          message: "string",
          metadata: "object",
        },
      },
    };

    // Walidacja klucza API
    if (!this._apiKey) {
      console.warn("OpenRouter API key is not provided. Service might not work properly.");
    }
  }

  /**
   * Wysyła wiadomość chat do OpenRouter API
   * @param message Wiadomość użytkownika
   * @param context Dodatkowy kontekst
   * @returns Odpowiedź z API
   */
  public async sendChatMessage(message: string, context?: Record<string, SchemaValue>): Promise<ProcessedResponse> {
    try {
      // Budowanie payloadu żądania
      const payload = this._buildRequestPayload(this._systemMessage, message, context);

      // Wysłanie żądania do API
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this._apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      // Sprawdzanie statusu odpowiedzi
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      // Obsługa odpowiedzi
      const rawResponse = (await response.json()) as OpenRouterAPIResponse;
      return this._handleResponse(rawResponse);
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Aktualizuje konfigurację serwisu
   * @param options Nowe opcje konfiguracyjne
   */
  public configureRouter(options: OpenRouterOptions): void {
    // Aktualizacja pól publicznych
    if (options.apiEndpoint) this.apiEndpoint = options.apiEndpoint;
    if (options.defaultModelName) this.defaultModelName = options.defaultModelName;
    if (options.defaultParameters) {
      this.defaultParameters = {
        ...this.defaultParameters,
        ...options.defaultParameters,
      };
    }
    if (options.responseFormat) this.responseFormat = options.responseFormat;

    // Aktualizacja pól prywatnych
    if (options.apiKey) this._apiKey = options.apiKey;
    if (options.systemMessage) this._systemMessage = options.systemMessage;

    // Resetowanie bufora konfiguracji
    this._configurationCache = {};
  }

  /**
   * Parsuje i waliduje odpowiedź API
   * @param response Surowa odpowiedź z API
   * @returns Zwalidowana odpowiedź
   */
  public parseLLMResponse(response: unknown): ProcessedResponse {
    try {
      // Jeśli mamy surową odpowiedź API, najpierw ją przetwarzamy
      if (
        response &&
        typeof response === "object" &&
        "choices" in response &&
        Array.isArray((response as any).choices)
      ) {
        response = this._handleResponse(response as OpenRouterAPIResponse);
      }

      // Walidacja odpowiedzi zgodnie ze schematem
      const parsedResponse = defaultResponseSchemaValidator.parse(response);
      return parsedResponse;
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error("Invalid response format"), { response });
      throw new Error("Failed to parse LLM response: invalid format");
    }
  }

  /**
   * Buduje payload żądania
   * @param systemMessage Komunikat systemowy
   * @param userMessage Komunikat użytkownika
   * @param extraContext Dodatkowy kontekst
   * @returns Przygotowany payload
   */
  private _buildRequestPayload(
    systemMessage: string,
    userMessage: string,
    extraContext?: Record<string, SchemaValue>
  ): Record<string, SchemaValue> {
    // Przygotowanie komunikatów
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ];

    // Dodanie kontekstu do payloadu
    const payload = {
      model: this.defaultModelName,
      messages,
      ...this.defaultParameters,
      response_format: this.responseFormat,
      ...extraContext,
    };

    // Zapisanie w buforze konfiguracji
    this._configurationCache.lastPayload = payload;

    return payload;
  }

  /**
   * Przetwarza surową odpowiedź z API
   * @param rawResponse Surowa odpowiedź z API
   * @returns Przetworzona odpowiedź
   */
  private _handleResponse(rawResponse: OpenRouterAPIResponse): ProcessedResponse {
    try {
      // Sprawdzenie, czy mamy dostępne wybory
      if (!rawResponse.choices || !rawResponse.choices.length) {
        throw new Error("No response choices available");
      }

      // Pobranie treści odpowiedzi
      const choice = rawResponse.choices[0];
      if (!choice.message || !choice.message.content) {
        throw new Error("Empty message content");
      }

      // Próba sparsowania JSON z treści
      try {
        const jsonContent = JSON.parse(choice.message.content);
        return jsonContent;
      } catch (_) {
        // Jeśli nie udało się sparsować, zwracamy tekst jako message
        return {
          message: choice.message.content,
          metadata: {
            model: rawResponse.model,
            usage: rawResponse.usage,
            finish_reason: choice.finish_reason,
          },
        };
      }
    } catch (error) {
      this._logError(error instanceof Error ? error : new Error("Failed to handle response"), { rawResponse });

      // Zwracamy awaryjną wersję odpowiedzi
      return {
        message: "Wystąpił problem podczas przetwarzania odpowiedzi.",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          raw_data: rawResponse,
        },
      };
    }
  }

  /**
   * Loguje błędy
   * @param error Obiekt błędu
   * @param context Kontekst błędu
   */
  private _logError(error: Error, context?: ErrorContext): void {
    console.error("OpenRouter Service Error:", error.message, {
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
