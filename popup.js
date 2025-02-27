document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("toggle");

    // 获取当前状态，并更新按钮 UI
    chrome.storage.local.get({ enabled: false }, function (data) {
        updateButton(data.enabled);
    });

    button.addEventListener("click", function () {
        chrome.storage.local.get("enabled", function (data) {
            const newState = !data.enabled; // 切换状态
            chrome.storage.local.set({ enabled: newState }, function () {
                updateButton(newState);

                // 获取当前标签页
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs.length > 0) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            function: toggleScrambleText, // Runs function below
                            args: [newState]
                        });
                    }
                });
            });
        });
    });

    function updateButton(enabled) {
        button.textContent = enabled ? "Close Mask" : "Open Mask";
        button.className = enabled ? "off" : "";
    }
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
