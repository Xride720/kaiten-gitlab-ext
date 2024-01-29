const SUCCESS_STATUSES = [200, 201];

const formatUrl = (url?: string) => {
  return url?.endsWith('/') ? url.slice(0, url.length - 1) : url;
};

export class ApiClient {

  kaitenApiKey: string | null = null;
  gitlabApiKey: string | null = null;
  gitlabURL: string | null = null;
  kaitenURL: string | null = null;

  constructor() {
    this.authErrorMessage = this.authErrorMessage.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  async getProjectsList(): Promise<ResponseDataType<ProjectType[]>> {
    try {
      let page = 1;
      let result: ProjectType[] = [];
      while (true) {
        const part_result = await this.request<ProjectType[]>(
          this.gitlabURL + '/api/v4/projects?per_page=100&page=' + page,
          this.gitlabOptions()
        );
        result = result.concat(part_result);
        if (part_result.length < 100) {
          return {
            data: result,
            error: false
          };
        }
        else page++;
      }
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async searchProjects(searchValue?: string): Promise<ResponseDataType<ProjectType[]>> {
    try {
      const result: ProjectType[] = await this.request<ProjectType[]>(
        `${this.gitlabURL}/api/v4/projects?per_page=20&page=1&search=${encodeURIComponent(searchValue || '')}&order_by=name&sort=asc`, 
        this.gitlabOptions()
      );
      return {
        data: result.map(item => ({
          ...item,
          web_url: this.convertGitlabUrl(item.web_url)
        })),
        error: false
      };        
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async getBranchesList(projectId: number): Promise<ResponseDataType<BranchType[]>> {
    try {
      let page = 1;
      let result: BranchType[] = [];
      while (true) {
        const part_result = await this.request<BranchType[]>(
          this.gitlabURL + '/api/v4/projects/' + String(projectId) + '/repository/branches?per_page=100&page=' + page,
          this.gitlabOptions()
        );
        result = result.concat(part_result);
        if (part_result.length < 100) {
          return {
            data: result,
            error: false
          };
        }
        else page++;
      }

    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async searchBranches(projectId: number, searchValue?: string): Promise<ResponseDataType<BranchType[]>> {
    try {
      const result: BranchType[] = await this.request<BranchType[]>(
        `${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/branches?per_page=20&page=1&search=${encodeURIComponent(searchValue || '')}&order_by=name`,
        this.gitlabOptions()
      );

      return {
        data: result.map(item => ({
          ...item,
          web_url: this.convertGitlabUrl(item.web_url)
        })),
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async getSingleBranch(projectId: number, urlEncodedBranchName: string): Promise<ResponseDataType<BranchType>> {
    try {
      const result: BranchType = await this.request<BranchType>(
        `${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/branches/${urlEncodedBranchName}`,
        this.gitlabOptions()
      );

      return {
        data: {
          ...result,
          web_url: this.convertGitlabUrl(result.web_url)
        },
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async getBranchByNames(projectId: number, branchNames: string[]): Promise<ResponseDataType<BranchType[]>> {
    try {
      const result: ResponseDataType<BranchType>[] = await Promise.all(branchNames.map(branchName => this.getSingleBranch(projectId, branchName)))

      return {
        data: result.filter(item => !item.error && item.data).map(item => {
          return {
            ...item.data!,
            web_url: this.convertGitlabUrl(item.data!.web_url)
          };
        }),
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async searchMRs(projectId: number, searchValue?: string): Promise<ResponseDataType<MRType[]>> {
    try {
      const result: MRType[] = await this.request<MRType[]>(
        `${this.gitlabURL}/api/v4/projects/${String(projectId)}/merge_requests?search=${encodeURIComponent(searchValue || '')}`,
        this.gitlabOptions()
      );

      return {
        data: result.map(item => ({
          ...item,
          web_url: this.convertGitlabUrl(item.web_url)
        })),
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async getSingleMR(projectId: number, mrId: string): Promise<ResponseDataType<MRType>> {
    try {
      const result: MRType = await this.request<MRType>(
        `${this.gitlabURL}/api/v4/projects/${String(projectId)}/merge_requests/${mrId}`,
        this.gitlabOptions()
      );

      return {
        data: {
          ...result,
          web_url: this.convertGitlabUrl(result.web_url)
        },
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async getMRByIds(projectId: number, mrIds: string[]): Promise<ResponseDataType<MRType[]>> {
    try {
      const result: ResponseDataType<MRType>[] = await Promise.all(mrIds.map(mrId => this.getSingleMR(projectId, mrId)))

      return {
        data: result.filter(item => !item.error && item.data).map(item => {
          return {
            ...item.data!,
            web_url: this.convertGitlabUrl(item.data!.web_url)
          };
        }),
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async searchBranchCommits(
    projectId: number,
    branchName: string,
    sinceDate?: string
  ): Promise<ResponseDataType<CommitType[]>> {
    try {
      const since = sinceDate ? `since=${encodeURIComponent(new Date(sinceDate).toISOString())}` : '';
      const result: CommitType[] = await this.request<CommitType[]>(
        `${this.gitlabURL}/api/v4/projects/${String(projectId)}/repository/commits?ref_name=${encodeURIComponent(branchName)}&order=topo`,
        this.gitlabOptions()
      );

      return {
        data: result,
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async searchGitlabUsers(searchValue?: string): Promise<ResponseDataType<GitlabUserType[]>> {
    try {
      const result: GitlabUserType[] = await this.request<GitlabUserType[]>(
        `${this.gitlabURL}/api/v4/users?search=${searchValue || ''}&order_by=name&active=true`,
        this.gitlabOptions()
      );

      return {
        data: result,
        error: false
      };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  createCompareLink(treeLink: string, refBranch: string) {
    const encodedBranchName = encodeURIComponent(treeLink.split('/-/tree/')[1])
    const encodedRefBranchName = encodeURIComponent(refBranch);
    const baseLink = treeLink.split('/-/tree/')[0] + '/-/';
    return `${baseLink}compare/${encodedRefBranchName}...${encodedBranchName}`;
  }

  convertGitlabUrl(web_url: string) {
    const pathname = web_url.split('/').slice(3).join('/');
    return this.gitlabURL + '/' + pathname;
  }

  async createBranch(
    cardId: string,
    projectId: string | number,
    refBranchName: string,
    newBranchName: string
  ): Promise<ResponseDataType<string>> {
    try {
      const gitlabResponse = await this.request<{ web_url: string }>(
        this.gitlabURL + '/api/v4/projects/' + projectId + '/repository/branches?branch=' + newBranchName + '&ref=' + refBranchName,
        this.gitlabOptions({ method: 'POST' })
      );

      const pathname = gitlabResponse.web_url.split('/').slice(3).join('/');
      const url = this.gitlabURL + '/' + pathname;

      const compareLink = this.createCompareLink(url, refBranchName);

      const result = await this.request(
        this.kaitenURL + '/api/latest/cards/' + cardId + '/external-links',
        this.kaitenOptions({
          method: 'POST',
          body: JSON.stringify({
            "url": compareLink,
            "description": 'Branch: ' + newBranchName
          })
        })
      );

      console.dir(result);
      return { error: false, data: url };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  async createMR({
    cardId,
    projectId,
    sourceBranchName,
    targetBranchName,
    MRName,
    assigneeIds,
    reviewerIds
  }: CreateMRPayload): Promise<ResponseDataType<string>> {
    try {
      const gitlabResponse = await this.request<{ web_url: string }>(
        this.gitlabURL + '/api/v4/projects/' + projectId + '/merge_requests',
        this.gitlabOptions({
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
        })
      );

      const pathname = gitlabResponse.web_url.split('/').slice(3).join('/');
      const url = this.gitlabURL + '/' + pathname;

      const result = await this.request(
        this.kaitenURL + '/api/latest/cards/' + cardId + '/external-links',
        this.kaitenOptions({
          method: 'POST',
          body: JSON.stringify({
            "url": url,
            "description": 'Merge Request: ' + MRName
          })
        })
      );

      console.dir(result);
      return { error: false, data: url };
    } catch (error) {
      return {
        error: true,
        errorMessage: error as string
      };
    }
  }

  request<T>(url: string, options: Record<string, any>): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        fetch(url, options).then(async (res) => {
          if (res.status === 401) {
            reject(`${res.status} ${res.statusText}` + this.authErrorMessage(res));
          } else {
            const data = await res.json();
            if (!SUCCESS_STATUSES.includes(res.status)) {
              reject(data.message || data.error || `${res.status} ${res.statusText}`);
            } else {
              resolve(data);
            }
          }
        }).catch(err => {
          console.log(err);
          reject(`${err.message}. URL: ${url}`);
          return err
        })
      } catch (error) {
        console.log(error);
      }
      
    });
  }

  initTokens(): Promise<ReturnType<typeof this.getToken>> {
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

  getToken(): {
    kaitenToken: boolean,
    gitlabToken: boolean,
    kaitenURL: boolean,
    gitlabURL: boolean
  } {
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

  authErrorMessage(res: Response): string {
    return res.url.includes('gitlab') ?
      '. Проверьте или обновите Gitlab api key'
      : (
        res.url.includes('kaiten') ?
          '. Проверьте или обновите Kaiten api key' : ''
      );
  }
}

export type ResponseDataType<T> = {
  data?: T;
  error: boolean,
  errorMessage?: string,
};
export type ProjectType = {
  id: number,
  name: string,
  web_url: string,
  path: string
};
export type MRType = {
  id: number,
  title: string,
  web_url: string,
  target_branch: string,
  source_branch: string,
  state: 'opened' | 'closed' | 'merged' | 'locked'
};
export type CommitType = { 
  id: number,
  message: string,
  committed_date: string
};
export type BranchType = {
  name: string,
  web_url: string,
  commit: CommitType
};
export type GitlabUserType = {
  id: number;
  username: string;
  name: string;
  state: "active" | "blocked";
  avatar_url: string;
  web_url: string;
};
// "id": 1,
// "username": "john_smith",
// "name": "John Smith",
// "state": "active",
// "avatar_url": "http://localhost:3000/uploads/user/avatar/1/cd8.jpeg",
// "web_url": "http://localhost:3000/john_smith"

export type CreateMRPayload = {
  cardId: string,
  projectId: string | number,
  sourceBranchName: string,
  targetBranchName: string,
  MRName: string,
  assigneeIds?: string[],
  reviewerIds?: string[]
};

export type ApiFileType = {
  ApiClient: typeof ApiClient;
};