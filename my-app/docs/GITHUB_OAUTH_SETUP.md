# GitHub OAuth 登录配置指南

## 概述

本项目已优化GitHub OAuth登录功能，支持现代化的安全登录流程，包括PKCE（Proof Key for Code Exchange）安全增强、状态验证、错误处理等特性。

## 功能特性

### 🔒 安全性增强
- **PKCE支持**: 使用SHA256哈希的代码挑战，防止授权码拦截攻击
- **State参数验证**: 防止CSRF攻击
- **安全的Token存储**: 使用HttpOnly Cookie和Session存储
- **环境变量保护**: 敏感信息不暴露在前端代码中

### 🎨 用户体验优化
- **智能弹窗定位**: 弹窗居中显示，尺寸优化
- **加载状态指示**: 清晰的加载动画和状态提示
- **错误处理**: 详细的错误信息和用户友好的提示
- **超时处理**: 5分钟登录超时保护
- **弹窗阻止检测**: 自动检测并提示用户允许弹窗

### 🔄 现代化架构
- **TypeScript支持**: 完整的类型定义
- **RESTful API**: 标准的API设计
- **数据库优化**: 使用GitHub用户ID作为唯一标识符
- **自动用户信息更新**: 登录时自动同步GitHub最新信息

## 配置步骤

### 1. GitHub应用配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: 你的应用名称
   - **Homepage URL**: `http://localhost:3000` (开发环境)
   - **Authorization callback URL**: `http://localhost:3000/api/oauth/redirect`
4. 创建应用后，获取 `Client ID` 和 `Client Secret`

### 2. 环境变量配置

复制 `.env.example` 文件为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的GitHub OAuth配置：

```env
# GitHub OAuth 配置
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 其他必需的环境变量...
```

### 3. 数据库配置

确保数据库中存在以下表结构：

```sql
-- 用户表
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nickname VARCHAR(255),
  avatar VARCHAR(500),
  job VARCHAR(255),
  introduce TEXT
);

-- 用户认证表
CREATE TABLE user_auth (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  identity_type VARCHAR(50),
  identifier VARCHAR(255),
  credential TEXT,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

## 使用方法

### 前端调用

```tsx
import { Login } from 'components/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <button onClick={() => setShowLogin(true)}>
        登录
      </button>
      
      <Login 
        isShow={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  );
}
```

### API端点

- `GET /api/oauth/config` - 获取OAuth配置信息
- `GET /api/oauth/redirect` - OAuth回调处理

## 安全最佳实践

### 1. 环境变量管理
- ✅ 使用 `.env.local` 存储敏感信息
- ✅ 将 `.env.local` 添加到 `.gitignore`
- ✅ 生产环境使用环境变量或密钥管理服务

### 2. HTTPS配置
- 🔄 开发环境可使用HTTP
- ✅ 生产环境必须使用HTTPS
- ✅ 更新GitHub应用的回调URL为HTTPS

### 3. 域名配置
- ✅ 生产环境更新 `NEXT_PUBLIC_APP_URL`
- ✅ 更新GitHub应用的授权回调URL

## 故障排除

### 常见问题

1. **"获取OAuth配置失败"**
   - 检查 `GITHUB_CLIENT_ID` 环境变量是否设置
   - 确认 `.env.local` 文件位置正确

2. **"GitHub授权被拒绝或取消"**
   - 用户在GitHub授权页面点击了取消
   - 检查GitHub应用的回调URL配置

3. **"弹窗被阻止"**
   - 浏览器阻止了弹窗
   - 提示用户允许弹窗或使用重定向模式

4. **"获取GitHub访问令牌失败"**
   - 检查 `GITHUB_CLIENT_SECRET` 环境变量
   - 确认GitHub应用配置正确

### 调试模式

开启详细日志：

```env
NODE_ENV=development
```

查看浏览器控制台和服务器日志获取详细错误信息。

## 生产环境部署

### 1. 更新环境变量

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. 更新GitHub应用配置

- **Homepage URL**: `https://yourdomain.com`
- **Authorization callback URL**: `https://yourdomain.com/api/oauth/redirect`

### 3. 安全检查清单

- [ ] 所有敏感信息使用环境变量
- [ ] HTTPS已启用
- [ ] GitHub应用URL已更新
- [ ] 数据库连接安全
- [ ] Session密钥足够复杂

## 技术架构

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   前端组件      │    │   API端点        │    │   GitHub API    │
│                 │    │                  │    │                 │
│ Login Component │───▶│ /api/oauth/config│    │ OAuth Authorize │
│                 │    │ /api/oauth/redirect│◀──│ Access Token    │
│                 │    │                  │    │ User Info       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │   数据库存储     │
         │              │                  │
         └──────────────▶│ User & UserAuth  │
                         │ Session & Cookie │
                         └──────────────────┘
```

## 更新日志

### v2.0.0 (当前版本)
- ✅ 添加PKCE安全增强
- ✅ 改进错误处理和用户体验
- ✅ 移除硬编码配置
- ✅ 优化数据库查询逻辑
- ✅ 添加超时和弹窗检测
- ✅ 完善TypeScript类型定义

### v1.0.0 (原始版本)
- ✅ 基础GitHub OAuth登录
- ✅ 用户信息存储
- ✅ Session管理

---

如有问题，请查看项目文档或提交Issue。