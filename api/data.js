/**
 * 数据存储 API
 * 使用 Supabase 作为数据库（替代 GitHub Gists）
 * 通过 Vercel Serverless Functions 提供 API
 */

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Supabase 未配置，请检查环境变量 SUPABASE_URL 和 SUPABASE_ANON_KEY' 
    })
  }

  try {
    const { action, linkId, data } = req.body || {}

    if (req.method === 'GET') {
      // 获取所有链接
      return await getLinks(res, supabaseUrl, supabaseKey)
    } else if (req.method === 'POST' && action === 'increment') {
      // 增加下载次数
      return await incrementDownload(res, supabaseUrl, supabaseKey, linkId)
    } else if (req.method === 'POST') {
      // 创建新链接
      return await createLink(res, supabaseUrl, supabaseKey, data)
    } else if (req.method === 'PATCH') {
      // 更新链接
      return await updateLink(res, supabaseUrl, supabaseKey, linkId, data)
    } else if (req.method === 'DELETE') {
      // 删除链接
      const { linkId } = req.body || {}
      return await deleteLink(res, supabaseUrl, supabaseKey, linkId)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}

/**
 * 获取所有链接
 */
async function getLinks(res, supabaseUrl, supabaseKey) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/links?select=*&order=create_time.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`获取数据失败: ${response.status} - ${error}`)
    }

    const links = await response.json()
    
    return res.status(200).json({
      links: links || [],
      lastUpdate: links.length > 0 ? links[0].update_time : null,
      version: '1.0.0'
    })
  } catch (error) {
    console.error('Get links error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 创建新链接
 */
async function createLink(res, supabaseUrl, supabaseKey, data) {
  if (!data || !data.name || !data.url) {
    return res.status(400).json({ error: '链接名称和URL是必需的' })
  }

  try {
    const linkData = {
      name: data.name,
      url: data.url,
      code: data.code || '',
      description: data.description || '',
      tags: data.tags || [],
      download_count: 0,
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/links`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(linkData)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`创建链接失败: ${response.status} - ${error}`)
    }

    const result = await response.json()
    return res.status(200).json({ success: true, data: result[0] || result })
  } catch (error) {
    console.error('Create link error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 更新链接
 */
async function updateLink(res, supabaseUrl, supabaseKey, linkId, data) {
  if (!linkId) {
    return res.status(400).json({ error: '链接ID是必需的' })
  }

  try {
    const updateData = {
      ...data,
      update_time: new Date().toISOString()
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${linkId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`更新链接失败: ${response.status} - ${error}`)
    }

    const result = await response.json()
    return res.status(200).json({ success: true, data: result[0] || result })
  } catch (error) {
    console.error('Update link error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 删除链接
 */
async function deleteLink(res, supabaseUrl, supabaseKey, linkId) {
  if (!linkId) {
    return res.status(400).json({ error: '链接ID是必需的' })
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${linkId}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`删除链接失败: ${response.status} - ${error}`)
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 增加下载次数
 */
async function incrementDownload(res, supabaseUrl, supabaseKey, linkId) {
  if (!linkId) {
    return res.status(400).json({ error: '链接ID是必需的' })
  }

  try {
    // 先获取当前链接
    const getResponse = await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${linkId}&select=download_count`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!getResponse.ok) {
      throw new Error('获取链接失败')
    }

    const links = await getResponse.json()
    if (!links || links.length === 0) {
      return res.status(404).json({ error: '链接不存在' })
    }

    const currentCount = links[0].download_count || 0
    const newCount = currentCount + 1

    // 更新下载次数
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/links?id=eq.${linkId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        download_count: newCount,
        update_time: new Date().toISOString()
      })
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      throw new Error(`更新下载次数失败: ${updateResponse.status} - ${error}`)
    }

    const result = await updateResponse.json()
    return res.status(200).json({ 
      success: true, 
      downloadCount: newCount,
      data: result[0] || result
    })
  } catch (error) {
    console.error('Increment download error:', error)
    return res.status(500).json({ error: error.message })
  }
}
