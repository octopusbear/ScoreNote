# 🎓 ScoreNote 智能成绩备考助手 (V4.0)

> **记录点滴进步，不仅是数字，更是通往梦想的阶梯。**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-4.0.0-violet.svg)
![Tech](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Vite-blue)

**ScoreNote** 是一个高颜值的个人成绩管理与分析工具。V4.0 版本采用了全新的**纯前端架构**，无需安装任何后台软件，无需联网登录，打开浏览器即可使用。数据完全存储在本地，安全隐私。

![Dashboard Preview](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3) 
*(建议在此处替换为你的项目实际截图)*

## ✨ 核心功能

*   **🎨 极光 UI 设计**：采用 "Aurora & Ocean" 渐变色系，配合磨砂玻璃效果，拒绝压抑，让备考充满活力。
*   **📈 智能阶梯目标**：告别盲目焦虑。系统根据你当前的成绩，自动计算并显示**下一个**跳一跳够得着的目标大学（例如：从“一本线”到“武大”）。
*   **📊 多维图表分析**：
    *   **趋势图**：清晰展示总分及各科成绩的起伏，带有目标参考线。
    *   **雷达图**：一键分析单次考试的学科均衡度，发现短板与优势。
*   **🛡️ 数据隐私安全**：所有数据存储在浏览器的 `localStorage` 中。**没有服务器，没有数据库，只有你和你的成绩单。**
*   **💾 备份与恢复**：支持一键导出 JSON 备份文件，轻松迁移数据到新设备。

## 🚀 在线使用 (推荐)

无需下载代码，直接访问以下链接即可使用（建议由部署者填写）：

**[👉 点击这里打开 ScoreNote](https://你的Vercel地址.vercel.app)**

> 兼容性：完美支持 PC、Mac、iPad 及各类手机浏览器。

## 🛠️ 本地开发与运行

如果你是开发者，或者想自己构建项目，请按照以下步骤操作：

### 1. 环境准备
确保你的电脑已安装 [Node.js](https://nodejs.org/) (推荐 v16+)。

### 2. 安装与启动

```bash
# 克隆项目
git clone https://github.com/your-username/ScoreNote.git

# 进入目录
cd ScoreNote

# 安装依赖 
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问控制台显示的地址 (通常是 `http://localhost:5173`)。

### 3. 打包部署
```bash
npm run build
```
生成的 `dist` 文件夹可直接托管至 Vercel, Netlify 或 GitHub Pages。

## 📱 技术栈

*   **核心框架**: React 18 + TypeScript + Vite
*   **UI 样式**: Tailwind CSS (自定义渐变与动画)
*   **图表库**: Recharts (响应式数据可视化)
*   **图标库**: Lucide React

## 🙋‍♂️ 常见问题 (Q&A)

**Q: 我换了电脑/手机，数据还在吗？**
A: 不在。因为是无后端模式，数据存在当前浏览器的缓存里。
**解决办法**：在旧设备的“设置”中点击 **“导出备份”**，将下载的文件发给新设备，在新设备上点击 **“导入数据”** 即可。

**Q: 为什么没有登录功能？**
A: 为了极致的轻量化和隐私保护。你不需要注册账号，不需要担心密码泄露，打开即用。

**Q: 如何修改目标大学？**
A: 点击右上角的 **齿轮图标 (设置)**，你可以自由添加、删除目标大学及其分数线。

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源。欢迎 Fork 和 Star！🌟
