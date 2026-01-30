/**
 * GitHub Gists 存储工具
 * 使用 GitHub Gists API 作为免费的数据存储后端
 * 
 * 使用说明：
 * 1. 在 GitHub 创建一个 Personal Access Token (PAT)
 *    - Settings > Developer settings > Personal access tokens > Tokens (classic)
 *    - 勾选 gist 权限
 * 2. 手动创建一个 Gist，并获取 GIST_ID
 * 3. 在环境变量或配置中设置 GITHUB_TOKEN 和 GIST_ID
 */

const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
const GIST_FILENAME = 'cloud-share-data.json'

// 调试：检查环境变量是否加载
console.log('环境变量检查:')
console.log('- VITE_GIST_ID:', GIST_ID ? `${GIST_ID.substring(0, 8)}...` : '❌ 未设置')
console.log('- VITE_GITHUB_TOKEN:', GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 8)}...` : '❌ 未设置')
console.log('- 环境模式:', import.meta.env.MODE)
console.log('- 是否为生产环境:', import.meta.env.PROD)

if (!GITHUB_TOKEN) {
  console.error('⚠️ VITE_GITHUB_TOKEN 未设置！')
  if (import.meta.env.PROD) {
    console.error('   生产环境：请检查 GitHub Secrets 中是否配置了 VITE_GITHUB_TOKEN')
  } else {
    console.error('   开发环境：请检查 .env 文件')
  }
}
if (!GIST_ID) {
  console.error('⚠️ VITE_GIST_ID 未设置！')
  if (import.meta.env.PROD) {
    console.error('   生产环境：请检查 GitHub Secrets 中是否配置了 VITE_GIST_ID')
  } else {
    console.error('   开发环境：请检查 .env 文件')
  }
}

// GitHub API 基础 URL
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * 获取 Gist 数据
 */
export async function getGistData() {
  // 必须同时提供 GIST_ID 和 GITHUB_TOKEN
  if (!GIST_ID || !GITHUB_TOKEN) {
    throw new Error('GitHub Gist 未配置，请检查 .env 文件中的 VITE_GIST_ID 和 VITE_GITHUB_TOKEN')
  }

  console.log('正在获取 Gist 数据，GIST_ID:', GIST_ID)
  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  console.log('API 响应状态:', response.status, response.statusText)

  if (!response.ok) {
    if (response.status === 404) {
      console.warn('Gist 不存在 (404)，返回空数据')
      return { links: [], lastUpdate: null }
    }
    if (response.status === 401) {
      const errorText = await response.text()
      console.error('认证失败 (401)，请检查 Token 是否正确:', errorText)
      throw new Error('GitHub Token 无效或已过期，请检查 VITE_GITHUB_TOKEN')
    }
    if (response.status === 403) {
      const errorText = await response.text()
      console.error('权限不足 (403):', errorText)
      throw new Error('权限不足，请确保 Token 有 gist 权限')
    }
    const errorText = await response.text()
    console.error(`GitHub API 错误 (${response.status}):`, errorText)
    throw new Error(`GitHub API 错误: ${response.status} - ${response.statusText}`)
  }

  const gist = await response.json()
  console.log('Gist 获取成功:', gist.description)
  
  const file = gist.files[GIST_FILENAME]
  
  if (!file) {
    console.warn(`Gist 中未找到文件 ${GIST_FILENAME}，返回空数据`)
    return { links: [], lastUpdate: null }
  }

  const content = JSON.parse(file.content)
  console.log('数据加载成功，链接数量:', content.links?.length || 0)
  return content
}

/**
 * 保存数据到 Gist
 */
export async function saveGistData(data) {
  // 必须同时提供 GIST_ID 和 GITHUB_TOKEN
  if (!GIST_ID || !GITHUB_TOKEN) {
    throw new Error('GitHub Gist 未配置，请检查 .env 文件中的 VITE_GIST_ID 和 VITE_GITHUB_TOKEN')
  }

  console.log('正在保存数据到 Gist，GIST_ID:', GIST_ID)
  
  // 先获取现有 Gist 验证配置
  const checkResponse = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })
  
  console.log('获取 Gist 响应状态:', checkResponse.status)
  
  if (!checkResponse.ok) {
    if (checkResponse.status === 404) {
      const errorText = await checkResponse.text()
      console.error('Gist 不存在 (404):', errorText)
      throw new Error('Gist 不存在，请检查 GIST_ID 是否正确')
    } else if (checkResponse.status === 401) {
      const errorText = await checkResponse.text()
      console.error('认证失败 (401):', errorText)
      throw new Error('GitHub Token 无效或已过期')
    } else if (checkResponse.status === 403) {
      const errorText = await checkResponse.text()
      console.error('权限不足 (403):', errorText)
      throw new Error('权限不足，请确保 Token 有 gist 权限')
    } else {
      const errorText = await checkResponse.text()
      console.error(`获取 Gist 失败 (${checkResponse.status}):`, errorText)
      throw new Error(`获取 Gist 失败: ${checkResponse.status} - ${checkResponse.statusText}`)
    }
  }

  const gist = await checkResponse.json()
  console.log('Gist 获取成功，准备更新')

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

  // 更新现有的 Gist
  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  console.log('保存 Gist 响应状态:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `保存失败: ${response.status} - ${response.statusText}`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // 如果不是 JSON，使用原始文本
      errorMessage = errorText || errorMessage
    }
    console.error('保存失败:', errorMessage)
    throw new Error(errorMessage)
  }

  const result = await response.json()
  console.log('数据保存成功，Gist ID:', result.id)
  return result
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

