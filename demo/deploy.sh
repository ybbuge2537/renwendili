#!/bin/bash

# 人文地理网站部署脚本
echo "=== 人文地理网站部署脚本 ==="

# 设置颜色
green="\033[0;32m"
red="\033[0;31m"
reset="\033[0m"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo -e "${red}错误: Node.js 未安装${reset}"
    echo "请先安装 Node.js (建议版本 14.x 或以上)"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo -e "${red}错误: npm 未安装${reset}"
    echo "请先安装 npm"
    exit 1
fi

echo -e "${green}Node.js 和 npm 版本检查:${reset}"
node -v
npm -v

echo -e "\n${green}1. 安装项目依赖...${reset}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${red}错误: 依赖安装失败${reset}"
    exit 1
fi

echo -e "\n${green}2. 检查环境配置文件...${reset}"
if [ ! -f .env ]; then
    echo -e "${red}警告: .env 文件不存在${reset}"
    echo -e "${green}正在从 .env.example 创建 .env 文件...${reset}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${green}请编辑 .env 文件配置数据库和其他环境变量${reset}"
    else
        echo -e "${red}错误: .env.example 文件也不存在${reset}"
        exit 1
    fi
else
    echo -e "${green}.env 文件已存在${reset}"
fi

echo -e "\n${green}3. 创建数据库表...${reset}
node backend/createTables.js

if [ $? -ne 0 ]; then
    echo -e "${red}警告: 数据库表创建可能失败，请手动检查${reset}"
fi

echo -e "\n${green}4. 部署完成！${reset}"
echo -e "${green}使用以下命令启动应用:${reset}"
echo "  npm run server        # 直接启动服务器"
echo "  pm2 start ecosystem.config.js  # 使用 PM2 启动 (推荐生产环境)"
echo ""
echo -e "${green}应用将在 http://localhost:5001 运行${reset}"
