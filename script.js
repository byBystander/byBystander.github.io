// -------------------- 第一步：初始化编辑器（必须放在最前面！）--------------------
const SimpleMDE = new SimpleMDE({
        element: document.getElementById('editor'),
        toolbar: ["bold", "italic", "heading", "|", "preview"] // 精简工具栏
});

// -------------------- 第二步：配置常量 --------------------
const USERNAME = 'byBystander';
const REPO = 'byBystander.github.io';
const TOKEN = '你的Token'; // 替换成你的真实Token

// -------------------- 第三步：定义功能函数 --------------------
async function loadArticles() {
        try {
                const response = await fetch(
                        `https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles`,
                        { headers: { Authorization: `token ${TOKEN}` } }
                );
                const files = await response.json();

                let html = '';
                files.forEach(file => {
                        html += `<div class="article-item">
        <h3>${file.name.replace('.md', '')}</h3>
        <button onclick="editArticle('${file.name}')">编辑</button>
      </div>`;
                });

                document.getElementById('articleList').innerHTML = html || '暂无文章';
        } catch (error) {
                console.error('加载失败:', error);
        }
}

async function saveArticle() {
        const title = prompt('输入文章标题:');
        const content = SimpleMDE.value(); // 现在可以正确访问编辑器内容

        await fetch(
                `https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles/${title}.md`,
                {
                        method: 'PUT',
                        headers: { Authorization: `token ${TOKEN}` },
                        body: JSON.stringify({
                                message: '添加新文章',
                                content: btoa(unescape(encodeURIComponent(content)))
                        })
                }
        );

        loadArticles();
        document.getElementById('editorPanel').style.display = 'none';
}

// -------------------- 第四步：其他辅助函数 --------------------
function showEditor() {
        document.getElementById('editorPanel').style.display = 'block';
        SimpleMDE.value(''); // 清空编辑器
}

// -------------------- 第五步：初始化加载 --------------------
document.addEventListener('DOMContentLoaded', () => {
        loadArticles();
});