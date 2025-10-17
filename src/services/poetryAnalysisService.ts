import { ref } from 'vue'

// 诗词分析请求接口
export interface PoetryAnalysisRequest {
  poemId?: number
  poemTitle?: string
  poemContent?: string
  analysisType: 'sentiment' | 'artistic' | 'historical' | 'comprehensive'
  userQuestion?: string
}

// 诗词分析响应接口
export interface PoetryAnalysisResponse {
  success: boolean
  data?: {
    analysis: string
    insights: string[]
    recommendations: string[]
    relatedPoems: Array<{
      id: number
      title: string
      author: string
      similarity: number
    }>
  }
  error?: string
}

// 模拟n8n工作流调用
class PoetryAnalysisService {
  private baseUrl = 'http://localhost:5678' // n8n默认端口
  
  // 分析诗词
  async analyzePoetry(request: PoetryAnalysisRequest): Promise<PoetryAnalysisResponse> {
    try {
      // 模拟调用n8n工作流
      const response = await this.callN8NWorkflow('poetry-analysis', request)
      return response
    } catch (error) {
      console.error('诗词分析服务调用失败:', error)
      return {
        success: false,
        error: '诗词分析服务暂时不可用，请稍后重试'
      }
    }
  }
  
  // 获取相关诗词推荐
  async getRelatedPoems(poemId: number, limit: number = 5) {
    try {
      const response = await this.callN8NWorkflow('related-poems', {
        poemId,
        limit
      })
      return response
    } catch (error) {
      console.error('获取相关诗词失败:', error)
      return {
        success: false,
        error: '获取相关诗词失败'
      }
    }
  }
  
  // 智能问答
  async askQuestion(question: string, context?: any) {
    try {
      const response = await this.callN8NWorkflow('poetry-qa', {
        question,
        context
      })
      return response
    } catch (error) {
      console.error('智能问答服务调用失败:', error)
      return {
        success: false,
        error: '问答服务暂时不可用'
      }
    }
  }
  
  // 模拟n8n工作流调用
  private async callN8NWorkflow(workflowName: string, data: any) {
    // 在实际环境中，这里会调用真实的n8n API
    // 现在使用模拟数据
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据工作流类型返回不同的模拟数据
    switch (workflowName) {
      case 'poetry-analysis':
        return this.mockPoetryAnalysis(data)
      case 'related-poems':
        return this.mockRelatedPoems(data)
      case 'poetry-qa':
        return this.mockQAResponse(data)
      default:
        throw new Error(`未知的工作流: ${workflowName}`)
    }
  }
  
  // 模拟诗词分析
  private mockPoetryAnalysis(request: PoetryAnalysisRequest): PoetryAnalysisResponse {
    const { poemTitle, poemContent, analysisType } = request
    
    const baseAnalysis = {
      analysis: `这首${poemTitle || '诗词'}通过${this.getAnalysisTypeText(analysisType)}展现了深厚的艺术造诣。`,
      insights: [
        '运用了生动的意象描写',
        '情感表达真挚动人',
        '语言简洁而意境深远'
      ],
      recommendations: [
        '建议结合历史背景深入理解',
        '可以对比同类型诗词进行学习',
        '尝试从多个角度赏析'
      ],
      relatedPoems: [
        { id: 1, title: '春晓', author: '孟浩然', similarity: 0.85 },
        { id: 2, title: '登鹳雀楼', author: '王之涣', similarity: 0.78 },
        { id: 3, title: '望庐山瀑布', author: '李白', similarity: 0.72 }
      ]
    }
    
    return {
      success: true,
      data: baseAnalysis
    }
  }
  
  // 模拟相关诗词
  private mockRelatedPoems(data: any): PoetryAnalysisResponse {
    return {
      success: true,
      data: {
        analysis: '',
        insights: [],
        recommendations: [],
        relatedPoems: [
          { id: 4, title: '江雪', author: '柳宗元', similarity: 0.91 },
          { id: 5, title: '枫桥夜泊', author: '张继', similarity: 0.83 },
          { id: 6, title: '黄鹤楼', author: '崔颢', similarity: 0.79 }
        ]
      }
    }
  }
  
  // 模拟问答响应
  private mockQAResponse(data: any): PoetryAnalysisResponse {
    const { question } = data
    
    return {
      success: true,
      data: {
        analysis: `关于"${question}"的问题，这首诗词主要表达了...`,
        insights: [
          '可以从意象分析入手',
          '关注诗人的情感表达',
          '结合创作背景理解'
        ],
        recommendations: [
          '建议阅读相关赏析文章',
          '可以对比其他诗人的类似作品'
        ],
        relatedPoems: []
      }
    }
  }
  
  private getAnalysisTypeText(type: string): string {
    const types = {
      sentiment: '情感表达',
      artistic: '艺术手法',
      historical: '历史背景',
      comprehensive: '综合赏析'
    }
    return types[type as keyof typeof types] || '综合赏析'
  }
}

// 创建服务实例
const poetryAnalysisService = new PoetryAnalysisService()

// Vue composable
export function usePoetryAnalysis() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const analyzePoetry = async (request: PoetryAnalysisRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await poetryAnalysisService.analyzePoetry(request)
      if (!result.success) {
        error.value = result.error
      }
      return result
    } catch (err) {
      error.value = '分析服务调用失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  const askQuestion = async (question: string, context?: any) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await poetryAnalysisService.askQuestion(question, context)
      if (!result.success) {
        error.value = result.error
      }
      return result
    } catch (err) {
      error.value = '问答服务调用失败'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    analyzePoetry,
    askQuestion
  }
}

export default poetryAnalysisService