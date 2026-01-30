/**
 * 数据 API 工具
 * 使用 Supabase 作为数据库（通过 Vercel Serverless Functions）
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 获取所有链接
 */
export async function getLinks() {
  if (!API_BASE_URL) {
    throw new Error('API 未配置，请检查环境变量 VITE_API_BASE_URL')
  }

  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '获取数据失败')
  }

  const result = await response.json()
  return result
}

/**
 * 创建新链接
 */
export async function createLink(linkData) {
  if (!API_BASE_URL) {
    throw new Error('API 未配置，请检查环境变量 VITE_API_BASE_URL')
  }

  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(linkData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '创建链接失败')
  }

  const result = await response.json()
  return result.data
}

/**
 * 更新链接
 */
export async function updateLink(linkId, linkData) {
  if (!API_BASE_URL) {
    throw new Error('API 未配置，请检查环境变量 VITE_API_BASE_URL')
  }

  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      linkId,
      data: linkData
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '更新链接失败')
  }

  const result = await response.json()
  return result.data
}

/**
 * 删除链接
 */
export async function deleteLink(linkId) {
  if (!API_BASE_URL) {
    throw new Error('API 未配置，请检查环境变量 VITE_API_BASE_URL')
  }

  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ linkId })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '删除链接失败')
  }

  return true
}

/**
 * 增加下载次数
 */
export async function incrementDownloadCount(linkId) {
  if (!API_BASE_URL) {
    throw new Error('API 未配置，请检查环境变量 VITE_API_BASE_URL')
  }

  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'increment',
      linkId
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '更新下载次数失败')
  }

  const result = await response.json()
  return result.downloadCount || 0
}

/**
 * 兼容旧 API（向后兼容）
 */
export async function getGistData() {
  const result = await getLinks()
  // 转换数据格式以兼容旧代码
  return {
    links: result.links.map(link => ({
      id: link.id,
      name: link.name,
      url: link.url,
      code: link.code,
      description: link.description,
      tags: link.tags || [],
      downloadCount: link.download_count || 0,
      createTime: link.create_time
    })),
    lastUpdate: result.lastUpdate,
    version: result.version
  }
}

/**
 * 保存数据（兼容旧 API）
 */
export async function saveGistData(data) {
  // 这个函数主要用于批量保存，但我们现在使用单个链接的 CRUD
  // 为了兼容，我们返回成功
  return { success: true }
}
