import apiClient from './apiClient';

export const journalService = {
  // ✅ Start a new conversational journal session
  startConversation: async () => {
    try {
      const response = await apiClient.post('/api/v2/journal/journal/conversation', {
        user_input: "",
      });
      return response.data;
    } catch (error) {
      console.error('Start conversation error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Continue journal conversation by sending user input
  sendMessage: async (userInput = "") => {
    try {
      const response = await apiClient.post('/api/v2/journal/journal/conversation', {
        user_input: userInput,
      });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Get journal entry by specific date (for editing)
  getJournalByDate: async (date) => {
    try {
      console.log('🔍 Service: Fetching journal for date:', date);
      const response = await apiClient.get(`/api/v2/journal/journal/by-day?date=${date}`);
      
      console.log('🔍 Service: Backend response:', response.data);
      
      // If there are journal entries for this date, return the first one (most recent)
      if (response.data && response.data.entries && response.data.entries.length > 0) {
        console.log('🔍 Service: Found entries:', response.data.entries.length);
        
        const journalEntry = response.data.entries[0];
        console.log('🔍 Service: First entry:', journalEntry);
        console.log('🔍 Service: Entry type:', journalEntry.entry_type || journalEntry.type);
        
        // Check if this is a conversational journal entry OR handle any entry type
        if (journalEntry.entry_type === 'conversation' || journalEntry.type === 'conversation' || journalEntry.chat_data) {
          // Since backend doesn't store individual messages, we need to reconstruct them
          // from the stored data
          const reconstructedMessages = [];
          
          // Add welcome message
          reconstructedMessages.push({
            id: 1,
            text: "Hey! Let's review your previous journal entry.",
            sender: 'ai',
            timestamp: journalEntry.created_at || journalEntry.timestamp ? 
              new Date(journalEntry.created_at || journalEntry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }) : new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
          });

          // If we have chat_data with messages, use those
          if (journalEntry.chat_data && journalEntry.chat_data.messages) {
            console.log('🔍 Service: Using existing chat messages');
            journalEntry.chat_data.messages.forEach((msg, index) => {
              reconstructedMessages.push({
                id: index + 2,
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp || new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                step: msg.step,
              });
            });
          } else {
            // Reconstruct from individual fields
            console.log('🔍 Service: Reconstructing from fields');
            let messageId = 2;
            
            // Helper function to generate consistent timestamps
            const getTimestamp = () => {
              return journalEntry.created_at || journalEntry.timestamp ? 
                new Date(journalEntry.created_at || journalEntry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }) : new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
            };
            
            // Mood question and answer
            if (journalEntry.mood) {
              reconstructedMessages.push({
                id: messageId++,
                text: "👋 Hello! How are you feeling today? Select a mood: 😄 😊 😐 😢 😡 🥱",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 0,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.mood,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }

            // Food intake
            if (journalEntry.food_intake) {
              reconstructedMessages.push({
                id: messageId++,
                text: "How satisfied were you with your meals today?",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 1,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.food_intake,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }

            // Personal
            if (journalEntry.personal) {
              reconstructedMessages.push({
                id: messageId++,
                text: "Did anything make you smile today?",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 2,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.personal,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }

            // Work or study
            if (journalEntry.work_or_study) {
              reconstructedMessages.push({
                id: messageId++,
                text: "How did your work or studies go?",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 3,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.work_or_study,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }

            // Sleep
            if (journalEntry.sleep) {
              reconstructedMessages.push({
                id: messageId++,
                text: "How did you sleep last night?",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 4,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.sleep,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }

            // Extra notes
            if (journalEntry.extra_note) {
              reconstructedMessages.push({
                id: messageId++,
                text: "Is there anything else you'd like to share?",
                sender: 'ai',
                timestamp: getTimestamp(),
                step: 5,
              });
              
              reconstructedMessages.push({
                id: messageId++,
                text: journalEntry.extra_note,
                sender: 'user',
                timestamp: getTimestamp(),
              });
            }
          }

          console.log('🔍 Service: Reconstructed messages:', reconstructedMessages.length);
          
          return {
            conversationId: journalEntry._id,
            messages: reconstructedMessages,
            currentStep: 5, // Conversation was completed
            isCompleted: true,
            journalData: journalEntry
          };
        } else {
          console.log('🔍 Service: Not a conversation entry, entry_type:', journalEntry.entry_type || journalEntry.type);
        }
      }
      
      // If no conversational journal found for this date, return null
      return null;
    } catch (error) {
      console.error('Get journal by date error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Patch/update a previously saved conversational journal entry
  updateConversationJournal: async (updateData) => {
    try {
      const response = await apiClient.patch('/api/v2/journal/journal/conversation', {
        journal_id: updateData.journal_id,
        mood: updateData.mood,
        food_intake: updateData.food_intake,
        personal: updateData.personal,
        work_or_study: updateData.work_or_study,
        sleep: updateData.sleep,
        extra_note: updateData.extra_note,
      });
      return response.data;
    } catch (error) {
      console.error('Update conversation journal error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Get monthly journal summary
  getMonthlySummary: async () => {
    try {
      const response = await apiClient.get('/api/v2/journal/journal/summary/month');
      return response.data;
    } catch (error) {
      console.error('Monthly summary error:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Get journal entries for a specific day (e.g. for calendar view)
  getJournalsByDay: async (date) => {
    try {
      const response = await apiClient.get(`/api/v2/journal/journal/by-day?date=${date}`)
      return response.data.entries; // Return just the entries array
    } catch (error) {
      console.error('Get journals by day error:', error.response?.data || error.message);
      throw error;
    }
  }
};