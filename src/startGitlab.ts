import { ApiClient } from "widget/api/index";
import { HTMLFileType } from "widget/html/index";
import { StylesType } from "widget/styles/gitlabStyles";

const regexMap = {
  branchesList: /\/(-)\/(branches)(\/[A-Z0-9][A-Z0-9_-]*){0,1}/i,
  files: /\/-\/tree\//i,
  commits: /\/-\/commits\/((?=[\w\W])[^?]*)/i,
  mergeRequests: /\/-\/merge_requests(?!\/)/i,
  mergeRequest: /\/-\/merge_requests\//i,
};

export async function startGitlab(apiClient: ApiClient) {
  const prefix = 'kaiten-gitlab-integration-extension';
  const c = (cl: string) => `${prefix}_${cl}`;

  const srcStyles = chrome.runtime.getURL("widget/styles/gitlabStyles.js");
  const styles: StylesType = await import(srcStyles);

  const srcHtml = chrome.runtime.getURL("widget/html/index.js");
  const htmlFile: HTMLFileType = await import(srcHtml);
  const htmlMethods = htmlFile.getAll(c);
  const {
    getKaitenLink
  } = htmlMethods;

  let actiovationInProcess = false;
  let isActive = false;
  let prevPathName: string | null = null;

  function generateKaitenLink(branchName: string): string | null {
    const result = /(\d{7,8})/.exec(branchName);
    if (!result) return null;
    return `${apiClient.kaitenURL}/${result[1]}`;
  }

  function init(callbackStart: () => void) {
    styles.initStyle(prefix, []);
    callbackStart();
  }

  function startBranchList() {
    document.querySelectorAll('a[data-qa-selector="branch_link"]').forEach((item) => {
      const linkEl = item as HTMLAnchorElement;
      const branchName = linkEl.href.split('/').slice(-1)[0];
      if (!branchName) return;
      const link = generateKaitenLink(branchName);
      if (!link) return;
      linkEl.insertAdjacentHTML('afterend', getKaitenLink(link));
    });
    isActive = true;
    actiovationInProcess = false;
  }

  function startAfterSelector(branchName: string, type: 'files' | 'commits') {
    const rootId = type === 'files' ? 'tree-holder' : 'content-body';
    const link = generateKaitenLink(branchName);
    const branchSelector = document.querySelector(`#${rootId} .tree-ref-holder`);
    const parent = branchSelector?.parentNode as HTMLDivElement;

    if (parent) {
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
    }

    const breadcrumbSelector = document.querySelector(`#${rootId} .tree-ref-holder + .repo-breadcrumb`) as HTMLUListElement;    
    if (breadcrumbSelector?.style)
      breadcrumbSelector.style.display = 'inline-flex';

    if (!branchSelector || !link) return;

    branchSelector.insertAdjacentHTML('afterend', getKaitenLink(link, c('kaiten-link-big')));
    isActive = true;
    actiovationInProcess = false;
  }

  function startMR() {
    // по такому селектору есть две ссылки - а1 сливаем в а2
    // querySelector берет первую
    const linkEl = document.querySelector('.merge-request-details .detail-page-description [href*="/-/tree/"]');
    if (!linkEl) return;
    const branchName = linkEl.innerHTML;
    if (!branchName) return;
    const link = generateKaitenLink(branchName);
    if (!link) return;
    linkEl.insertAdjacentHTML('afterend', getKaitenLink(link));
    isActive = true;
    actiovationInProcess = false;
  }

  function startMRList() {
    document.querySelectorAll('.merge-request[id^="merge_request"]').forEach(el => {
      const item = el as HTMLLIElement;
      const MRLink = item.querySelector('.js-prefetch-document');
      if (!MRLink) return;
      const parent = MRLink?.parentNode as HTMLSpanElement;

      if (parent) {
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
      }
      const MRName: string = MRLink.innerHTML;
      const link = generateKaitenLink(MRName);
      if (!link) return;
      MRLink.insertAdjacentHTML('afterend', getKaitenLink(link, c('kaiten-link-mrlist')));
    });
    isActive = true;
    actiovationInProcess = false;
  }

  function activate(pathname: string) {
    if (isActive || actiovationInProcess) return;
    const resultBranchList = regexMap.branchesList.exec(pathname);
    const resultFiles = regexMap.files.exec(pathname);
    const resultCommits = regexMap.commits.exec(pathname);
    const resultMergeRequests = regexMap.mergeRequests.exec(pathname);
    const resultMergeRequest= regexMap.mergeRequest.exec(pathname);
    if (resultBranchList) {
      actiovationInProcess = true;
      init(() => startBranchList());
    } else if (resultFiles) {
      actiovationInProcess = true;
      const branchName = pathname.split('/').slice(-1)[0];
      init(() => startAfterSelector(branchName, 'files'));
    } else if (resultCommits) {
      actiovationInProcess = true;
      const branchName = resultCommits[1];
      init(() => startAfterSelector(branchName, 'commits'));
    } else if (resultMergeRequests) {
      actiovationInProcess = true;
      init(() => startMRList());
    } else if (resultMergeRequest) {
      actiovationInProcess = true;
      init(() => startMR());
    }

  }

  function checkPathName() {
    const isExist = !!document.querySelectorAll(`.${prefix}_kaiten-link`).length;
    if (!prevPathName || prevPathName != window.location.pathname || !isExist) {
      prevPathName = window.location.pathname;
      activate(prevPathName);
    }
  }
  window.setInterval(checkPathName, 1000);
}

export type StartGitlabFileType = {
  startGitlab: typeof startGitlab;
};