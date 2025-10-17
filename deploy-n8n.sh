#!/bin/bash

# poet项目n8n工作流部署脚本
echo "🚀 开始部署诗词赏析机器人n8n工作流..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否可用
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建数据目录..."
mkdir -p n8n-data
mkdir -p n8n-workflows
mkdir -p redis-data

# 复制工作流配置文件
echo "📋 复制工作流配置..."
cp n8n-workflows/*.json n8n-workflows/

# 启动n8n服务
echo "🐳 启动n8n服务..."
docker-compose -f docker-compose.n8n.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if docker ps | grep poet-n8n > /dev/null; then
    echo "✅ n8n服务启动成功"
else
    echo "❌ n8n服务启动失败"
    exit 1
fi

if docker ps | grep poet-redis > /dev/null; then
    echo "✅ Redis服务启动成功"
else
    echo "❌ Redis服务启动失败"
    exit 1
fi

# 显示访问信息
echo ""
echo "🎉 部署完成！"
echo ""
echo "📊 服务访问信息："
echo "   n8n工作流平台: http://localhost:5678"
echo "   用户名: admin"
echo "   密码: poet123456"
echo ""
echo "🔗 Redis服务: localhost:6379"
echo ""
echo "📖 下一步操作："
echo "   1. 访问n8n工作流平台"
echo "   2. 导入工作流配置文件（位于n8n-workflows/目录）"
echo "   3. 配置OpenAI API密钥"
echo "   4. 激活工作流"
echo ""
echo "💡 提示：确保OpenAI API密钥已配置，工作流才能正常运行"

# 显示工作流导入指南
echo ""
echo "📋 工作流导入指南："
echo "   1. 登录n8n平台"
echo "   2. 点击右上角'设置'图标"
echo "   3. 选择'导入工作流'"
echo "   4. 选择n8n-workflows/目录下的JSON文件"
echo "   5. 点击'导入'完成配置"
echo ""
echo "🔧 配置OpenAI API："
echo "   1. 在n8n平台点击'设置'"
echo "   2. 选择'凭证'"
echo "   3. 点击'添加凭证'"
echo "   4. 选择'OpenAI API'"
echo "   5. 输入您的API密钥"
echo "   6. 保存凭证"

echo ""
echo "✅ 部署脚本执行完成"