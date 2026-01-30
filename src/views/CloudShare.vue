<template>
  <div class="cloud-share">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>网盘链接分享</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加链接
          </el-button>
        </div>
      </template>

      <!-- 搜索和统计 -->
      <div class="toolbar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索链接名称、描述或标签..."
          clearable
          style="max-width: 400px;"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <div class="stats">
          <el-statistic title="总链接数" :value="totalLinks" />
          <el-statistic title="总下载次数" :value="totalDownloads" />
        </div>
      </div>

      <!-- 链接列表 -->
      <el-table
        :data="filteredLinks"
        stripe
        style="width: 100%; margin-top: 20px;"
        v-loading="loading"
        empty-text="暂无链接，点击上方按钮添加"
      >
        <el-table-column prop="name" label="链接名称" width="200" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="tags" label="标签" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              style="margin-right: 5px;"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="downloadCount" label="下载次数" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.downloadCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleDownload(row)"
            >
              <el-icon><Download /></el-icon>
              下载
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row.id)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingLink ? '编辑链接' : '添加链接'"
      width="600px"
    >
      <el-form
        :model="linkForm"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="链接名称" prop="name">
          <el-input v-model="linkForm.name" placeholder="请输入链接名称" />
        </el-form-item>
        
        <el-form-item label="链接地址" prop="url">
          <el-input
            v-model="linkForm.url"
            placeholder="请输入网盘链接地址（如：百度网盘、阿里云盘等）"
          />
        </el-form-item>
        
        <el-form-item label="提取码" prop="code">
          <el-input
            v-model="linkForm.code"
            placeholder="请输入提取码（可选）"
            maxlength="20"
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="linkForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入链接描述"
          />
        </el-form-item>
        
        <el-form-item label="标签">
          <el-select
            v-model="linkForm.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或输入标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in commonTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Download, Delete } from '@element-plus/icons-vue'
import { getGistData, saveGistData, incrementDownloadCount } from '../utils/githubStorage'

// 数据
const links = ref([])
const searchKeyword = ref('')
const loading = ref(false)
const showAddDialog = ref(false)
const editingLink = ref(null)
const formRef = ref(null)

// 常用标签
const commonTags = ref(['学习资料', '软件工具', '影视资源', '游戏', '电子书', '音乐', '图片', '其他'])

// 表单数据
const linkForm = ref({
  name: '',
  url: '',
  code: '',
  description: '',
  tags: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入链接名称', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入链接地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

// 计算属性
const filteredLinks = computed(() => {
  if (!searchKeyword.value) {
    return links.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return links.value.filter(link => {
    return (
      link.name.toLowerCase().includes(keyword) ||
      link.description.toLowerCase().includes(keyword) ||
      link.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  })
})

const totalLinks = computed(() => links.value.length)

const totalDownloads = computed(() => {
  return links.value.reduce((sum, link) => sum + link.downloadCount, 0)
})

// 从 GitHub Gists 或本地存储加载数据
const loadLinks = async () => {
  loading.value = true
  try {
    const data = await getGistData()
    if (data && data.links) {
      links.value = data.links
    } else {
      links.value = []
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.warning('加载数据失败，使用本地存储')
    // 尝试从本地存储加载
    try {
      const stored = localStorage.getItem('cloud_share_links')
      if (stored) {
        const localData = JSON.parse(stored)
        links.value = localData.links || []
      }
    } catch (e) {
      links.value = []
    }
  } finally {
    loading.value = false
  }
}

// 保存数据到 GitHub Gists 或本地存储
const saveLinks = async () => {
  try {
    const data = {
      links: links.value,
      version: '1.0.0'
    }
    await saveGistData(data)
  } catch (error) {
    console.error('保存数据失败:', error)
    // 失败时保存到本地存储作为备份
    try {
      localStorage.setItem('cloud_share_links', JSON.stringify({
        links: links.value,
        lastUpdate: new Date().toISOString()
      }))
    } catch (e) {
      ElMessage.error('保存数据失败')
    }
  }
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

// 下载处理
const handleDownload = async (link) => {
  try {
    // 增加下载次数（使用 GitHub API）
    await incrementDownloadCount(link.id)
    // 重新加载数据以获取最新统计
    await loadLinks()
    
    // 打开链接
    window.open(link.url, '_blank')
    
    ElMessage.success('已打开链接，下载次数已更新')
  } catch (error) {
    // 如果 API 失败，仍然打开链接，但只更新本地
    link.downloadCount = (link.downloadCount || 0) + 1
    saveLinks()
    window.open(link.url, '_blank')
    ElMessage.warning('统计更新失败，但链接已打开')
  }
}

// 删除处理
const handleDelete = async (id) => {
  ElMessageBox.confirm(
    '确定要删除这个链接吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const index = links.value.findIndex(link => link.id === id)
    if (index > -1) {
      links.value.splice(index, 1)
      await saveLinks()
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (editingLink.value) {
        // 编辑模式
        const index = links.value.findIndex(link => link.id === editingLink.value.id)
        if (index > -1) {
          links.value[index] = {
            ...links.value[index],
            ...linkForm.value
          }
        }
        ElMessage.success('编辑成功')
      } else {
        // 添加模式
        const newLink = {
          id: Date.now(),
          ...linkForm.value,
          downloadCount: 0,
          createTime: new Date().toLocaleString('zh-CN')
        }
        links.value.unshift(newLink)
        ElMessage.success('添加成功')
      }
      
      await saveLinks()
      resetForm()
      showAddDialog.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  linkForm.value = {
    name: '',
    url: '',
    code: '',
    description: '',
    tags: []
  }
  editingLink.value = null
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 初始化
onMounted(() => {
  loadLinks()
})
</script>

<style scoped>
.cloud-share {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.stats {
  display: flex;
  gap: 30px;
}

:deep(.el-statistic__head) {
  font-size: 14px;
  color: #666;
}

:deep(.el-statistic__number) {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats {
    justify-content: space-around;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .card-header .el-button {
    width: 100%;
  }
}
</style>
