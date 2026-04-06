// Vclaw 认证模块 - 2026 版

const API_BASE = '/api';

// 登录表单处理
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/chat.html';
      } else {
        alert(data.error || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      alert('网络错误，请稍后重试');
    }
  });
}

// 注册表单处理
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('注册成功，请登录');
        window.location.href = '/index.html';
      } else {
        alert(data.error || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      alert('网络错误，请稍后重试');
    }
  });
}

// 检查登录状态
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token && !window.location.pathname.includes('index.html') && !window.location.pathname.includes('register.html')) {
    window.location.href = '/index.html';
  }
  return token;
}

// 退出登录
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}
