<template>
  <!-- 悬浮AI聊天助手 -->
  <div v-if="showAssistant" class="ai-assistant">
    <div class="assistant-header">
      <h3>诗词AI助手</h3>
      <button class="close-btn" @click="hideAssistant">×</button>
    </div>
    
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.type]">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
      
      <div class="input-area">
        <input v-model="userInput" 
               @keyup.enter="sendMessage"
               placeholder="输入诗词问题或需要赏析的诗词..."
               class="message-input" />
        <button @click="sendMessage" class="send-btn">发送</button>
      </div>
    </div>
  </div>
  
  <!-- 悬浮按钮 -->
  <div v-if="!showAssistant" class="floating-btn" @click="showAssistant = true">
    <span class="ai-icon">🤖</span>
    <span class="ai-text">AI助手</span>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const showAssistant = ref(false)
const userInput = ref('')
const messages = ref([])
const messagesContainer = ref(null)

// 初始化欢迎消息
const initWelcomeMessage = () => {
  const welcomeMessage = {
    id: Date.now(),
    type: 'assistant',
    content: '您好！我是诗词AI助手，可以帮您：\n• 赏析古诗词意境和情感\n• 解释诗词中的典故和修辞\n• 推荐相关诗词作品\n• 解答诗词学习中的疑问\n\n请告诉我您想了解哪首诗词？',
    time: getCurrentTime()
  }
  messages.value.push(welcomeMessage)
}

// 获取当前时间
const getCurrentTime = () => {
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim()) return
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: userInput.value,
    time: getCurrentTime()
  }
  messages.value.push(userMessage)
  
  const question = userInput.value
  userInput.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 模拟AI回复
  setTimeout(() => {
    const aiResponse = generateAIResponse(question)
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: aiResponse,
      time: getCurrentTime()
    }
    messages.value.push(assistantMessage)
    scrollToBottom()
  }, 1000)
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 生成AI回复（模拟）
const generateAIResponse = (question) => {
  const responses = {
    // 常见诗词问题
    '静夜思': `《静夜思》是唐代诗人李白的代表作之一，赏析要点：

🌙 意境分析：
• 通过"床前明月光"营造宁静的夜晚氛围
• "疑是地上霜"运用比喻，月光如霜般清冷
• "举头望明月，低头思故乡"展现思乡之情

📝 艺术特色：
• 语言朴素自然，意境深远
• 运用对比手法（举头/低头）
• 情感真挚，引发共鸣

💡 文化内涵：
• 体现了中国人对明月的特殊情感
• 表达了游子思乡的普遍情感`,

    '李白': `李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。

🎨 诗歌特色：
• 想象丰富，意境奇特
• 语言豪放飘逸，气势磅礴
• 善于运用夸张、比喻等修辞手法

📚 代表作品：
• 《将进酒》："君不见黄河之水天上来"
• 《蜀道难》："噫吁嚱，危乎高哉"
• 《望庐山瀑布》："飞流直下三千尺"

🌟 文学地位：
李白与杜甫并称"李杜"，其诗歌对后世影响深远。`,

    '唐诗': `唐诗是中国古典诗歌的巅峰，具有以下特点：

📖 发展历程：
• 初唐：王勃、杨炯等
• 盛唐：李白、杜甫、王维等
• 中唐：白居易、韩愈等
• 晚唐：李商隐、杜牧等

🎭 诗歌体裁：
• 古体诗：形式自由，不限句数
• 近体诗：格律严谨，包括律诗、绝句
• 乐府诗：可配乐歌唱

🌿 艺术成就：
• 题材广泛，内容丰富
• 形式多样，技巧成熟
• 意境深远，情感真挚`,

    'default': `感谢您的提问！关于"${question}"，我可以从以下几个角度为您分析：

1. **诗词背景**：创作时代、作者生平
2. **意境赏析**：诗歌营造的画面和氛围
3. **艺术手法**：修辞技巧、语言特色
4. **情感表达**：诗人想要传达的情感
5. **文化内涵**：诗词反映的社会文化

如果您有具体的诗词作品，我可以提供更详细的分析。或者您也可以告诉我您想了解哪方面的诗词知识？`
  }

  return responses[question] || responses.default
}

// 隐藏助手
const hideAssistant = () => {
  showAssistant.value = false
}

// 组件挂载时初始化
onMounted(() => {
  initWelcomeMessage()
})
</script>

<style scoped>
/* 悬浮按钮样式 */
.floating-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
  transition: all 0.3s ease;
}

.floating-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.ai-icon {
  font-size: 1.5rem;
}

.ai-text {
  font-weight: 600;
}

/* AI助手对话框样式 */
.ai-assistant {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  border: 1px solid #e0e0e0;
}

.assistant-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 1rem 1rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assistant-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  max-height: 400px;
}

.message {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  white-space: pre-line;
  line-height: 1.4;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-radius: 1rem 1rem 0 1rem;
}

.message.assistant .message-content {
  background: #f8f9fa;
  color: #333;
  border-radius: 1rem 1rem 1rem 0;
  border: 1px solid #e0e0e0;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.3rem;
}

.input-area {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  outline: none;
  transition: border 0.3s ease;
}

.message-input:focus {
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.send-btn:hover {
  background: #5a6fd8;
}

/* 滚动条样式 */
.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .ai-assistant {
    width: 90vw;
    height: 70vh;
    bottom: 1rem;
    right: 1rem;
  }
  
  .floating-btn {
    bottom: 1rem;
    right: 1rem;
    padding: 0.8rem 1.2rem;
  }
}
</style>