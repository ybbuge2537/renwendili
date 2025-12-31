#!/bin/bash

# 文舆世界项目停止脚本
# 停止前端和后端服务

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日志目录
LOG_DIR="$PROJECT_DIR/logs"

# PID文件
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"

# 停止后端服务
stop_backend() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        BACKEND_PID=$(cat "$BACKEND_PID_FILE")
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo -e "${YELLOW}正在停止后端服务 (PID: $BACKEND_PID)...${NC}"
            kill $BACKEND_PID
            sleep 1
            if kill -0 $BACKEND_PID 2>/dev/null; then
                echo -e "${RED}后端服务停止失败，强制终止...${NC}"
                kill -9 $BACKEND_PID
            fi
            echo -e "${GREEN}后端服务已停止${NC}"
        else
            echo -e "${YELLOW}后端服务未运行${NC}"
        fi
        rm -f "$BACKEND_PID_FILE"
    else
        echo -e "${YELLOW}后端服务PID文件不存在${NC}"
    fi
}

# 停止前端服务
stop_frontend() {
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo -e "${YELLOW}正在停止前端服务 (PID: $FRONTEND_PID)...${NC}"
            kill $FRONTEND_PID
            sleep 1
            if kill -0 $FRONTEND_PID 2>/dev/null; then
                echo -e "${RED}前端服务停止失败，强制终止...${NC}"
                kill -9 $FRONTEND_PID
            fi
            echo -e "${GREEN}前端服务已停止${NC}"
        else
            echo -e "${YELLOW}前端服务未运行${NC}"
        fi
        rm -f "$FRONTEND_PID_FILE"
    else
        echo -e "${YELLOW}前端服务PID文件不存在${NC}"
    fi
}

# 主函数
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   文舆世界项目停止脚本${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # 停止后端服务
    stop_backend
    echo ""
    
    # 停止前端服务
    stop_frontend
    echo ""
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   所有服务已停止！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}启动服务: ./start.sh${NC}"
    echo ""
}

# 运行主函数
main
