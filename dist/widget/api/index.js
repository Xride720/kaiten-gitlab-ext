const SUCCESS_STATUSES = [200, 201];
const formatUrl = (url) => {
    return url?.endsWith('/') ? url.slice(0, url.length - 1) : url;
};
export class ApiClient {
    constructor() {
        this.kaitenApiKey = null;
        this.gitlabApiKey = null;
        this.gitlabURL = null;
        this.kaitenURL = null;
        this.authErrorMessage = this.authErrorMessage.bind(this);
        this.getToken = this.getToken.bind(this);
    }
    async getProjectsList() {
        try {
            let page = 1;
            let result = [];
            while (true) {
                const part_result = await this.request(this.gitlabURL + '/api/v4/projects?per_page=100&page=' + page, this.gitlabOptions());
                result = result.concat(part_result);
                if (part_result.length < 100) {
                    return {
                        data: result,
                        error: false
                    };
                }
                else
                    page++;
            }
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async searchProjects(searchValue) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/projects?per_page=20&page=1&search=${encodeURIComponent(searchValue || '')}&order_by=name&sort=asc`, this.gitlabOptions());
            return {
                data: result.map(item => ({
                    ...item,
                    web_url: this.convertGitlabUrl(item.web_url)
                })),
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async getBranchesList(projectId) {
        try {
            let page = 1;
            let result = [];
            while (true) {
                const part_result = await this.request(this.gitlabURL + '/api/v4/projects/' + String(projectId) + '/repository/branches?per_page=100&page=' + page, this.gitlabOptions());
                result = result.concat(part_result);
                if (part_result.length < 100) {
                    return {
                        data: result,
                        error: false
                    };
                }
                else
                    page++;
            }
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async searchBranches(projectId, searchValue) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/branches?per_page=20&page=1&search=${encodeURIComponent(searchValue || '')}&order_by=name`, this.gitlabOptions());
            return {
                data: result.map(item => ({
                    ...item,
                    web_url: this.convertGitlabUrl(item.web_url)
                })),
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async getSingleBranch(projectId, urlEncodedBranchName) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/branches/${urlEncodedBranchName}`, this.gitlabOptions());
            return {
                data: {
                    ...result,
                    web_url: this.convertGitlabUrl(result.web_url)
                },
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async getBranchByNames(projectId, branchNames) {
        try {
            const result = await Promise.all(branchNames.map(branchName => this.getSingleBranch(projectId, branchName)));
            return {
                data: result.filter(item => !item.error && item.data).map(item => {
                    return {
                        ...item.data,
                        web_url: this.convertGitlabUrl(item.data.web_url)
                    };
                }),
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async searchMRs(projectId, searchValue) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/projects/${String(projectId)}/merge_requests?search=${encodeURIComponent(searchValue || '')}`, this.gitlabOptions());
            return {
                data: result.map(item => ({
                    ...item,
                    web_url: this.convertGitlabUrl(item.web_url)
                })),
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async getSingleMR(projectId, mrId) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/projects/${String(projectId)}/merge_requests/${mrId}`, this.gitlabOptions());
            return {
                data: {
                    ...result,
                    web_url: this.convertGitlabUrl(result.web_url)
                },
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async getMRByIds(projectId, mrIds) {
        try {
            const result = await Promise.all(mrIds.map(mrId => this.getSingleMR(projectId, mrId)));
            return {
                data: result.filter(item => !item.error && item.data).map(item => {
                    return {
                        ...item.data,
                        web_url: this.convertGitlabUrl(item.data.web_url)
                    };
                }),
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async searchBranchCommits(projectId, branchName, sinceDate) {
        try {
            const since = sinceDate ? `since=${encodeURIComponent(new Date(sinceDate).toISOString())}` : '';
            const result = await this.request(`${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/commits?ref_name=${encodeURIComponent(branchName)}&order=topo`, this.gitlabOptions());
            return {
                data: result,
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async searchGitlabUsers(searchValue) {
        try {
            const result = await this.request(`${this.gitlabURL}/api/v4/users?search=${searchValue || ''}&order_by=name&active=true`, this.gitlabOptions());
            return {
                data: result,
                error: false
            };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    createCompareLink(treeLink, refBranch) {
        const encodedBranchName = encodeURIComponent(treeLink.split('/-/tree/')[1]);
        const encodedRefBranchName = encodeURIComponent(refBranch);
        const baseLink = treeLink.split('/-/tree/')[0] + '/-/';
        return `${baseLink}compare/${encodedRefBranchName}...${encodedBranchName}`;
    }
    convertGitlabUrl(web_url) {
        const pathname = web_url.split('/').slice(3).join('/');
        return this.gitlabURL + '/' + pathname;
    }
    async createBranch(cardId, projectId, refBranchName, newBranchName) {
        try {
            const gitlabResponse = await this.request(this.gitlabURL + '/api/v4/projects/' + projectId + '/repository/branches?branch=' + newBranchName + '&ref=' + refBranchName, this.gitlabOptions({ method: 'POST' }));
            const pathname = gitlabResponse.web_url.split('/').slice(3).join('/');
            const url = this.gitlabURL + '/' + pathname;
            const compareLink = this.createCompareLink(url, refBranchName);
            const result = await this.request(this.kaitenURL + '/api/latest/cards/' + cardId + '/external-links', this.kaitenOptions({
                method: 'POST',
                body: JSON.stringify({
                    "url": compareLink,
                    "description": 'Branch: ' + newBranchName
                })
            }));
            console.dir(result);
            return { error: false, data: url };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    async createMR({ cardId, projectId, sourceBranchName, targetBranchName, MRName, assigneeIds, reviewerIds }) {
        try {
            const gitlabResponse = await this.request(this.gitlabURL + '/api/v4/projects/' + projectId + '/merge_requests', this.gitlabOptions({
                method: 'POST',
                body: JSON.stringify({
                    "source_branch": sourceBranchName,
                    "target_branch": targetBranchName,
                    "title": MRName,
                    "assignee_ids": assigneeIds,
                    "reviewer_ids": reviewerIds
                })
            }, {
                'Content-type': 'application/json'
            }));
            const pathname = gitlabResponse.web_url.split('/').slice(3).join('/');
            const url = this.gitlabURL + '/' + pathname;
            const result = await this.request(this.kaitenURL + '/api/latest/cards/' + cardId + '/external-links', this.kaitenOptions({
                method: 'POST',
                body: JSON.stringify({
                    "url": url,
                    "description": 'Merge Request: ' + MRName
                })
            }));
            console.dir(result);
            return { error: false, data: url };
        }
        catch (error) {
            return {
                error: true,
                errorMessage: error
            };
        }
    }
    request(url, options) {
        return new Promise((resolve, reject) => {
            try {
                fetch(url, options).then(async (res) => {
                    if (res.status === 401) {
                        reject(`${res.status} ${res.statusText}` + this.authErrorMessage(res));
                    }
                    else {
                        const data = await res.json();
                        if (!SUCCESS_STATUSES.includes(res.status)) {
                            reject(data.message || data.error || `${res.status} ${res.statusText}`);
                        }
                        else {
                            resolve(data);
                        }
                    }
                }).catch(err => {
                    console.log(err);
                    reject(`${err.message}. URL: ${url}`);
                    return err;
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    initTokens() {
        const $this = this;
        return new Promise((resolve) => {
            chrome.storage.local.get(['kaitenApiKey', 'gitlabApiKey', 'kaitenURL', 'gitlabURL'], function (keys) {
                if (keys.kaitenApiKey) {
                    $this.kaitenApiKey = keys.kaitenApiKey;
                }
                if (keys.gitlabApiKey) {
                    $this.gitlabApiKey = keys.gitlabApiKey;
                }
                if (keys.kaitenURL) {
                    $this.kaitenURL = formatUrl(keys.kaitenURL) || null;
                }
                if (keys.gitlabURL) {
                    $this.gitlabURL = formatUrl(keys.gitlabURL) || null;
                }
                resolve($this.getToken());
            });
        });
    }
    getToken() {
        return {
            kaitenToken: !!this.kaitenApiKey,
            gitlabToken: !!this.gitlabApiKey,
            kaitenURL: !!this.kaitenURL,
            gitlabURL: !!this.gitlabURL,
        };
    }
    gitlabOptions(params = {}, headers = {}) {
        return {
            credentials: 'include',
            headers: {
                'PRIVATE-TOKEN': this.gitlabApiKey,
                ...headers
            },
            ...params
        };
    }
    kaitenOptions(params = {}) {
        return {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Accept: 'application/json',
                Authorization: 'Bearer ' + this.kaitenApiKey
            },
            ...params
        };
    }
    authErrorMessage(res) {
        return res.url.includes('gitlab') ?
            '. Проверьте или обновите Gitlab api key'
            : (res.url.includes('kaiten') ?
                '. Проверьте или обновите Kaiten api key' : '');
    }
}
