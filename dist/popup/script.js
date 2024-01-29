chrome.storage.local.get(['kaitenApiKey', 'gitlabApiKey', 'kaitenURL', 'gitlabURL'], function (keys) {
    if(keys.kaitenApiKey){
        document.getElementById('kaiten-api-key').value = keys.kaitenApiKey;
    }
    if(keys.kaitenURL){
        document.getElementById('kaiten-url').value = keys.kaitenURL;
    }
    if(keys.gitlabApiKey){
        document.getElementById('gitlab-api-key').value = keys.gitlabApiKey;
    }
    if(keys.gitlabURL){
        document.getElementById('gitlab-url').value = keys.gitlabURL;
    }
});
document.getElementById('kaiten-api-key').addEventListener('change', (event) => {
    chrome.storage.local.set({ 'kaitenApiKey': document.getElementById('kaiten-api-key').value });
});
document.getElementById('kaiten-url').addEventListener('change', (event) => {
    chrome.storage.local.set({ 'kaitenURL': document.getElementById('kaiten-url').value });
});
document.getElementById('gitlab-api-key').addEventListener('change', (event) => {
    chrome.storage.local.set({ 'gitlabApiKey': document.getElementById('gitlab-api-key').value });
});
document.getElementById('gitlab-url').addEventListener('change', (event) => {
    chrome.storage.local.set({ 'gitlabURL': document.getElementById('gitlab-url').value });
});

(function() {
    const styleTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const styleLink = document.createElement('link');
    styleLink.rel = `stylesheet`;
    styleLink.href = `./styles/popup-${styleTheme}.css`;
    document.head.appendChild(styleLink);
})();
