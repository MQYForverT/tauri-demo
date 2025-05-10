公钥密码：@1212qqa

# Tauri 应用开发与更新指南

## 项目概述

这是一个基于 Tauri 开发的桌面应用，支持自动更新功能。本文档提供了从开发到发布的完整流程指南。

## 环境要求

- Node.js 20.11.0 或更高版本
- Rust 和 Cargo
- pnpm 包管理器
- Tauri CLI

## 开发流程

### 1. 安装依赖

```bash
# 安装项目依赖
pnpm install

# 安装 Tauri CLI
pnpm install -g @tauri-apps/cli
```

### 2. 本地开发

```bash
# 启动开发服务器
pnpm dev
```

## 应用更新流程

参考文档： [签名更新包](https://tauri.app/zh-cn/plugin/updater/#%E7%AD%BE%E5%90%8D%E6%9B%B4%E6%96%B0%E5%8C%85)

### 1. 生成密钥对

首次发布前，需要生成用于签名更新包的密钥对：

```powershell
tauri signer generate -w ~/.tauri/myapp.key
```

这将生成：
- 私钥：`~/.tauri/myapp.key` (请妥善保管！)
- 公钥：`~/.tauri/myapp.key.pub` (用于配置文件)

### 2. 配置更新设置

确保 `tauri.conf.json` 中的以下设置正确：

1. **启用更新构建**
   ```json
   "bundle": {
     "active": true,
     "targets": ["nsis"], // 或 "all", 或 ["msi"], 根据需要选择
     "createUpdaterArtifacts": true
   }
   ```

2. **配置更新器插件**
   ```json
   "plugins": {
     "updater": {
       "pubkey": "[从 myapp.key.pub 文件获取的公钥]",
       "endpoints": [
         "https://github.com/用户名/仓库名/releases/latest/download/latest.json"
       ],
       "windows": {
         "installMode": "passive"
       }
     }
   }
   ```

### 3. 构建应用

在构建前设置环境变量：

```powershell
# 设置私钥路径
$env:TAURI_SIGNING_PRIVATE_KEY="私钥的完整路径"

# 设置私钥密码
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="您的密钥密码"

# 构建应用
pnpm tauri build
```

### 4. 准备更新文件

构建完成后：

1. 在 `src-tauri/target/release/bundle/` 目录下找到生成的安装文件和签名文件

2. **获取签名内容**：
   ```powershell
   # 读取签名文件内容
   type 安装文件的签名文件路径
   ```

3. **创建 `latest.json` 文件**：

创建 `latest.json` 文件，内容如下：

```json
{
  "version": "0.1.0",
  "notes": "初始版本发布",
  "pub_date": "2025-05-10T18:45:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "[从 EXE 签名文件获取的签名内容]",
      "url": "https://github.com/MQYForverT/tauri-demo/releases/download/v0.1.0/tauri-demo_0.1.0_x64-setup.exe"
    }
  }
}
```

### 5. 上传到 GitHub

#### 初始化 Git 仓库

如果还没有初始化 Git 仓库，请按照以下步骤操作：

```powershell
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始化 Tauri 应用，添加更新功能"
```

#### 创建 GitHub 仓库

1. 登录您的 GitHub 账户
2. 点击右上角的 "+" 图标，选择 "New repository"
3. 填写仓库名称，例如 "tauri-demo"
4. 点击 "Create repository"

#### 推送代码到 GitHub

```powershell
# 添加远程仓库
git remote add origin https://github.com/您的用户名/tauri-demo.git

# 推送代码
git push --set-upstream origin master
```

#### 创建 GitHub Release

1. 在 GitHub 仓库页面，点击 "Releases" 标签
2. 点击 "Create a new release" 按钮
3. 在 "Choose a tag" 字段中，输入版本号，例如 `v0.1.0`
4. 填写发布标题和描述
5. 上传以下文件：
   - 安装程序（例如 `tauri-demo_0.1.0_x64-setup.exe`）
   - 更新描述文件（`latest.json`）
6. 点击 "Publish release" 按钮

## 发布新版本

当需要发布新版本时，请按照以下步骤操作：

### 1. 更新版本号

1. 在 `src-tauri/Cargo.toml` 中更新 `version` 字段
2. 在 `package.json` 中更新 `version` 字段

### 2. 构建新版本

重复前面的构建步骤，确保设置了环境变量。

### 3. 更新 latest.json 文件

更新 `latest.json` 文件中的版本号、发布日期、签名内容和下载 URL。

### 4. 创建新的 GitHub Release

使用新的版本号创建 Release，并上传新的安装文件和 `latest.json`。

## 测试更新

1. 安装旧版本应用
2. 点击应用中的"检查更新"按钮
3. 应用应该能够检测到新版本，下载并安装

## 故障排除

- **签名验证失败**：确保使用了正确的私钥和密码，以及正确的签名内容
- **找不到更新**：检查 JSON 文件格式和 URL 是否正确，确保 endpoints 配置指向正确的路径
- **版本号问题**：确保新版本号大于当前版本号
- **安装模式问题**：如果更新过程中遇到问题，可以尝试调整 `installMode` 设置
- **权限问题**：在 Windows 上，可能需要管理员权限才能完成更新

## 注意事项

- **密钥安全**：妥善保管您的私钥和密码，如果丢失将无法发布可验证的更新
- **版本控制**：始终保持良好的版本控制习惯，确保版本号一致性
- **测试更新**：在大规模发布前先进行充分测试，确保更新流程正常