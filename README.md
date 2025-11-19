# 中学生成绩可视化系统 (MVP)

这是一个极简交互的成绩记录与分析系统，旨在帮助学生轻松记录考试分数，自动生成趋势分析与激励话术。

## 项目结构

*   `backend/`: Python FastAPI 后端 + SQLite 数据库
*   `frontend/`: React + TypeScript + Vite 前端

## 快速开始

### 1. 启动后端 (Backend)

确保你已安装 Python 3.8+。

```bash
# 进入后端目录
cd backend

# 创建虚拟环境 (可选，推荐)
python -m venv venv
# Windows 激活: venv\Scripts\activate
# Mac/Linux 激活: source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务器 (默认端口 8000)
uvicorn main:app --reload
```

后端启动后，会自动创建 `scores.db` 数据库并初始化大学分数线数据。
API 文档地址: http://127.0.0.1:8000/docs

### 2. 启动前端 (Frontend)

确保你已安装 Node.js 16+。

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问前端控制台显示的地址 (通常是 http://localhost:5173)。

## 功能说明

1.  **录入成绩**: 输入各科分数，点击保存。系统会自动计算总分、生成考试名称、判断进步情况并给出激励。
2.  **查看趋势**: 默认显示总分曲线。点击上方标签可切换查看单科 (语文、数学等) 的走势。
3.  **雷达图详情**: 选择具体的某次考试，查看各科能力的均衡情况。
