import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

/**
 * 检查并安装更新
 * 最小化实现，按照官方文档
 */
export async function checkAndInstallUpdate(): Promise<{success: boolean, message: string}> {
  try {
    const update = await check()
    if (update) {
      // 有更新可用
      await update.downloadAndInstall()
      await relaunch()
      return { success: true, message: '更新已安装，应用将重启' }
    } else {
      // 没有更新
      return { success: true, message: '当前已是最新版本' }
    }
  } catch (error) {
    console.error('更新失败:', error)
    return { success: false, message: `更新失败: ${error}` }
  }
}