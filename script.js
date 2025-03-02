const USERNAME = '你的GitHub用户名';
const REPO = '你的仓库名';
const TOKEN = '你的token';

// 获取文章列表
async function loadArticles() {
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
        document.getElementById('articleList').innerHTML = html;
}

// 保存文章
async function saveArticle() {
        const title = prompt('输入文章标题:');
        const content = SimpleMDE.value();

        await fetch(
                `https://api.github.com/repos/${USERNAME}/${REPO}/contents/articles/${title}.md`,
                {
                        method: 'PUT',
                        headers: { Authorization: `token ${TOKEN}` },
                        body: JSON.stringify({
                                message: 'Add new article',
                                content: btoa(unescape(encodeURIComponent(content)))
                        })
                }
        );
        loadArticles();
}

// 初始化编辑器
const SimpleMDE = new SimpleMDE({ element: document.getElementById('editor') });

// 显示编辑器
function showEditor() {
        document.getElementById('editorPanel').style.display = 'block';
        SimpleMDE.value('');
}

// 初始化加载
loadArticles();