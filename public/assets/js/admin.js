// Vclaw 管理后台模块 - 2026 版

const API_BASE = '/api';

// 检查管理员登录
const adminToken = localStorage.getItem('adminToken');
const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

// 如果是登录页面
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        window.location.href = '/admin.html';
      } else {
        alert(data.error || '登录失败');
      }
    } catch (error) {
      console.error('管理员登录错误:', error);
      alert('网络错误，请稍后重试');
    }
  });
} 
// 如果是管理后台页面
else if (document.querySelector('.admin-container')) {
  if (!adminToken) {
    window.location.href = '/admin-login.html';
  }
  
  // 更新管理员名称
  if (document.getElementById('adminName')) {
    document.getElementById('adminName').textContent = adminUser.username || '管理员';
  }
  
  // 加载统计数据
  loadDashboard();
  
  // 导航处理
  document.querySelectorAll('.admin-nav .nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      const section = this.getAttribute('href').substring(1);
      document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
      document.getElementById(section)?.style.display = 'block';
      document.getElementById('pageTitle').textContent = this.textContent.trim();
    });
  });
}

// 加载仪表盘数据
async function loadDashboard() {
  try {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (document.getElementById('totalUsers')) {
        document.getElementById('totalUsers').textContent = data.totalUsers || 0;
      }
      if (document.getElementById('todayActive')) {
        document.getElementById('todayActive').textContent = data.todayActive || 0;
      }
      if (document.getElementById('tokenUsage')) {
        document.getElementById('tokenUsage').textContent = (data.tokenUsage || 0).toLocaleString();
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
}

// 退出登录
function adminLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin-login.html';
}
