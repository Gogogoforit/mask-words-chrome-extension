// 监听存储中的开关状态，确保默认不开启
chrome.storage.local.get("enabled", function (data) {
    if (data.enabled === true) { // 仅在存储中为 true 时才启用
        scrambleText();
    }
});

// 监听网页内容变化（MutationObserver 处理动态加载内容）
function scrambleText() {
    const observer = new MutationObserver(() => {
        document.body.querySelectorAll("*").forEach(el => {
            el.childNodes.forEach(node => {
                // 确保是文本节点，并且不是纯空格
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") { 
                    node.nodeValue = node.nodeValue.split("").map(c => "X").join("");
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// 立即运行一次（仅当存储值为 true 时）
chrome.storage.local.get("enabled", function (data) {
    if (data.enabled === true) {
        scrambleText();
    }
});
