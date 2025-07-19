import { env } from '../env';
import type {
    Content,
    CreateContentRequest,
    UpdateContentRequest,
    AIServiceRequest,
    SummaryResponse,
    QuizResponse,
    CategorizeResponse,
    ApiResponse,
} from '../types/content';

const API_BASE = env.VITE_API_URL;

// Helper function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authenticatedFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    return fetch(url, {
        ...options,
        headers,
    });
};

// Content Management API
export const contentApi = {
    // Get all content for the current user
    async getAllContent(): Promise<ApiResponse<Content[]>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content`);
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch content',
            };
        }
    },

    // Get content by ID
    async getContentById(id: string): Promise<ApiResponse<Content>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${id}`);
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch content',
            };
        }
    },

    // Create new content
    async createContent(data: CreateContentRequest): Promise<ApiResponse<Content>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to create content',
            };
        }
    },

    // Update content
    async updateContent(id: string, data: UpdateContentRequest): Promise<ApiResponse<Content>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update content',
            };
        }
    },

    // Delete content
    async deleteContent(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to delete content',
            };
        }
    },

    // Generate content with AI
    async generateContent(data: AIServiceRequest): Promise<ApiResponse<any>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/generate`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log("API Response:", result); // Debug log

            // Parse the JSON string from the content field if it exists
            if (result.success && result.data && result.data.content) {
                try {
                    // Remove markdown code block markers and parse JSON
                    const jsonString = result.data.content.replace(/```json\n?|\n?```/g, '');
                    const parsedData = JSON.parse(jsonString);
                    return {
                        ...result,
                        data: parsedData
                    };
                } catch (parseError) {
                    console.error("Failed to parse AI response:", parseError);
                    return {
                        success: false,
                        error: 'Failed to parse AI response',
                    };
                }
            }

            return result;
        } catch (error) {
            console.error("API Error:", error); // Debug log
            return {
                success: false,
                error: 'Failed to generate content',
            };
        }
    },

    // Generate summary for existing content
    async generateSummary(contentId: string): Promise<ApiResponse<SummaryResponse>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${contentId}/summary`, {
                method: 'POST',
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to generate summary',
            };
        }
    },

    // Generate quiz for existing content
    async generateQuiz(contentId: string): Promise<ApiResponse<QuizResponse>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${contentId}/quiz`, {
                method: 'POST',
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to generate quiz',
            };
        }
    },

    // Categorize existing content
    async categorizeContent(contentId: string): Promise<ApiResponse<CategorizeResponse>> {
        try {
            const response = await authenticatedFetch(`${API_BASE}/api/content/${contentId}/categorize`, {
                method: 'POST',
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                error: 'Failed to categorize content',
            };
        }
    },
}; 