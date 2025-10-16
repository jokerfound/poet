-- 创建更精细的行级安全策略

-- 删除现有的简单策略
DROP POLICY IF EXISTS "允许匿名读取诗人数据" ON poets;
DROP POLICY IF EXISTS "允许匿名读取诗词数据" ON poems;
DROP POLICY IF EXISTS "允许匿名读取注释数据" ON annotations;
DROP POLICY IF EXISTS "允许匿名读取意象数据" ON imagery;
DROP POLICY IF EXISTS "允许匿名读取历史事件数据" ON historical_events;
DROP POLICY IF EXISTS "允许匿名读取知识图谱数据" ON knowledge_graph_relations;
DROP POLICY IF EXISTS "允许匿名读取AI解释数据" ON ai_interpretation_cache;
DROP POLICY IF EXISTS "允许匿名读取多媒体数据" ON multimedia_assets;
DROP POLICY IF EXISTS "允许匿名插入阅读行为" ON user_reading_behavior;

-- 为诗人表创建精细策略
CREATE POLICY "允许所有人读取诗人数据" ON poets FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理诗人数据" ON poets FOR ALL USING (auth.role() = 'authenticated');

-- 为诗词表创建精细策略
CREATE POLICY "允许所有人读取诗词数据" ON poems FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理诗词数据" ON poems FOR ALL USING (auth.role() = 'authenticated');

-- 为注释表创建精细策略
CREATE POLICY "允许所有人读取注释数据" ON annotations FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理注释数据" ON annotations FOR ALL USING (auth.role() = 'authenticated');

-- 为意象表创建精细策略
CREATE POLICY "允许所有人读取意象数据" ON imagery FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理意象数据" ON imagery FOR ALL USING (auth.role() = 'authenticated');

-- 为历史事件表创建精细策略
CREATE POLICY "允许所有人读取历史事件数据" ON historical_events FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理历史事件数据" ON historical_events FOR ALL USING (auth.role() = 'authenticated');

-- 为知识图谱表创建精细策略
CREATE POLICY "允许所有人读取知识图谱数据" ON knowledge_graph_relations FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理知识图谱数据" ON knowledge_graph_relations FOR ALL USING (auth.role() = 'authenticated');

-- 为AI解释表创建精细策略
CREATE POLICY "允许所有人读取AI解释数据" ON ai_interpretation_cache FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理AI解释数据" ON ai_interpretation_cache FOR ALL USING (auth.role() = 'authenticated');

-- 为多媒体表创建精细策略
CREATE POLICY "允许所有人读取多媒体数据" ON multimedia_assets FOR SELECT USING (true);
CREATE POLICY "允许认证用户管理多媒体数据" ON multimedia_assets FOR ALL USING (auth.role() = 'authenticated');

-- 为用户行为表创建精细策略
CREATE POLICY "允许所有人插入阅读行为" ON user_reading_behavior FOR INSERT WITH CHECK (true);
CREATE POLICY "允许用户读取自己的行为数据" ON user_reading_behavior FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "允许认证用户管理行为数据" ON user_reading_behavior FOR ALL USING (auth.role() = 'authenticated');

-- 创建用于API访问的服务角色（如果需要）
-- CREATE ROLE api_user NOLOGIN;
-- GRANT USAGE ON SCHEMA public TO api_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_user;
-- GRANT INSERT ON user_reading_behavior TO api_user;

-- 创建用于监控的只读角色
-- CREATE ROLE read_only_user NOLOGIN;
-- GRANT USAGE ON SCHEMA public TO read_only_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only_user;