export const utils = (c, htmlMethods) => {
    const setFormDisabled = (disabled) => {
        const form = document.querySelector(`.${c('form')}`);
        if (!form)
            return;
        form.querySelectorAll('input,button').forEach((item) => {
            item.disabled = disabled;
        });
        form.classList[disabled ? 'add' : 'remove'](c('form-disabled'));
    };
    const clearForm = (cardId) => {
        const form = document.querySelector(`.${c('form')}`);
        if (!form)
            return;
        form.querySelectorAll('input').forEach(item => {
            item.value = item.id === c('new-branch-name') ? cardId || '' : '';
        });
    };
    const setLoading = (element, loading, disableForm = true) => {
        if (!element)
            return;
        disableForm && setFormDisabled(loading);
        const progresses = element.querySelectorAll(`.${c('progress')}`);
        progresses.forEach(progress => {
            if (!progress)
                return;
            if (loading) {
                progress.classList.add(c('loading'));
            }
            else {
                progress.classList.remove(c('loading'));
            }
        });
    };
    const isLoading = (element) => {
        if (!element)
            return false;
        const progress = element.querySelector(`.${c('progress')}`);
        if (!progress)
            return false;
        return progress.classList.contains(c('loading'));
    };
    const setErrorMessages = (arr, isModal = true) => {
        const cont = document.querySelector(`${!isModal ? '' : '.' + c('modal')} .${c('error-message-cont')}`);
        if (!cont)
            return;
        cont.innerHTML = arr?.map(htmlMethods.getErrorMessageItem).join("\n\r") || '';
    };
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }
    const branchTypeArr = [
        {
            id: 'feature',
            name: 'Feature',
            default: true
        },
        {
            id: 'custom',
            name: 'Custom'
        },
        {
            id: 'hotfix',
            name: 'Hotfix'
        },
        {
            id: 'bugfix',
            name: 'Bugfix'
        },
        {
            id: 'release',
            name: 'Release'
        },
    ];
    function formatMRNumber(count) {
        const d = count % 10;
        switch (true) {
            case d === 0:
                return `${count} merge-запросов`;
            case count >= 11 && count <= 14:
                return `${count} merge-запросов`;
            case d === 1:
                return `${count} merge-запрос`;
            case d >= 2 && d <= 4:
                return `${count} merge-запроса`;
            case d >= 5 && d <= 9:
                return `${count} merge-запросов`;
            default:
                return `${count} merge-запрос`;
        }
    }
    function formatBranchNumber(count) {
        const d = count % 10;
        switch (true) {
            case d === 0:
                return `${count} веток`;
            case count >= 11 && count <= 14:
                return `${count} веток`;
            case d === 1:
                return `${count} ветка`;
            case d >= 2 && d <= 4:
                return `${count} ветки`;
            case d >= 5 && d <= 9:
                return `${count} веток`;
            default:
                return `${count} ветка`;
        }
    }
    function parseGitlabUrls(projectData, linkEl, gitlabURL) {
        const regex = new RegExp(`${gitlabURL}\\/(?=[\\w\\W])[^?\\/]+\\/((?=[\\w\\W])[^?\\/]+)\\/-\\/((?=[\\w\\W])[^?\\/]+)\\/`, 'gi');
        const result = regex.exec(linkEl.href);
        if (result) {
            const [_, projectName, linkType] = result;
            if (!projectData[projectName])
                projectData[projectName] = {
                    mrIds: new Set(),
                    branches: new Set()
                };
            if (linkType === 'compare') {
                const branchName = linkEl.href.split('...')[1];
                branchName && projectData[projectName].branches.add(branchName);
            }
            if (linkType === 'tree') {
                const branchName = encodeURIComponent(linkEl.href.split(`${projectName}/-/tree/`)[1]);
                branchName && projectData[projectName].branches.add(branchName);
            }
            if (linkType === 'merge_requests') {
                const mrId = linkEl.href.split(`${projectName}/-/merge_requests/`)[1];
                mrId && projectData[projectName].mrIds.add(mrId);
            }
        }
    }
    return {
        setFormDisabled,
        setLoading,
        isLoading,
        setErrorMessages,
        clearForm,
        debounce,
        branchTypeArr,
        formatMRNumber,
        formatBranchNumber,
        parseGitlabUrls
    };
};
