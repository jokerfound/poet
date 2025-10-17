<template>
  <div class="poetry-analysis-bot">
    <!-- 机器人头像 -->
    <div class="bot-avatar" @click="toggleChat">
      <div class="avatar-icon">🤖</div>
      <div class="status-indicator" :class="{ active: isOnline }"></div>
    </div>

    <!-- 聊天窗口 -->
    <div v-if="showChat" class="chat-window">
      <div class="chat-header">
        <h3>诗词赏析机器人</h3>
        <button class="close-btn" @click="toggleChat">×</button>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.type]">
          <div class="message-avatar">
            <span v-if="message.type === 'bot'">🤖</span>
            <span v-else>👤</span>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.text)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <div v-if="loading" class="message bot">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input-area">
        <div class="quick-actions">
          <button v-for="action in quickActions" :key="action.text"
                  @click="sendQuickAction(action)" class="quick-action-btn">
            {{ action.text }}
          </button>
        </div>
        
        <div class="input-container">
          <textarea v-model="inputText" @keydown.enter.prevent="sendMessage"
                   placeholder="请输入诗词内容或问题..." rows="2"></textarea>
          <button @click="sendMessage" :disabled="!inputText.trim() || loading" 
                  class="send-btn">
            {{ loading ? '发送中...' : '发送' }}
          </button>
        </div>
        
        <div class="analysis-types">
          <label v-for="type in analysisTypes" :key="type.value" class="type-option">
            <input type="radio" v-model="selectedAnalysisType" :value="type.value">
            {{ type.label }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { usePoetryAnalysis } from '@/services/poetryAnalysisService'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

const { loading, error, analyzePoetry, askQuestion } = usePoetryAnalysis()

// 响应式数据
const showChat = ref(false)
const inputText = ref('')
const messages = ref<ChatMessage[]>([])
const selectedAnalysisType = ref('comprehensive')
const isOnline = ref(true)

const messagesContainer = ref<HTMLElement>()

// 快速操作选项
const quickActions = ref([
  { text: '分析《静夜思》', action: 'analyze', content: '静夜思' },
  { text: '李白诗歌特点', action: 'question', content: '李白的诗歌有什么艺术特点？' },
  { text: '推荐唐诗', action: 'question', content: '推荐几首经典的唐诗' },
  { text: '诗词格律', action: 'question', content: '什么是诗词的格律？' }
])

// 分析类型选项
const analysisTypes = ref([
  { value: 'sentiment', label: '情感分析' },
  { value: 'artistic', label: '艺术手法' },
  { value: 'historical', label: '历史背景' },
  { value: 'comprehensive', label: '综合赏析' }
])

// 计算属性
const hasMessages = computed(() => messages.value.length > 0)

// 方法
const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim()) return

  const userMessage: ChatMessage = {
    id: generateId(),
    type: 'user',
    text: inputText.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const userInput = inputText.value
  inputText.value = ''

  await nextTick()
  scrollToBottom()

  // 发送到AI分析
  await sendToAnalysis(userInput)
}

const sendQuickAction = async (action: any) => {
  if (action.action === 'analyze') {
    inputText.value = action.content
    await sendMessage()
  } else if (action.action === 'question') {
    inputText.value = action.content
    await sendMessage()
  }
}

const sendToAnalysis = async (text: string) => {
  try {
    let response
    
    // 判断是诗词分析还是问题
    if (text.includes('？') || text.includes('?') || text.length < 20) {
      // 问题模式
      response = await askQuestion(text)
    } else {
      // 诗词分析模式
      response = await analyzePoetry({
        poemContent: text,
        analysisType: selectedAnalysisType.value as any
      })
    }

    if (response.success && response.data) {
      const botMessage: ChatMessage = {
        id: generateId(),
        type: 'bot',
        text: response.data.analysis,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
      
      await nextTick()
      scrollToBottom()
    } else {
      addErrorMessage(response.error || '分析失败，请重试')
    }
  } catch (err) {
    addErrorMessage('网络错误，请检查连接')
  }
}

const addErrorMessage = (errorText: string) => {
  const errorMessage: ChatMessage = {
    id: generateId(),
    type: 'bot',
    text: `❌ ${errorText}`,
    timestamp: new Date()
  }
  messages.value.push(errorMessage)
  
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatMessage = (text: string) => {
  // 简单的Markdown格式处理
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 初始化欢迎消息
onMounted(() => {
  const welcomeMessage: ChatMessage = {
    id: generateId(),
    type: 'bot',
    text: '您好！我是诗词赏析机器人 🤖\n\n我可以帮您：\n• 分析诗词的意境和情感\n• 解读艺术手法和创作背景\n• 解答诗词相关的疑问\n• 推荐相关经典作品\n\n请直接输入诗词内容或提问吧！',
    timestamp: new Date()
  }
  messages.value.push(welcomeMessage)
})
</script>

<style scoped>
.poetry-analysis-bot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.bot-avatar {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.bot-avatar:hover {
  transform: scale(1.1);
}

.avatar-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #e74c3c;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.active {
  background: #2ecc71;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 0 10px;
}

.message.user .message-avatar {
  background: #667eea;
  color: white;
}

.message.bot .message-avatar {
  background: #e9ecef;
  color: #495057;
}

.message-content {
  max-width: 70%;
  background: white;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 5px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  height: 20px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #667eea;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

.chat-input-area {
  border-top: 1px solid #e9ecef;
  background: white;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 10px;
  border-bottom: 1px solid #e9ecef;
}

.quick-action-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: #667eea;
  color: white;
}

.input-container {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.input-container textarea {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 10px 15px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
}

.input-container textarea:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.send-btn:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: #5a6fd8;
}

.analysis-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.type-option {
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
}

.type-option input {
  margin-right: 5px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

@media (max-width: 480px) {
  .chat-window {
    width: 300px;
    height: 400px;
  }
  
  .avatar-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>