公钥密码：@1212qqa

# Tauri 应用更新流程

## 准备工作
参考文档： [签名更新包](https://tauri.app/zh-cn/plugin/updater/#%E7%AD%BE%E5%90%8D%E6%9B%B4%E6%96%B0%E5%8C%85)
1. **密钥管理**
   - 私钥位置：`E:\mqy\tauri-demo\~\.tauri\myapp.key`
   - 私钥密码：`@1212qqa`
   - 公钥已配置在 `tauri.conf.json` 中

2. **配置文件检查**
   - 确保 `tauri.conf.json` 中已设置 `"createUpdaterArtifacts": true`
   - 确保更新端点配置正确
   - Windows 安装模式已设置为 `"installMode": "passive"`

## 构建与发布更新的步骤

### 1. 更新版本号

- 在 `Cargo.toml` 中更新 `version` 字段
- 在 `package.json` 中更新 `version` 字段

### 2. 构建应用

```powershell
# 设置环境变量
$env:TAURI_SIGNING_PRIVATE_KEY="E:\mqy\tauri-demo\~\.tauri\myapp.key"
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD="@1212qqa"

# 构建应用
pnpm tauri build
```

### 3. 准备更新文件

- 构建完成后，在 `target/release/bundle/` 目录下找到生成的文件
- 对于 Windows，检查 `target/release/bundle/msi/` 和 `target/release/bundle/nsis/` 目录
- 找到以下文件：
  - 安装程序：`myapp-setup.exe`
  - 签名文件：`myapp-setup.exe.sig`
  - MSI 包：`myapp.msi`
  - MSI 签名：`myapp.msi.sig`

### 4. 创建更新描述文件

创建 `latest.json` 文件，内容如下：

```json
{
  "version": "x.y.z",
  "notes": "版本更新说明",
  "pub_date": "2025-05-10T10:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "BASE64_SIGNATURE",
      "url": "https://github.com/yourusername/tauri-demo/releases/download/vx.y.z/myapp-setup.exe"
    }
  }
}
```

### 5. 发布到 GitHub

1. 在 GitHub 上创建新的 Release
2. 版本标签设为 `vx.y.z`
3. 上传以下文件：
   - 安装程序（`myapp-setup.exe`）
   - 更新描述文件（`latest.json`）

## 测试更新

1. 安装旧版本应用
2. 点击应用中的"检查更新"按钮
3. 应用应该能够检测到新版本，下载并安装

## 故障排除

- **签名验证失败**：确保使用了正确的私钥和密码
- **找不到更新**：检查 JSON 文件格式和 URL 是否正确
- **版本号问题**：确保新版本号大于当前版本号