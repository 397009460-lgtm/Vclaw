// Vclaw 聊天模块 - 2026 版

const API_BASE = '/api';

// 检查登录状态
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/index.html';
}

// 更新用户信息
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (document.getElementById('userName')) {
  document.getElementById('userName').textContent = user.username || '用户';
}

// 更新 Token 显示
function updateTokenCount(count) {
  const tokenEl = document.getElementById('tokenCount');
  if (tokenEl) {
    tokenEl.textContent = `${count} tokens`;
  }
}

// 加载用户信息
async function loadUserInfo() {
  try {
    const response = await fetch(`${API_BASE}/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      updateTokenCount(data.tokens || 0);
    }
  } catch (error) {
    console.error('加载用户信息失败:', error);
  }
}

// 发送消息
const chatForm = document.getElementById('chatForm');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

if (chatForm && chatMessages && messageInput) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // 添加用户消息
    appendMessage('user', message);
    messageInput.value = '';
    
    // 显示加载状态
    const loadingId = appendMessage('assistant', '思考中...', true);
    
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      
      // 移除加载状态，显示实际回复
      removeMessage(loadingId);
      
      if (response.ok) {
        appendMessage('assistant', data.reply || '暂无回复');
        updateTokenCount(data.remainingTokens || 0);
      } else {
        appendMessage('system', `错误：${data.error || '请求失败'}`);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      removeMessage(loadingId);
      appendMessage('system', '网络错误，请稍后重试');
    }
  });
  
  // 自动调整 textarea 高度
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
  });
}

// 添加消息到聊天
function appendMessage(role, content, isLoading = false) {
  const id = 'msg-' + Date.now();
  const messageEl = document.createElement('div');
  messageEl.id = id;
  messageEl.className = `message message-${role} ${isLoading ? 'loading' : ''}`;
  messageEl.innerHTML = `
    <div class="message-avatar">${role === 'user' ? '👤' : '🤖'}</div>
    <div class="message-content">${escapeHtml(content)}</div>
  `;
  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

// 移除消息
function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 新对话按钮
const newChatBtn = document.getElementById('newChatBtn');
if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    if (confirm('确定要开始新对话吗？')) {
      chatMessages.innerHTML = `
        <div class="welcome-message">
          <h2>欢迎来到 Vclaw</h2>
          <p>有什么我可以帮助你的吗？</p>
        </div>
      `;
    }
  });
}

// 初始化
loadUserInfo();
