-- 创建诗词数据库表结构

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建诗人表
CREATE TABLE IF NOT EXISTS poets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    description TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    style VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    poet_id UUID REFERENCES poets(id) ON DELETE CASCADE,
    dynasty VARCHAR(50) NOT NULL,
    style VARCHAR(100),
    theme VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建注释表
CREATE TABLE IF NOT EXISTS annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建意象表
CREATE TABLE IF NOT EXISTS imagery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    image_type VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建历史事件表
CREATE TABLE IF NOT EXISTS historical_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    year INTEGER,
    dynasty VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建知识图谱关系表
CREATE TABLE IF NOT EXISTS knowledge_graph_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    relation_type VARCHAR(100) NOT NULL,
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户行为表
CREATE TABLE IF NOT EXISTS user_reading_behavior (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    read_duration INTEGER DEFAULT 0,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建AI解释缓存表
CREATE TABLE IF NOT EXISTS ai_interpretation_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    interpretation TEXT NOT NULL,
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建多媒体资源表
CREATE TABLE IF NOT EXISTS multimedia_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_poet_id ON poems(poet_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_theme ON poems(theme);
CREATE INDEX IF NOT EXISTS idx_poets_dynasty ON poets(dynasty);
CREATE INDEX IF NOT EXISTS idx_annotations_poem_id ON annotations(poem_id);
CREATE INDEX IF NOT EXISTS idx_imagery_poem_id ON imagery(poem_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_reading_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_poem_id ON user_reading_behavior(poem_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_graph_source ON knowledge_graph_relations(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_graph_target ON knowledge_graph_relations(target_id, target_type);

-- 启用行级安全策略
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagery ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graph_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interpretation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia_assets ENABLE ROW LEVEL SECURITY;

-- 创建允许匿名访问的策略
CREATE POLICY "允许匿名读取诗人数据" ON poets FOR SELECT USING (true);
CREATE POLICY "允许匿名读取诗词数据" ON poems FOR SELECT USING (true);
CREATE POLICY "允许匿名读取注释数据" ON annotations FOR SELECT USING (true);
CREATE POLICY "允许匿名读取意象数据" ON imagery FOR SELECT USING (true);
CREATE POLICY "允许匿名读取历史事件数据" ON historical_events FOR SELECT USING (true);
CREATE POLICY "允许匿名读取知识图谱数据" ON knowledge_graph_relations FOR SELECT USING (true);
CREATE POLICY "允许匿名读取AI解释数据" ON ai_interpretation_cache FOR SELECT USING (true);
CREATE POLICY "允许匿名读取多媒体数据" ON multimedia_assets FOR SELECT USING (true);

-- 允许匿名用户插入阅读行为记录
CREATE POLICY "允许匿名插入阅读行为" ON user_reading_behavior FOR INSERT WITH CHECK (true);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_poets_updated_at BEFORE UPDATE ON poets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_interpretation_updated_at BEFORE UPDATE ON ai_interpretation_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO poets (id, name, dynasty, description, birth_year, death_year, style) VALUES
    ('11111111-1111-1111-1111-111111111111', '李白', '唐', '唐代著名诗人，字太白，号青莲居士，有"诗仙"之称', 701, 762, '浪漫主义'),
    ('22222222-2222-2222-2222-222222222222', '杜甫', '唐', '唐代著名诗人，字子美，自号少陵野老，有"诗圣"之称', 712, 770, '现实主义'),
    ('33333333-3333-3333-3333-333333333333', '孟浩然', '唐', '唐代山水田园诗人代表', 689, 740, '山水田园'),
    ('44444444-4444-4444-4444-444444444444', '苏轼', '宋', '宋代文学家，字子瞻，号东坡居士，唐宋八大家之一', 1037, 1101, '豪放派')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poems (id, title, content, poet_id, dynasty, style, theme) VALUES
    ('55555555-5555-5555-5555-555555555555', '静夜思', '床前明月光，疑是地上霜。举头望明月，低头思故乡。', '11111111-1111-1111-1111-111111111111', '唐', '五言绝句', '思乡'),
    ('66666666-6666-6666-6666-666666666666', '春晓', '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', '33333333-3333-3333-3333-333333333333', '唐', '五言绝句', '春景'),
    ('77777777-7777-7777-7777-777777777777', '望岳', '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。', '22222222-2222-2222-2222-222222222222', '唐', '五言古诗', '山水'),
    ('88888888-8888-8888-8888-888888888888', '水调歌头·明月几时有', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。', '44444444-4444-4444-4444-444444444444', '宋', '词', '思亲')
ON CONFLICT (id) DO NOTHING;