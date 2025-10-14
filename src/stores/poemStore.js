import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import poemService from '../services/poemService.js'

export const usePoemStore = defineStore('poem', () => {
  // 状态
  const favorites = ref([])
  const readingHistory = ref([])
  const searchHistory = ref([])
  const poems = reactive({
    list: [],
    loading: false,
    error: null
  })
  const poets = reactive({
    list: [],
    loading: false,
    error: null
  })
  const currentPoem = ref(null)

  // 获取收藏列表
  const favoritePoems = computed(() => {
    return favorites.value
  })

  // 获取阅读历史
  const history = computed(() => {
    return readingHistory.value.slice().reverse() // 最新的在前面
  })

  // 获取诗词列表
  const poemList = computed(() => poems.list)
  const poemLoading = computed(() => poems.loading)
  const poemError = computed(() => poems.error)

  // 获取诗人列表
  const poetList = computed(() => poets.list)
  const poetLoading = computed(() => poets.loading)
  const poetError = computed(() => poets.error)

  // 获取搜索历史
  const searchRecords = computed(() => {
    return searchHistory.value.slice().reverse()
  })

  // 切换收藏状态
  const toggleFavorite = (poemId) => {
    const index = favorites.value.indexOf(poemId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(poemId)
    }
    // 保存到本地存储
    localStorage.setItem('poemFavorites', JSON.stringify(favorites.value))
  }

  // 添加到收藏
  const addToFavorites = (poemId) => {
    if (!favorites.value.includes(poemId)) {
      favorites.value.push(poemId)
      localStorage.setItem('poemFavorites', JSON.stringify(favorites.value))
    }
  }

  // 从收藏中移除
  const removeFromFavorites = (poemId) => {
    const index = favorites.value.indexOf(poemId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      localStorage.setItem('poemFavorites', JSON.stringify(favorites.value))
    }
  }

  // 清空收藏
  const clearFavorites = () => {
    favorites.value = []
    localStorage.removeItem('poemFavorites')
  }

  // 从历史中移除
  const removeFromHistory = (timestamp) => {
    const index = readingHistory.value.findIndex(item => item.timestamp === timestamp)
    if (index > -1) {
      readingHistory.value.splice(index, 1)
      localStorage.setItem('poemHistory', JSON.stringify(readingHistory.value))
    }
  }

  // 清空历史
  const clearHistory = () => {
    readingHistory.value = []
    localStorage.removeItem('poemHistory')
  }

  // 从本地存储加载数据（兼容旧版本）
  const loadFromLocalStorage = () => {
    loadFromStorage()
  }

  // 添加阅读记录
  const addToHistory = async (poem) => {
    // 移除重复记录
    const index = readingHistory.value.findIndex(item => item.id === poem.id)
    if (index > -1) {
      readingHistory.value.splice(index, 1)
    }
    
    // 添加新记录
    readingHistory.value.push({
      id: poem.id,
      title: poem.title,
      author: poem.poets?.name || '未知',
      timestamp: new Date().toISOString()
    })
    
    // 限制历史记录数量
    if (readingHistory.value.length > 50) {
      readingHistory.value.shift()
    }
    
    // 保存到本地存储
    localStorage.setItem('poemHistory', JSON.stringify(readingHistory.value))
    
    // 记录到数据库
    try {
      await poemService.addReadingRecord(poem.id)
    } catch (error) {
      console.warn('记录阅读历史到数据库失败:', error)
    }
  }

  // 添加搜索记录
  const addSearchRecord = (query) => {
    if (!query.trim()) return
    
    // 移除重复记录
    const index = searchHistory.value.indexOf(query)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }
    
    // 添加新记录
    searchHistory.value.push(query)
    
    // 限制搜索记录数量
    if (searchHistory.value.length > 20) {
      searchHistory.value.shift()
    }
    
    // 保存到本地存储
    localStorage.setItem('poemSearchHistory', JSON.stringify(searchHistory.value))
  }

  // 清除搜索记录
  const clearSearchHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('poemSearchHistory')
  }

  // 清除阅读历史
  const clearReadingHistory = () => {
    readingHistory.value = []
    localStorage.removeItem('poemHistory')
  }

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const savedFavorites = localStorage.getItem('poemFavorites')
      const savedHistory = localStorage.getItem('poemHistory')
      const savedSearchHistory = localStorage.getItem('poemSearchHistory')
      
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
      
      if (savedHistory) {
        readingHistory.value = JSON.parse(savedHistory)
      }
      
      if (savedSearchHistory) {
        searchHistory.value = JSON.parse(savedSearchHistory)
      }
    } catch (error) {
      console.error('加载本地存储数据失败:', error)
      // 如果数据损坏，清除本地存储
      clearAllData()
    }
  }

  // 清除所有数据
  const clearAllData = () => {
    favorites.value = []
    readingHistory.value = []
    searchHistory.value = []
    
    localStorage.removeItem('poemFavorites')
    localStorage.removeItem('poemHistory')
    localStorage.removeItem('poemSearchHistory')
  }

  // 获取诗词列表
  const fetchPoems = async (limit = 50, offset = 0) => {
    poems.loading = true
    poems.error = null
    
    try {
      const data = await poemService.getAllPoems(limit, offset)
      poems.list = data
    } catch (error) {
      poems.error = error.message
      console.error('获取诗词列表失败:', error)
    } finally {
      poems.loading = false
    }
  }

  // 搜索诗词
  const searchPoems = async (query, limit = 20) => {
    poems.loading = true
    poems.error = null
    
    try {
      const data = await poemService.searchPoems(query, limit)
      poems.list = data
      
      // 记录搜索历史
      if (query.trim()) {
        addSearchRecord(query)
      }
    } catch (error) {
      poems.error = error.message
      console.error('搜索诗词失败:', error)
    } finally {
      poems.loading = false
    }
  }

  // 获取诗人列表
  const fetchPoets = async (limit = 50) => {
    poets.loading = true
    poets.error = null
    
    try {
      const data = await poemService.getAllPoets(limit)
      poets.list = data
    } catch (error) {
      poets.error = error.message
      console.error('获取诗人列表失败:', error)
    } finally {
      poets.loading = false
    }
  }

  // 根据诗人获取诗词
  const fetchPoemsByPoet = async (poetId, limit = 20) => {
    poems.loading = true
    poems.error = null
    
    try {
      const data = await poemService.getPoemsByPoet(poetId, limit)
      poems.list = data
    } catch (error) {
      poems.error = error.message
      console.error('获取诗人诗词失败:', error)
    } finally {
      poems.loading = false
    }
  }

  // 获取热门诗词
  const fetchPopularPoems = async (limit = 10) => {
    poems.loading = true
    poems.error = null
    
    try {
      const data = await poemService.getPopularPoems(limit)
      poems.list = data
    } catch (error) {
      poems.error = error.message
      console.error('获取热门诗词失败:', error)
    } finally {
      poems.loading = false
    }
  }

  // 获取诗词详情
  const fetchPoemById = async (id) => {
    try {
      const data = await poemService.getPoemById(id)
      currentPoem.value = data
      return data
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      currentPoem.value = null
      return null
    }
  }

  // 初始化数据
  const initializeData = async () => {
    await Promise.all([
      fetchPoems(),
      fetchPoets()
    ])
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    // 状态
    favorites,
    readingHistory,
    searchHistory,
    
    // 计算属性
    favoritePoems,
    history: computed(() => readingHistory.value.slice().reverse()),
    searchRecords: computed(() => searchHistory.value.slice().reverse()),
    readingHistory: computed(() => readingHistory.value),
    
    // 方法
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    addToHistory,
    removeFromHistory,
    clearHistory,
    addSearchRecord,
    clearSearchHistory,
    clearReadingHistory,
    clearAllData,
    loadFromStorage,
    loadFromLocalStorage,
    
    // 数据库相关方法
    fetchPoems,
    searchPoems,
    fetchPoets,
    fetchPoemsByPoet,
    fetchPopularPoems,
    fetchPoemById,
    initializeData,
    
    // 状态
    poems,
    poets,
    currentPoem,
    poemList,
    poemLoading,
    poemError,
    poetList,
    poetLoading,
    poetError
  }
})