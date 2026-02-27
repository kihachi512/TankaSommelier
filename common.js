// ==========================================
// 共通定数・アイコン定義
// ==========================================
const iconEyeOpen = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const iconEyeClosed = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

// ==========================================
// カスタムポップアップ機能
// ==========================================
function customAlert(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const text = document.createElement('p');
        text.innerText = message; // 安全のためinnerTextを使用
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'custom-modal-buttons';
        
        const okBtn = document.createElement('button');
        okBtn.innerText = 'OK';
        okBtn.onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => { document.body.removeChild(overlay); resolve(); }, 200);
        };
        
        btnContainer.appendChild(okBtn);
        modal.appendChild(text);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => overlay.classList.add('show'));
    });
}

function customConfirm(message, confirmText = 'OK', isDanger = false) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const text = document.createElement('p');
        text.innerText = message; // 安全のためinnerTextを使用
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'custom-modal-buttons';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-cancel';
        cancelBtn.innerText = 'キャンセル';
        cancelBtn.onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => { document.body.removeChild(overlay); resolve(false); }, 200);
        };
        
        const okBtn = document.createElement('button');
        okBtn.innerText = confirmText;
        if (isDanger) okBtn.className = 'btn-danger';
        
        okBtn.onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => { document.body.removeChild(overlay); resolve(true); }, 200);
        };
        
        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(okBtn);
        modal.appendChild(text);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => overlay.classList.add('show'));
    });
}

// ==========================================
// 認証・UI関連機能
// ==========================================
function checkLoginStatus() {
    const nickname = localStorage.getItem('tanka_nickname');
    const sub = localStorage.getItem('tanka_sub'); 
    const statusBar = document.getElementById('userStatusBar');
    const postAuthor = document.getElementById('postAuthor'); // index.html用
    
    if (!statusBar) return;
    
    if (nickname && sub) {
        statusBar.innerHTML = `
            ようこそ、<a href="author.html?user_id=${encodeURIComponent(sub)}&author=${encodeURIComponent(nickname)}" style="color: #2c5e3b;">${nickname}</a> さん！
            <span style="color: #ccc; margin: 0 5px;">|</span>
            <a href="settings.html" style="color: #555; text-decoration: none;">⚙️ 設定</a>
            <span style="color: #ccc; margin: 0 5px;">|</span>
            <a href="#" onclick="logOut()" style="color: #7f8c8d; text-decoration: none;">ログアウト</a>
        `;
        if (postAuthor) postAuthor.value = nickname; 
    } else {
        statusBar.innerHTML = `<a href="login.html" style="color: #d35400; text-decoration: none;">👤 新規登録 / ログイン</a>`;
        if (postAuthor) postAuthor.value = '詠み人知らず'; 
    }
}

function logOut(redirectUrl) {
    localStorage.removeItem('tanka_nickname');
    localStorage.removeItem('tanka_access_token');
    localStorage.removeItem('tanka_sub'); 
    Object.keys(localStorage).forEach(key => {
        if(key.startsWith('CognitoIdentityServiceProvider')) localStorage.removeItem(key);
    });
    if (redirectUrl) {
        window.location.href = redirectUrl;
    } else {
        window.location.href = 'index.html';
    }
}

function toggleVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.innerHTML = iconEyeOpen;
    } else {
        input.type = "password";
        iconElement.innerHTML = iconEyeClosed;
    }
}