#!/bin/bash

# 文舆世界项目启动脚本
# 同时启动前端和后端服务

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# 日志目录
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

# PID文件
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"

# 检查是否已有服务在运行
check_running() {
    if [ -f "$BACKEND_PID_FILE" ] && kill -0 $(cat "$BACKEND_PID_FILE") 2>/dev/null; then
        echo -e "${YELLOW}后端服务已在运行中 (PID: $(cat "$BACKEND_PID_FILE"))${NC}"
        return 1
    fi
    if [ -f "$FRONTEND_PID_FILE" ] && kill -0 $(cat "$FRONTEND_PID_FILE") 2>/dev/null; then
        echo -e "${YELLOW}前端服务已在运行中 (PID: $(cat "$FRONTEND_PID_FILE"))${NC}"
        return 1
    fi
    return 0
}

# 启动后端服务
start_backend() {
    echo -e "${GREEN}正在启动后端服务...${NC}"
    cd "$PROJECT_DIR"
    nohup node backend/server.js > "$LOG_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > "$BACKEND_PID_FILE"
    echo -e "${GREEN}后端服务已启动 (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}后端服务地址: http://localhost:5001${NC}"
}

# 启动前端服务
start_frontend() {
    echo -e "${GREEN}正在启动前端服务...${NC}"
    cd "$PROJECT_DIR"
    nohup npm start > "$LOG_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > "$FRONTEND_PID_FILE"
    echo -e "${GREEN}前端服务已启动 (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}前端服务地址: http://localhost:3000${NC}"
}

# 主函数
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   文舆世界项目启动脚本${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # 检查是否已有服务在运行
    if ! check_running; then
        echo ""
        echo -e "${YELLOW}提示: 如需重启服务，请先运行 ./stop.sh${NC}"
        exit 1
    fi
    
    # 启动后端服务
    start_backend
    sleep 2
    
    # 启动前端服务
    start_frontend
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   所有服务启动完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${GREEN}服务地址:${NC}"
    echo -e "  前端: http://localhost:3000"
    echo -e "  后端: http://localhost:5001"
    echo ""
    echo -e "${YELLOW}日志文件:${NC}"
    echo -e "  后端日志: $LOG_DIR/backend.log"
    echo -e "  前端日志: $LOG_DIR/frontend.log"
    echo ""
    echo -e "${YELLOW}停止服务: ./stop.sh${NC}"
    echo -e "${YELLOW}查看日志: tail -f $LOG_DIR/backend.log 或 tail -f $LOG_DIR/frontend.log${NC}"
    echo ""
}

# 运行主函数
main
