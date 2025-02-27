// 监听插件安装或更新
chrome.runtime.onInstalled.addListener(() => {
    console.log("Mask Words is already installed");

    // 设置默认状态为 "开启"
    chrome.storage.local.set({ enabled: true });
});

// 监听用户点击插件图标
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get("enabled", (data) => {
        const newState = !data.enabled;
        chrome.storage.local.set({ enabled: newState });

        // 更新图标提示信息
        chrome.action.setTitle({ tabId: tab.id, title: newState ? "Mask Mode：Open" : "Mask Mode：Closed" });

        // 在当前标签页运行 content.js 逻辑
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: toggleScrambleText,
            args: [newState]
        });
    });
});

// 让当前页面的文本变成乱码或恢复
function toggleScrambleText(enabled) {
    if (enabled) {
        document.body.querySelectorAll("*").forEach(el => {
            if (el.childNodes.length === 1 && el.firstChild.nodeType === 3) { 
                el.firstChild.dataset.originalText = el.firstChild.textContent; // 备份原始文本
                el.firstChild.textContent = el.firstChild.textContent.split("").map(c => "☠").join("");
            }
        });
    } else {
        document.body.querySelectorAll("*").forEach(el => {
            if (el.childNodes.length === 1 && el.firstChild.nodeType === 3 && el.firstChild.dataset.originalText) { 
                el.firstChild.textContent = el.firstChild.dataset.originalText; // 还原文本
                delete el.firstChild.dataset.originalText;
            }
        });
    }
}
