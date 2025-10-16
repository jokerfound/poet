-- 创建数据库函数和存储过程

-- 获取热门诗词的函数
CREATE OR REPLACE FUNCTION get_popular_poems(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    content TEXT,
    poet_id UUID,
    dynasty VARCHAR(50),
    style VARCHAR(100),
    theme VARCHAR(100),
    read_count BIGINT,
    poet_name VARCHAR(100),
    poet_dynasty VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.content,
        p.poet_id,
        p.dynasty,
        p.style,
        p.theme,
        COUNT(urb.id) as read_count,
        pt.name as poet_name,
        pt.dynasty as poet_dynasty
    FROM poems p
    LEFT JOIN user_reading_behavior urb ON p.id = urb.poem_id
    LEFT JOIN poets pt ON p.poet_id = pt.id
    GROUP BY p.id, p.title, p.content, p.poet_id, p.dynasty, p.style, p.theme, pt.name, pt.dynasty
    ORDER BY read_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 搜索诗词的函数
CREATE OR REPLACE FUNCTION search_poems(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    content TEXT,
    poet_id UUID,
    dynasty VARCHAR(50),
    style VARCHAR(100),
    theme VARCHAR(100),
    poet_name VARCHAR(100),
    match_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.content,
        p.poet_id,
        p.dynasty,
        p.style,
        p.theme,
        pt.name as poet_name,
        GREATEST(
            CASE WHEN p.title ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END,
            CASE WHEN p.content ILIKE '%' || search_query || '%' THEN 0.8 ELSE 0.0 END,
            CASE WHEN pt.name ILIKE '%' || search_query || '%' THEN 0.9 ELSE 0.0 END
        ) as match_score
    FROM poems p
    LEFT JOIN poets pt ON p.poet_id = pt.id
    WHERE p.title ILIKE '%' || search_query || '%' 
       OR p.content ILIKE '%' || search_query || '%'
       OR pt.name ILIKE '%' || search_query || '%'
    ORDER BY match_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 获取诗人统计信息的函数
CREATE OR REPLACE FUNCTION get_poet_statistics(poet_id UUID)
RETURNS TABLE (
    total_poems BIGINT,
    avg_poem_length FLOAT,
    most_common_theme VARCHAR(100),
    total_reads BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(p.id) as total_poems,
        AVG(LENGTH(p.content)) as avg_poem_length,
        (SELECT theme FROM poems WHERE poet_id = $1 GROUP BY theme ORDER BY COUNT(*) DESC LIMIT 1) as most_common_theme,
        COUNT(urb.id) as total_reads
    FROM poems p
    LEFT JOIN user_reading_behavior urb ON p.id = urb.poem_id
    WHERE p.poet_id = $1
    GROUP BY p.poet_id;
END;
$$ LANGUAGE plpgsql;

-- 获取相关推荐诗词的函数
CREATE OR REPLACE FUNCTION get_related_poems(poem_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    title VARCHAR(200),
    poet_name VARCHAR(100),
    similarity_score FLOAT
) AS $$
DECLARE
    target_poem RECORD;
BEGIN
    -- 获取目标诗词信息
    SELECT * INTO target_poem FROM poems WHERE id = poem_id;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        pt.name as poet_name,
        CASE 
            WHEN p.poet_id = target_poem.poet_id THEN 0.8
            WHEN p.dynasty = target_poem.dynasty THEN 0.6
            WHEN p.theme = target_poem.theme THEN 0.7
            ELSE 0.3
        END as similarity_score
    FROM poems p
    LEFT JOIN poets pt ON p.poet_id = pt.id
    WHERE p.id != poem_id
    ORDER BY similarity_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 获取朝代统计的函数
CREATE OR REPLACE FUNCTION get_dynasty_statistics()
RETURNS TABLE (
    dynasty VARCHAR(50),
    poet_count BIGINT,
    poem_count BIGINT,
    avg_poems_per_poet FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.dynasty,
        COUNT(DISTINCT p.id) as poet_count,
        COUNT(po.id) as poem_count,
        CASE 
            WHEN COUNT(DISTINCT p.id) > 0 THEN COUNT(po.id)::FLOAT / COUNT(DISTINCT p.id)::FLOAT
            ELSE 0 
        END as avg_poems_per_poet
    FROM poets p
    LEFT JOIN poems po ON p.id = po.poet_id
    GROUP BY p.dynasty
    ORDER BY poem_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 创建全文搜索索引（如果使用PostgreSQL全文搜索）
CREATE INDEX IF NOT EXISTS idx_poems_fts ON poems USING gin(to_tsvector('simple', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_poets_fts ON poets USING gin(to_tsvector('simple', name || ' ' || description));