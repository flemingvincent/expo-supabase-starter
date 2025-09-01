interface CozeMessage {
	role: "user" | "assistant";
	content: string;
	timestamp?: string;
}

interface CozeStreamResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		index: number;
		delta: {
			content?: string;
			role?: string;
		};
		finish_reason: string | null;
	}[];
}

class CozeService {
	private apiKey: string;
	private botId: string;
	private apiEndpoint: string;

	constructor() {
		this.apiKey = process.env.EXPO_PUBLIC_COZE_API_KEY || "";
		this.botId = process.env.EXPO_PUBLIC_COZE_BOT_ID || "";
		this.apiEndpoint =
			process.env.EXPO_PUBLIC_COZE_API_ENDPOINT || "https://api.coze.com/v3";
	}

	async sendMessage(
		message: string,
		conversationId?: string,
		onStream?: (chunk: string) => void,
	): Promise<string> {
		try {
			const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					bot_id: this.botId,
					user_id: conversationId || "default_user",
					stream: !!onStream,
					messages: [
						{
							role: "user",
							content: message,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`Coze API error: ${response.statusText}`);
			}

			if (onStream && response.body) {
				return this.handleStreamResponse(response.body, onStream);
			} else {
				const data = await response.json();
				return data.choices[0]?.message?.content || "";
			}
		} catch (error) {
			console.error("Error sending message to Coze:", error);
			throw error;
		}
	}

	private async handleStreamResponse(
		body: ReadableStream<Uint8Array>,
		onStream: (chunk: string) => void,
	): Promise<string> {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		let fullResponse = "";

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const jsonStr = line.slice(6);
						if (jsonStr === "[DONE]") continue;

						try {
							const parsed: CozeStreamResponse = JSON.parse(jsonStr);
							const content = parsed.choices[0]?.delta?.content;
							if (content) {
								fullResponse += content;
								onStream(content);
							}
						} catch (e) {
							console.error("Error parsing stream chunk:", e);
						}
					}
				}
			}
		} finally {
			reader.releaseLock();
		}

		return fullResponse;
	}

	async createConversation(): Promise<string> {
		return `conversation_${Date.now()}`;
	}

	async getConversationHistory(conversationId: string): Promise<CozeMessage[]> {
		try {
			const response = await fetch(
				`${this.apiEndpoint}/conversations/${conversationId}/messages`,
				{
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch conversation history: ${response.statusText}`,
				);
			}

			const data = await response.json();
			return data.messages || [];
		} catch (error) {
			console.error("Error fetching conversation history:", error);
			return [];
		}
	}
}

export const cozeService = new CozeService();
export type { CozeMessage };
