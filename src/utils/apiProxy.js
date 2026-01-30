/**
 * API 代理工具
 * 如果配置了 API_PROXY_URL，使用代理；否则直接调用 GitHub API
 */

const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || ''
const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''
const GIST_FILENAME = 'cloud-share-data.json'
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * 获取 Gist 数据
 */
export async function getGistData() {
  // 如果配置了代理 URL，使用代理
  if (API_PROXY_URL) {
    return getGistDataViaProxy()
  }

  // 否则直接调用 GitHub API（需要 Token）
  if (!GIST_ID || !GITHUB_TOKEN) {
    throw new Error('GitHub Gist 未配置，请检查环境变量')
  }

  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      return { links: [], lastUpdate: null }
    }
    const errorText = await response.text()
    let errorMessage = `GitHub API 错误: ${response.status}`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // 不是 JSON
    }
    throw new Error(errorMessage)
  }

  const gist = await response.json()
  const file = gist.files[GIST_FILENAME]
  
  if (!file) {
    return { links: [], lastUpdate: null }
  }

  return JSON.parse(file.content)
}

/**
 * 通过代理获取 Gist 数据
 */
async function getGistDataViaProxy() {
  if (!GIST_ID) {
    throw new Error('GIST_ID 未配置')
  }

  // Vercel Serverless Function 路径
  const proxyUrl = API_PROXY_URL.endsWith('/') 
    ? `${API_PROXY_URL}api/github-proxy`
    : `${API_PROXY_URL}/api/github-proxy`
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'get',
      gistId: GIST_ID
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '获取数据失败')
  }

  return await response.json()
}

/**
 * 保存数据到 Gist
 */
export async function saveGistData(data) {
  // 如果配置了代理 URL，使用代理
  if (API_PROXY_URL) {
    return saveGistDataViaProxy(data)
  }

  // 否则直接调用 GitHub API（需要 Token）
  if (!GIST_ID || !GITHUB_TOKEN) {
    throw new Error('GitHub Gist 未配置，请检查环境变量')
  }

  // 先验证 Gist 存在
  const checkResponse = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })

  if (!checkResponse.ok) {
    if (checkResponse.status === 404) {
      throw new Error('Gist 不存在，请检查 GIST_ID')
    }
    const errorText = await checkResponse.text()
    let errorMessage = `获取 Gist 失败: ${checkResponse.status}`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // 不是 JSON
    }
    throw new Error(errorMessage)
  }

  // 更新 Gist
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

  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `保存失败: ${response.status}`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      errorMessage = errorText || errorMessage
    }
    throw new Error(errorMessage)
  }

  return await response.json()
}

/**
 * 通过代理保存 Gist 数据
 */
async function saveGistDataViaProxy(data) {
  if (!GIST_ID) {
    throw new Error('GIST_ID 未配置')
  }

  // Vercel Serverless Function 路径
  const proxyUrl = API_PROXY_URL.endsWith('/') 
    ? `${API_PROXY_URL}api/github-proxy`
    : `${API_PROXY_URL}/api/github-proxy`
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'update',
      gistId: GIST_ID,
      data: data
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '保存数据失败')
  }

  return await response.json()
}

/**
 * 增加下载次数
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
