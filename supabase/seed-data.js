// Supabase种子数据脚本
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 加载环境变量
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

// 示例诗词数据
const samplePoems = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    translation: '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
    analysis: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。',
    tags: ['思乡', '月亮', '夜晚'],
    popularity: 95
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    translation: '春夜酣睡天亮了也不知道，醒来只听到到处有鸟儿啼叫。想起昨夜里风声紧雨声潇潇，花儿不知道被打落了多少？',
    analysis: '这首诗是诗人隐居在鹿门山时所做，意境十分优美。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。',
    tags: ['春天', '早晨', '自然'],
    popularity: 88
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    translation: '夕阳依傍着西山慢慢地沉没，滔滔黄河朝着东海汹涌奔流。若想把千里的风光景物看够，那就要登上更高的一层城楼。',
    analysis: '这首诗写诗人在登高望远中表现出来的不凡的胸襟抱负，反映了盛唐时期人们积极向上的进取精神。前两句写所见，后两句写所感。',
    tags: ['登高', '黄河', '进取'],
    popularity: 92
  },
  {
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    content: '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。',
    translation: '所有的山上，飞鸟的身影已经绝迹，所有道路都不见人的踪迹。江面孤舟上，一位披戴着蓑笠的老翁，独自在大雪覆盖的寒冷江面上垂钓。',
    analysis: '这首诗描绘了一幅渔翁寒江独钓图，表达了诗人在遭受打击之后不屈而又深感孤寂的情绪。全诗构思独特，语言简洁凝练，意蕴丰富。',
    tags: ['冬天', '孤独', '钓鱼'],
    popularity: 85
  },
  {
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    content: '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。',
    translation: '香炉峰在阳光的照射下生起紫色烟霞，远远望见瀑布似白色绢绸悬挂在山前。高崖上飞腾直落的瀑布好像有几千尺，让人恍惚以为银河从天上泻落到人间。',
    analysis: '这首诗形象地描绘了庐山瀑布雄奇壮丽的景色，反映了诗人对祖国大好河山的无限热爱。诗的语言生动形象，构思奇特，想象丰富。',
    tags: ['庐山', '瀑布', '壮观'],
    popularity: 90
  }
]

// 示例诗人数据
const samplePoets = [
  {
    name: '李白',
    dynasty: '唐代',
    birth_year: 701,
    death_year: 762,
    style: '浪漫主义',
    description: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗以抒情为主，表现出蔑视权贵的傲岸精神，对人民疾苦表示同情，又善于描绘自然景色，表达对祖国山河的热爱。',
    representative_works: ['静夜思', '望庐山瀑布', '将进酒', '蜀道难']
  },
  {
    name: '孟浩然',
    dynasty: '唐代',
    birth_year: 689,
    death_year: 740,
    style: '山水田园',
    description: '唐代著名的山水田园派诗人。其诗清淡，长于写景，多反映山水田园和隐逸、行旅等内容，绝大部分为五言短篇，在艺术上有独特的造诣。',
    representative_works: ['春晓', '过故人庄', '宿建德江']
  },
  {
    name: '王之涣',
    dynasty: '唐代',
    birth_year: 688,
    death_year: 742,
    style: '边塞诗',
    description: '盛唐时期的著名诗人，以善于描写边塞风光著称。其诗用词十分朴实，然造境极为深远，令人裹身诗中，回味无穷。',
    representative_works: ['登鹳雀楼', '凉州词']
  },
  {
    name: '柳宗元',
    dynasty: '唐代',
    birth_year: 773,
    death_year: 819,
    style: '古文运动',
    description: '唐代文学家、哲学家、散文家和思想家，与韩愈共同倡导唐代古文运动，并称为"韩柳"。其诗多抒写抑郁悲愤、思乡怀友之情，幽峭峻郁，自成一路。',
    representative_works: ['江雪', '渔翁', '小石潭记']
  }
]

async function seedData() {
  console.log('🌱 开始填充Supabase种子数据...\n')
  
  // 检查环境变量
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || supabaseUrl.includes('your-project')) {
    console.error('❌ 请先配置VITE_SUPABASE_URL环境变量')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  if (!supabaseServiceKey || supabaseServiceKey.includes('your-service-key')) {
    console.error('❌ 请先配置VITE_SUPABASE_SERVICE_KEY环境变量')
    console.log('📖 参考: poet/supabase/setup-guide.md')
    return
  }
  
  console.log('✅ 环境变量检查通过')
  
  try {
    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('👥 插入诗人数据...')
    const poetResults = []
    
    for (const poet of samplePoets) {
      const { data, error } = await supabase
        .from('poets')
        .insert([poet])
        .select()
      
      if (error) {
        if (error.code === '23505') { // 唯一约束冲突
          console.log(`⚠️  诗人 ${poet.name} 已存在，跳过插入`)
          // 尝试获取现有诗人ID
          const { data: existingPoet } = await supabase
            .from('poets')
            .select('id')
            .eq('name', poet.name)
            .single()
          
          if (existingPoet) {
            poetResults.push({ id: existingPoet.id, name: poet.name })
          }
        } else {
          throw error
        }
      } else {
        poetResults.push({ id: data[0].id, name: poet.name })
        console.log(`✅ 插入诗人: ${poet.name}`)
      }
    }
    
    console.log('\n📝 插入诗词数据...')
    let poemCount = 0
    
    for (const poem of samplePoems) {
      // 查找对应的诗人ID
      const poet = poetResults.find(p => p.name === poem.author)
      if (!poet) {
        console.log(`⚠️  未找到诗人 ${poem.author}，跳过诗词 ${poem.title}`)
        continue
      }
      
      const poemData = {
        ...poem,
        poet_id: poet.id
      }
      
      const { error } = await supabase
        .from('poems')
        .insert([poemData])
      
      if (error) {
        if (error.code === '23505') { // 唯一约束冲突
          console.log(`⚠️  诗词 ${poem.title} 已存在，跳过插入`)
        } else {
          throw error
        }
      } else {
        poemCount++
        console.log(`✅ 插入诗词: ${poem.title}`)
      }
    }
    
    console.log('\n🎉 种子数据填充完成！')
    console.log(`📊 填充统计:`)
    console.log(`   - 诗人: ${poetResults.length} 位`)
    console.log(`   - 诗词: ${poemCount} 首`)
    
    console.log('\n💡 下一步: 启动开发服务器测试应用')
    console.log('💻 命令: npm run dev')
    
    console.log('\n🔗 访问地址: http://localhost:5173')
    console.log('📖 查看数据: Supabase项目仪表板')
    
  } catch (error) {
    console.error('❌ 种子数据填充失败:')
    console.error('错误信息:', error.message)
    console.error('错误代码:', error.code)
    
    console.log('\n💡 故障排除建议:')
    console.log('1. 确保已运行数据库迁移 (npm run supabase:migrate)')
    console.log('2. 检查表结构是否正确创建')
    console.log('3. 确认有插入数据的权限')
    console.log('4. 查看Supabase项目日志获取详细错误信息')
  }
}

// 运行种子数据填充
seedData().catch(console.error)