/**
 * GitHub Gists 存储工具
 * 使用 GitHub Gists API 作为免费的数据存储后端
 * 
 * 使用说明：
 * 1. 在 GitHub 创建一个 Personal Access Token (PAT)
 *    - Settings > Developer settings > Personal access tokens > Tokens (classic)
 *    - 勾选 gist 权限
 * 2. 将 GIST_ID 设置为你的 Gist ID（首次使用会自动创建）
 * 3. 在环境变量或配置中设置 GITHUB_TOKEN
 */

const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
const GIST_FILENAME = 'cloud-share-data.json'

// GitHub API 基础 URL
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * 获取 Gist 数据
 */
export async function getGistData() {
  if (!GIST_ID || !GITHUB_TOKEN) {
    console.warn('GitHub Gist 未配置，使用本地存储')
    return getLocalData()
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Gist 不存在，返回空数据
        return { links: [], lastUpdate: null }
      }
      throw new Error(`GitHub API 错误: ${response.status}`)
    }

    const gist = await response.json()
    const file = gist.files[GIST_FILENAME]
    
    if (!file) {
      return { links: [], lastUpdate: null }
    }

    const content = JSON.parse(file.content)
    return content
  } catch (error) {
    console.error('获取 Gist 数据失败:', error)
    // 失败时回退到本地存储
    return getLocalData()
  }
}

/**
 * 保存数据到 Gist
 */
export async function saveGistData(data) {
  if (!GIST_ID || !GITHUB_TOKEN) {
    console.warn('GitHub Gist 未配置，使用本地存储')
    saveLocalData(data)
    return
  }

  try {
    // 先获取现有 Gist（如果存在）
    let gist = null
    try {
      const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      if (response.ok) {
        gist = await response.json()
      }
    } catch (e) {
      // Gist 不存在，将创建新的
    }

    const content = JSON.stringify({
      ...data,
      lastUpdate: new Date().toISOString()
    }, null, 2)

    const body = {
      description: '网盘链接分享数据',
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: content
        }
      }
    }

    // 如果 Gist 已存在，更新它；否则创建新的
    const url = gist 
      ? `${GITHUB_API_BASE}/gists/${GIST_ID}`
      : `${GITHUB_API_BASE}/gists`
    
    const method = gist ? 'PATCH' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`保存失败: ${error.message || response.statusText}`)
    }

    const result = await response.json()
    
    // 如果是新创建的 Gist，保存 ID 到本地存储
    if (!GIST_ID && result.id) {
      localStorage.setItem('gist_id', result.id)
    }

    return result
  } catch (error) {
    console.error('保存 Gist 数据失败:', error)
    // 失败时回退到本地存储
    saveLocalData(data)
    throw error
  }
}

/**
 * 增加下载次数（使用 GitHub API）
 */
export async function incrementDownloadCount(linkId) {
  const data = await getGistData()
  const link = data.links.find(l => l.id === linkId)
  
  if (link) {
    link.downloadCount = (link.downloadCount || 0) + 1
    await saveGistData(data)
    return link.downloadCount
  }
  
  return 0
}

// ========== 本地存储备用方案 ==========

const STORAGE_KEY = 'cloud_share_links'

function getLocalData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('读取本地数据失败:', error)
  }
  return { links: [], lastUpdate: null }
}

function saveLocalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      lastUpdate: new Date().toISOString()
    }))
  } catch (error) {
    console.error('保存本地数据失败:', error)
  }
}
