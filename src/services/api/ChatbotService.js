import apiClient from './apiClient';

class ChatbotService {
  /**
   * Send a message to the advanced chatbot and get AI response
   * @param {Object} chatRequest - The chat request object
   * @param {string} chatRequest.question - The user's question
   * @param {string[]} [chatRequest.tags] - Optional tags for categorization
   * @param {string} [chatRequest.context] - Optional context information
   * @param {string} [chatRequest.date] - Optional specific date
   * @param {string} [chatRequest.start_date] - Optional start date for range queries
   * @param {string} [chatRequest.end_date] - Optional end date for range queries
   * @param {string} [chatRequest.conversation_id] - Optional conversation ID
   * @returns {Promise<Object>} Chat response with AI reply and conversation history
   */
  async sendMessage(chatRequest) {
    try {
      console.log('📤 Sending advanced chat request:', chatRequest);
      
      const response = await apiClient.post('/api/v2/adv_chat/chat/ask', chatRequest);
      
      console.log('📥 Advanced chat response received:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Advanced Chat API error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Authentication failed. Please log in again.',
          code: 'AUTH_ERROR'
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data?.detail || 'Invalid request. Please check your input.',
          code: 'VALIDATION_ERROR'
        };
      } else if (error.response?.status >= 500) {
        return {
          success: false,
          error: 'Server error. Please try again later.',
          code: 'SERVER_ERROR'
        };
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          error: 'Something went wrong. Please try again.',
          code: 'UNKNOWN_ERROR'
        };
      }
    }
  }

  /**
   * Get conversation history for the user
   * @param {number} [limit=6] - Number of recent messages to fetch
   * @returns {Promise<Object>} Conversation history
   */
  async getConversationHistory(limit = 6) {
    try {
      console.log('📤 Fetching advanced chat conversation history...');
      
      const response = await apiClient.get(`/api/v2/adv_chat/chat/history/?limit=${limit}`);
      
      console.log('📥 Advanced chat history received:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Advanced chat history fetch error:', error);
      
      return {
        success: false,
        error: 'Failed to load conversation history.',
        code: 'HISTORY_ERROR'
      };
    }
  }

  /**
   * Get list of all conversations for the user
   * @returns {Promise<Object>} List of conversations
   */
  async getConversationList() {
    try {
      console.log('📤 Fetching advanced chat conversation list...');
      
      const response = await apiClient.get('/api/v2/adv_chat/chat/conversations');
      
      console.log('📥 Advanced chat conversations received:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Advanced chat conversations fetch error:', error);
      
      return {
        success: false,
        error: 'Failed to load conversations.',
        code: 'CONVERSATIONS_ERROR'
      };
    }
  }

  /**
   * Debug endpoint to test advanced chat queries and see raw results
   * @param {Object} chatRequest - The chat request object
   * @returns {Promise<Object>} Debug information including raw queries and results
   */
  async debugChatQuery(chatRequest) {
    try {
      console.log('🔍 Sending debug advanced chat request:', chatRequest);
      
      const response = await apiClient.post('/api/v2/adv_chat/chat/debug', chatRequest);
      
      console.log('🔍 Debug advanced chat response received:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Debug advanced chat error:', error);
      
      return {
        success: false,
        error: 'Debug request failed.',
        code: 'DEBUG_ERROR'
      };
    }
  }

  /**
   * Create a properly formatted chat request object
   * @param {string} question - The user's question
   * @param {Object} [options] - Additional options
   * @param {string[]} [options.tags] - Tags for categorization
   * @param {string} [options.context] - Context information
   * @param {string} [options.date] - Specific date
   * @param {string} [options.start_date] - Start date for range queries
   * @param {string} [options.end_date] - End date for range queries
   * @param {string} [options.conversation_id] - Conversation ID
   * @returns {Object} Formatted chat request
   */
  createChatRequest(question, options = {}) {
    const request = {
      question: question.trim(),
      tags: options.tags || ['general', 'user_input'],
      context: options.context || 'user_query',
      date: options.date || new Date().toISOString(),
      start_date: options.start_date || null,
      end_date: options.end_date || null,
      conversation_id: options.conversation_id || null
    };

    // Remove null values to keep request clean
    Object.keys(request).forEach(key => {
      if (request[key] === null) {
        delete request[key];
      }
    });

    return request;
  }

  /**
   * Generate fallback response when API is unavailable
   * @param {string} question - The user's question
   * @returns {Object} Fallback response object
   */
  generateFallbackResponse(question) {
    const fallbackResponses = [
      "I'm currently having trouble connecting to my advanced health analysis system. However, I'd be happy to help you with general health and wellness questions once the connection is restored.",
      "It seems I'm experiencing some connectivity issues with my health data processing. For urgent health concerns, please consult with a healthcare professional.",
      "I'm temporarily unable to access my full health analysis capabilities. You can try asking your question again in a moment, or reach out to a healthcare provider for immediate assistance.",
      "My advanced health monitoring services are currently limited due to connectivity issues. I recommend consulting with a healthcare professional for personalized advice about your health concerns.",
      "I can't access your personal health data right now due to connection issues. For general health questions, I'll do my best to help when the connection is restored."
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      reply: randomResponse,
      history: [],
      conversation_id: `fallback_${Date.now()}`,
      query_type: 'fallback',
      data_sources: [],
      isFallback: true
    };
  }

  /**
   * Process chat response and format it for the UI
   * @param {Object} response - Raw API response
   * @param {string} userQuestion - The original user question
   * @returns {Object} Formatted response for UI
   */
  formatChatResponse(response, userQuestion) {
    if (!response.success) {
      return {
        success: false,
        message: {
          id: `error_${Date.now()}`,
          text: response.error,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isError: true,
          context: 'error_response',
          tags: ['error'],
          conversation_id: null,
          date: new Date().toISOString(),
        }
      };
    }

    const data = response.data;
    
    return {
      success: true,
      message: {
        id: `ai_${Date.now()}`,
        text: data.reply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        context: 'ai_response',
        tags: ['ai_generated', data.query_type],
        conversation_id: data.conversation_id,
        date: new Date().toISOString(),
        query_type: data.query_type,
        data_sources: data.data_sources,
        isFallback: data.query_type === 'fallback'
      },
      conversation_id: data.conversation_id,
      history: data.history
    };
  }
}

// Export singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;