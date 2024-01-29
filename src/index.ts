import { ApiFileType } from "widget/api/index";
import { StartKaitenFileType } from "startKaiten";
import { StartGitlabFileType } from "startGitlab";

; (async function () {
  const srcApi = chrome.runtime.getURL("widget/api/index.js");
  const apiFile: ApiFileType = await import(srcApi);
  const { ApiClient } = apiFile;

  const apiClient = new ApiClient();

  const srcData = await apiClient.initTokens();

  if (apiClient.kaitenURL && srcData.kaitenURL) {
    const kaitenDomenResult = /^http[s]{0,1}:\/\/([\w,\W]+)/.exec(apiClient.kaitenURL);
    if (kaitenDomenResult) {
      const kaitenDomen = kaitenDomenResult[1];
      if (kaitenDomen && kaitenDomen === window.location.host) {
        const srcStart = chrome.runtime.getURL("startKaiten.js");
        const startFile: StartKaitenFileType = await import(srcStart);
        const { startKaiten } = startFile;
        startKaiten(apiClient);
        return;
      }
    }
  }

  if (apiClient.gitlabURL && srcData.gitlabURL) {
    const gitlabDomenResult = /^http[s]{0,1}:\/\/([\w,\W]+)/.exec(apiClient.gitlabURL);
    if (gitlabDomenResult) {
      const gitlabDomen = gitlabDomenResult[1];
      if (gitlabDomen && gitlabDomen === window.location.host) {
        const srcStart = chrome.runtime.getURL("startGitlab.js");
        const startFile: StartGitlabFileType = await import(srcStart);
        const { startGitlab } = startFile;
        startGitlab(apiClient);
        return;
      }
    }
    
  }  
})();
