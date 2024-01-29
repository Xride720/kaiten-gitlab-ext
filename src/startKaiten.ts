import { ApiClient, ProjectType, GitlabUserType, BranchType, ResponseDataType, CommitType, MRType } from "widget/api/index";
import { ModalFileType } from "widget/components/Modal";
import { SelectFileType, SelectComponent } from "widget/components/Select";
import { HTMLFileType } from "widget/html/index";
import { StylesType } from "widget/styles/styles";
import { UtilsFileType } from "widget/utils/index";

type InfoStateType = {
  projects: ProjectType[],
  branches: { projectId: number, branches: BranchType[]}[],
  MRs: { projectId: number;  MRs: MRType[]; }[]
};

export async function startKaiten (apiClient: ApiClient) {
  const prefix = 'kaiten-gitlab-integration-extension';
  const c = (cl: string) => `${prefix}_${cl}`;

  const srcStyles = chrome.runtime.getURL("widget/styles/styles.js");
  const styles: StylesType = await import(srcStyles);

  const srcHtml = chrome.runtime.getURL("widget/html/index.js");
  const htmlFile: HTMLFileType = await import(srcHtml);

  const srcUtils = chrome.runtime.getURL("widget/utils/index.js");
  const utilsFile: UtilsFileType = await import(srcUtils);

  const srcModal = chrome.runtime.getURL("widget/components/Modal.js");
  const modalFile: ModalFileType = await import(srcModal);
  const { ModalComponent } = modalFile;

  const srcSelect = chrome.runtime.getURL("widget/components/Select.js");
  const selectFile: SelectFileType = await import(srcSelect);
  const { SelectComponent } = selectFile;

  const htmlMethods = htmlFile.getAll(c);
  const {
    getFormCard,
    getFormCreateBranch,
    getFormMR,
    successCreateBranch,
    successCreateMR,
    ReverseSVG,
    getBranchList,
    getMRList
  } = htmlMethods;

  const {
    setLoading,
    isLoading,
    setErrorMessages,
    debounce,
    branchTypeArr,
    formatMRNumber,
    formatBranchNumber,
    parseGitlabUrls
  } = utilsFile.utils(c, htmlMethods);

  const Modal = new ModalComponent({
    c,
    htmlMethods
  });

  const ProjectSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Проект (поиск от 3-х символов)',
    id: 'gitlab-project-choice',
    name: 'gitlab-project-choice'
  });

  const ReviewersSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Проверяющий (поиск от 3-х символов)',
    id: 'reviewer-user-choice',
    name: 'reviewer-user-choice'
  });

  const AssigneesSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Ответственный (поиск от 3-х символов)',
    id: 'assignee-user-choice',
    name: 'assignee-user-choice'
  });

  const RefBranchSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Исходная ветка (поиск от 1-го символа)',
    id: 'project-branch-choice',
    name: 'project-branch-choice'
  });

  const BranchTypeSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Тип ветки',
    id: 'branch-type',
    name: 'branch-type',
    options: branchTypeArr,
    readonly: true,
    fixedOptions: true
  });

  const SourceBranchSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Исходная ветка (поиск от 1-го символа)',
    id: 'source-branch-choice',
    name: 'source-branch-choice'
  });

  const TargetBranchSelect = new SelectComponent({
    c,
    htmlMethods,
    label: 'Целевая ветка (поиск от 1-го символа)',
    id: 'target-branch-choice',
    name: 'target-branch-choice'
  });

  let prevPathName: string | null = null;
  let currentProjects: ProjectType[] = [];
  let loadingProjects: boolean = false;
  let currentGitlabUsers: GitlabUserType[] = [];
  let loadingGitlabUsers: boolean = false;
  let currentBranches: BranchType[] = [];
  let loadingBranches: boolean = false;
  const branchesByProjectIdMap = new Map<number, BranchType[]>();
  let currentProjectId: number | null = null;
  let spaceId: string | null = null;
  let cardId: string | null = null;
  const viewTypes = ['timeline', 'archive', 'calendar', 'grid', 'lists'];
  const infoState: InfoStateType = {
    projects: [],
    branches: [],
    MRs: []
  };

  const WRONG_PROJECT = 'Неверное название проекта - выберите проект из списка';
  const WRONG_BRANCH = (type: string) => `Неверное название ${type} ветки - выберите ветку из списка`;
  const WRONG_USER = (type: string) => `Неверное название ${type} пользователя - выберите пользователя из списка`;

  function validateOnChange(arr: [
    string | number | null, 
    'project' | 'gitlabUser' | 'branch' | 'notEmpty', 
    string, 
    string?
  ][]) {
    const meta = {
      project: {
        // text: 'Неверное название проекта - выберите проект из списка',
        _arr: currentProjects,
        key: 'id'
      },
      gitlabUser: {
        // text: 'Неверное название проекта - выберите проект из списка',
        _arr: currentGitlabUsers,
        key: 'id'
      },
      branch: {
        // text: 'Неверное название ветки - выберите ветку из списка',
        _arr: currentProjectId ? branchesByProjectIdMap.get(currentProjectId) : [],
        key: 'name'
      },
      notEmpty: {
        // text: 'Неверное название новой ветки',
        key: undefined,
        _arr: undefined
      }
    };
    const errorArr: string[] = [];
    arr.forEach(([ value, type, text, _key ]) => {
      const { key, _arr } = meta[type] || {};
      const iKey = (_key || key) as keyof typeof _arr;
      if (!value || (_arr && !_arr.some(item => item[iKey] === value))) {
        errorArr.push(text);

      }
    });
    setErrorMessages(errorArr);

    return !errorArr.length;
  }

  async function onCreateBranchClick(event: MouseEvent) {
    const buttonEl = event.currentTarget as Element;
    if (isLoading(buttonEl) || !cardId) return;
    const projectId = currentProjectId;
    const refBranchName = RefBranchSelect.inputEl?.dataset.name || '';
    const newBranchName = getNewBranchName();

    if (!validateOnChange(
      [
        [projectId, 'project', WRONG_PROJECT],
        [refBranchName, 'branch', WRONG_BRANCH('исходной')],
        [newBranchName, 'notEmpty', 'Неверное название новой ветки']
      ]
    )) return;

    setErrorMessages([]);
    setLoading(buttonEl, true);
    const result = await apiClient.createBranch(cardId, projectId!, refBranchName, newBranchName);
    setLoading(buttonEl, false);

    if (result.error && result.errorMessage) {
      setErrorMessages([result.errorMessage]);
    } else {
      const form = document.querySelector(`.${c('form')}`);
      if (form && result.data) {
        form.innerHTML = successCreateBranch(result.data, newBranchName);
        initFormContent();
      }
    }
  }

  async function onCreateMRClick(event: MouseEvent) {
    const buttonEl = event.currentTarget as Element;
    if (isLoading(buttonEl) || !cardId) return;
    const projectId = currentProjectId;
    const sourceBranchName = SourceBranchSelect.inputEl?.dataset.name || '';
    const targetBranchName = TargetBranchSelect.inputEl?.dataset.name || '';
    const reviewerId = ReviewersSelect.inputEl?.dataset.id || '';
    const assigneeId = AssigneesSelect.inputEl?.dataset.id || '';
    const newMRInput = document.getElementById(c('new-mr-name')) as HTMLInputElement;
    const newMRName = newMRInput?.value || '';

    if (!validateOnChange(
      [
        [projectId, 'project', WRONG_PROJECT],
        [sourceBranchName, 'branch', WRONG_BRANCH('исходной')],
        [targetBranchName, 'branch', WRONG_BRANCH('целевой')],
        [newMRName, 'notEmpty', 'Неверное название Merge Request']
      ]
    )) return;

    setErrorMessages([]);
    setLoading(buttonEl, true);
    const result = await apiClient.createMR({
      cardId,
      projectId: projectId!,
      sourceBranchName,
      targetBranchName,
      MRName: newMRName,
      reviewerIds: reviewerId ? [reviewerId] : [],
      assigneeIds: assigneeId ? [assigneeId] : []
    });
    setLoading(buttonEl, false);

    if (result.error && result.errorMessage) {
      setErrorMessages([result.errorMessage]);
    } else {
      const form = document.querySelector(`.${c('form')}`);
      if (form && result.data) {
        form.innerHTML = successCreateMR(result.data, newMRName);
        initFormContent();
      }
    }
  }

  async function gitlabProjectChoiceOnSelect(projectId: number, branchesSelects: SelectComponent[]) {
    setErrorMessages([]);
    const isProjectChange = currentProjectId !== projectId;
    currentProjectId = projectId !== undefined ? projectId : null;

    if (branchesByProjectIdMap.has(projectId)) {
      currentBranches = branchesByProjectIdMap.get(projectId) || [];
    } else {
      await searchBranches(branchesSelects);
    }
    branchesSelects.forEach(select => select.updateSelectOptions(currentBranches.map(item => ({ id: item.name, name: item.name }))));
    if (isProjectChange) {
      branchesSelects.forEach(select => select.clearSelect(true));
    }
  }

  async function searchProjects(select: SelectComponent | SelectComponent[], searchValue?: string) {
    if (loadingProjects || (searchValue && searchValue.length < 3)) return;
    loadingProjects = true;
    const selects: SelectComponent[] = Array.isArray(select) ? select : [select];
    selects.forEach(select => setLoading(select.contEl, true, false));
    
    const result = await apiClient.searchProjects(searchValue);
    
    selects.forEach(select => setLoading(select.contEl, false, false));
    if (!result.error) {
      currentProjects = result.data || [];
    } else result.errorMessage && setErrorMessages([result.errorMessage]);
    loadingProjects = false;

    selects.forEach(select => {
      select.clearData();
      select.updateSelectOptions(currentProjects);
    });
  }

  const debounceSearchProjects = debounce(async (select: SelectComponent, value: string) => {
    await searchProjects(select, value);
  }, 800);

  async function searchBranches(select: SelectComponent | SelectComponent[], searchValue?: string) {
    if (loadingBranches || !currentProjectId) return;
    const selects: SelectComponent[] = Array.isArray(select) ? select : [select];
    loadingBranches = true;
    selects.forEach(select => setLoading(select.contEl, true, false));
    
    const result = await apiClient.searchBranches(currentProjectId, searchValue);

    selects.forEach(select => setLoading(select.contEl, false, false));
    if (!result.error) {
      const branches = result.data || [];
      const oldBranches: BranchType[] = branchesByProjectIdMap.get(currentProjectId) || [];
      branchesByProjectIdMap.set(currentProjectId, [
        ...branches,
        ...oldBranches.reduce<BranchType[]>((acc, curr) => {
          if (!branches.some(item => item.name === curr.name)) acc.push(curr);
          return acc;
        }, [])
      ]);
      currentBranches = branches;
    } else result.errorMessage && setErrorMessages([result.errorMessage]);
    loadingBranches = false;

    selects.forEach(select => {
      select.clearData();
      select.updateSelectOptions(currentBranches.map(item => ({ id: item.name, name: item.name })));
    });
  }

  const debounceSearchBranches = debounce(async (select: SelectComponent, value: string) => {
    await searchBranches(select, value);
  }, 800);

  async function searchGitlabUsers(select: SelectComponent | SelectComponent[], searchValue?: string) {
    if (loadingGitlabUsers || (searchValue && searchValue.length < 3)) return;
    loadingGitlabUsers = true;
    const selects: SelectComponent[] = Array.isArray(select) ? select : [select];
    selects.forEach(select => setLoading(select.contEl, true, false));
    
    const result = await apiClient.searchGitlabUsers(searchValue);
    
    selects.forEach(select => setLoading(select.contEl, false, false));
    if (!result.error) {
      currentGitlabUsers = result.data || [];
    } else result.errorMessage && setErrorMessages([result.errorMessage]);
    loadingGitlabUsers = false;

    selects.forEach(select => {
      select.clearData();
      select.updateSelectOptions(currentGitlabUsers);
    });
  }

  const debounceSearchGitlabUsers = debounce(async (select: SelectComponent, value: string) => {
    await searchGitlabUsers(select, value);
  }, 800);

  function getNewBranchName() {
    const type = BranchTypeSelect.inputEl?.dataset.id;
    const newBranchInput = document.getElementById(c('new-branch-name')) as HTMLInputElement;
    const newBranchName = newBranchInput?.value || '';
    return type && type !== 'custom' ? `${type}/${newBranchName}` : newBranchName;
  }

  function updateNewBranchName() {
    const resultRefCont = document.querySelector(`.${c('ref-branch-title')}`) as HTMLDivElement;
    const resultBranchCont = document.querySelector(`.${c('new-branch-title')}`) as HTMLDivElement;
    if (!resultRefCont || !resultBranchCont) return;
    const resultBranch = getNewBranchName();
    const resultRef = RefBranchSelect.inputEl?.value || '';
    if (resultRef) {
      resultRefCont.style.display = 'block';
      resultRefCont.innerHTML = resultRef;
      resultRefCont.title = resultBranch;
    } else {
      resultRefCont.style.display = 'none';
    }
    if (resultBranch) {
      resultBranchCont.style.display = 'block';
      resultBranchCont.innerHTML = resultBranch;
      resultBranchCont.title = resultBranch;
    } else {
      resultBranchCont.style.display = 'none';
    }
  }

  async function openBranchModal() {
    Modal.init({
      title: 'Создание ветки в Gitlab',
      content: getFormCreateBranch(
        cardId!,
        `
          ${ProjectSelect.html()}
          ${RefBranchSelect.html()}
        `,
        BranchTypeSelect.html()
      ),
      customInit: () => {
        ProjectSelect.init({
          onSelect: (id: string) => {
            gitlabProjectChoiceOnSelect(Number(id), [RefBranchSelect]);
          },
          onInput: debounceSearchProjects
        });
        RefBranchSelect.init({
          onSelect: updateNewBranchName,
          onInput: debounceSearchBranches
        });
        BranchTypeSelect.init({
          onSelect: updateNewBranchName
        });
        updateNewBranchName();
      }
    });

    document.querySelector(`.${c('form')}`)?.addEventListener('input', function() {
      setErrorMessages([]);
    });
    document.getElementById(c('createBtn'))?.addEventListener('click', onCreateBranchClick);
    document.getElementById(c('new-branch-name'))?.addEventListener('input', updateNewBranchName);

    Modal.setOpen(true);

    await searchProjects(ProjectSelect);
    ProjectSelect.updateSelectOptions(currentProjects);
  }

  function reverseMRBranch() {
    if (!SourceBranchSelect.inputEl || !TargetBranchSelect.inputEl) return;
    const oldSourceName = SourceBranchSelect.inputEl.dataset.name || '';
    const oldSourceId = SourceBranchSelect.inputEl.dataset.id || '';
    const oldTargetName = TargetBranchSelect.inputEl.dataset.name || '';
    const oldTargetId = TargetBranchSelect.inputEl.dataset.id || '';

    SourceBranchSelect.inputEl.value = oldTargetName;
    SourceBranchSelect.inputEl.dataset.name = oldTargetName;
    SourceBranchSelect.inputEl.dataset.id = oldTargetId;
    TargetBranchSelect.inputEl.value = oldSourceName;
    TargetBranchSelect.inputEl.dataset.name = oldSourceName;
    TargetBranchSelect.inputEl.dataset.id = oldSourceId;
  }

  async function openMRModal() {
    Modal.init({
      width: '60vw',
      title: 'Создание Merge Request в Gitlab',
      content: getFormMR(
        cardId!,
        ProjectSelect.html(),
        `
          ${SourceBranchSelect.html()}
          ${ReverseSVG()}
          ${TargetBranchSelect.html()}
        `,
        `
          ${ReviewersSelect.html()}
          ${AssigneesSelect.html()}
        `
      ),
      customInit: () => {
        ProjectSelect.init({
          onSelect: (id: string) => {
            gitlabProjectChoiceOnSelect(Number(id), [SourceBranchSelect, TargetBranchSelect]);
          },
          onInput: debounceSearchProjects
        });
        SourceBranchSelect.init({
          onInput: debounceSearchBranches
        });
        TargetBranchSelect.init({
          onInput: debounceSearchBranches
        });
        ReviewersSelect.init({
          onInput: debounceSearchGitlabUsers
        });
        AssigneesSelect.init({
          onInput: debounceSearchGitlabUsers
        });
      }
    });

    document.querySelector(`.${c('form')}`)?.addEventListener('input', function() {
      setErrorMessages([]);
    });
    document.getElementById(c('createBtn'))?.addEventListener('click', onCreateMRClick);
    document.querySelector(`.${c('reverse-svg')}`)?.addEventListener('click', reverseMRBranch);

    Modal.setOpen(true);
    await Promise.all([
      searchProjects(ProjectSelect),
      searchGitlabUsers([ReviewersSelect, AssigneesSelect])
    ]);
  }

  function openBranchListModal(
    arr: { projectId: number, branches: BranchType[]}[],
    projects: ProjectType[]   
  ) {
    Modal.init({
      width: '60vw',
      title: 'Список веток в Gitlab',
      content: getBranchList(arr, projects)
    });
    Modal.setOpen(true);
  }

  function openMRListModal(
    arr: { projectId: number, MRs: MRType[]}[],
    projects: ProjectType[]  
  ) {
    Modal.init({
      width: '60vw',
      title: 'Список Merge Request в Gitlab',
      content: getMRList(arr, projects)
    });
    Modal.setOpen(true);
  }

  function handleOpenBranchListModal() {
    const branchesCount = infoState.branches.reduce((acc, curr) => {
      return acc + curr.branches.length;
    }, 0);
    branchesCount && openBranchListModal(infoState.branches, infoState.projects);
  }

  function handleOpenMRListModal() {
    const mrCount = infoState.MRs.reduce((acc, curr) => {
      return acc + curr.MRs.length;
    }, 0);
    mrCount && openMRListModal(infoState.MRs, infoState.projects);
  }

  async function initFormContent() {
    const branchInfoCont = document.getElementById(c('branch-info')) as HTMLDivElement;
    const branchCont = branchInfoCont.closest(`.${c('content-row-info')}`) as HTMLDivElement;
    const mrInfoCont = document.getElementById(c('mr-info')) as HTMLDivElement;
    const mrCont = mrInfoCont.closest(`.${c('content-row-info')}`) as HTMLDivElement;
    if (!branchInfoCont || !mrInfoCont) return;
    setLoading(branchCont, true);
    setLoading(mrCont, true);
    // const projectNames: Set<string> = new Set();
    const projectData: Record<string, { mrIds: Set<string>; branches: Set<string> }> = {};
    document.querySelectorAll('#print-source .cardContent [data-test="externalLink"] a').forEach(item => {
      const linkEl = item as HTMLAnchorElement;
      parseGitlabUrls(
        projectData,
        linkEl,
        apiClient.gitlabURL
      );
    });
    const errorArr: string[] = [];

    const responseProjects: ProjectType[][] = await Promise.all(
      Object.keys(projectData).map(async (name) => {
        const results = await apiClient.searchProjects(name);
        if (!results.error) {
          return results.data?.filter(item => item.path === name) || [];
        } else {
          errorArr.push(results.errorMessage || '');
          return [];
        }
      })
    );

    const projects = responseProjects.flatMap((item) => item).reduce<ProjectType[]>((acc, curr) => {
      if (!acc.some(item => item.id === curr.id)) acc.push(curr); 
      return acc;
    }, []);


    if (cardId) {
      const responseBranches: { projectId: number, branches: BranchType[]}[] = await Promise.all(
        projects.map(async (project) => {
          const results = await apiClient.searchBranches(project.id, cardId!);
          const resultByNames = await apiClient.getBranchByNames(project.id, Array.from(projectData[project.path].branches));
          if (results.error) errorArr.push(results.errorMessage || '');
          if (resultByNames.error) errorArr.push(resultByNames.errorMessage || '');

          if (!results.error || !resultByNames.error) {
            /** пока не найден способ искать коммиты которых нет в деве и есть в ветке */
            // const responseCommits = await Promise.all(results.data?.map(async (branch) => {
            //   const resultCommits = await apiClient.searchBranchCommits(project.id, branch.name, branch.commit.committed_date);
            //   if (!resultCommits.error) {
            //     return resultCommits.data?.map(item => ({ ...item, refBranchName: branch.name })) || [];
            //   } else {
            //     errorArr.push(resultCommits.errorMessage || '');
            //     return [];
            //   }
            // }) || []);
            // const commits = responseCommits.flatMap((item) => item).reduce<CommitType[]>((acc, curr) => {
            //   if (!acc.some(item => item.id === curr.id)) acc.push(curr); 
            //   return acc;
            // }, []);
            const unitedResult = (resultByNames.data || []).reduce((acc, curr) => {
              if (!acc.some(item => item.name === curr.name)) acc.push(curr);
              return acc;
            }, results.data || []) ;

            return {
              projectId: project.id,
              branches: unitedResult,
              // commits
            };
          } else {

            return {
              projectId: project.id,
              branches: []
            };
          }
        })
      );

      const responseMRs: { projectId: number, MRs: MRType[]}[] = await Promise.all(
        projects.map(async (project) => {
          const results = await apiClient.searchMRs(project.id, cardId!);
          const resultByIds = await apiClient.getMRByIds(project.id, Array.from(projectData[project.path].mrIds));

          if (results.error) errorArr.push(results.errorMessage || '');
          if (resultByIds.error) errorArr.push(resultByIds.errorMessage || '');

          if (!results.error || !resultByIds.error) {
            const unitedResult = (resultByIds.data || []).reduce((acc, curr) => {
              if (!acc.some(item => item.id === curr.id)) acc.push(curr);
              return acc;
            }, results.data || []) ;
            return {
              projectId: project.id,
              MRs: unitedResult
            };
          } else {
            return {
              projectId: project.id,
              MRs: []
            };
          }
        })
      );
      const branchesCount = responseBranches.reduce((acc, curr) => {
        return acc + curr.branches.length;
      }, 0);
      const mrCount = responseMRs.reduce((acc, curr) => {
        return acc + curr.MRs.length;
      }, 0);

      setLoading(branchCont, false);
      setLoading(mrCont, false);
      mrInfoCont.innerHTML = formatMRNumber(mrCount);
      branchInfoCont.innerHTML = formatBranchNumber(branchesCount);

      infoState.MRs = responseMRs;
      infoState.branches = responseBranches;
      infoState.projects = projects;

      branchCont?.removeEventListener('click', handleOpenBranchListModal);
      branchCont?.addEventListener('click', handleOpenBranchListModal);
      mrCont?.removeEventListener('click', handleOpenMRListModal);
      mrCont?.addEventListener('click', handleOpenMRListModal);
    }
  }

  async function appendCard(cardId: string, spaceId?: string) {

    const token = await apiClient.initTokens();
    const errorArr = [];
    if (
      !token.kaitenToken 
      || !token.gitlabToken
      || !token.gitlabURL
      || !token.kaitenURL
    ) {
      !token.kaitenToken && errorArr.push('Заполните Kaiten api key');
      !token.kaitenURL && errorArr.push('Заполните Kaiten URL');
      !token.gitlabToken && errorArr.push('Заполните Gitlab api key');
      !token.gitlabURL && errorArr.push('Заполните Gitlab URL');
    }

    // const descriptionSvgPathEl = document.querySelector('[d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"]');
    const anchorEl = document.querySelector('#print-source .cardContent > :nth-child(2)') ;
    
    if (anchorEl) {
      document.getElementById(prefix)?.remove();
      let extension = document.createElement("div");
      extension.id = prefix;
      extension.classList.add(c('container'));
      extension.innerHTML = getFormCard();
      styles.initStyle(prefix, [
        Modal.styles,
        ProjectSelect.styles
      ]);

      anchorEl.parentNode?.insertBefore(extension, anchorEl.nextSibling);
      initFormContent();
      document.getElementById(c('createBranchBtn'))?.addEventListener('click', openBranchModal);
      document.getElementById(c('createMR'))?.addEventListener('click', openMRModal);
    } else {
      console.log('anchorEl not found', anchorEl);
    }

    if (errorArr.length) {
      setErrorMessages(errorArr, false);
    } 

  }

  let actiovationInProcess = false;

  function activate(path: string) {
    const parsedPath = path.split('/');
    let needlePath = false;
    if (parsedPath.length === 5 && parsedPath[1] === 'space') {
      needlePath = parsedPath[3] === 'card';
      if (needlePath) {
        spaceId = parsedPath[2];
        cardId = parsedPath[4];
      }
    } else if (parsedPath[1] === 'dashboard') {
      if (parsedPath.length === 4) {
        needlePath = parsedPath[2] === 'card';
        if (needlePath)
          cardId = parsedPath[3];
      }
      if (parsedPath.length === 5) {
        needlePath = parsedPath[3] === 'card';
        if (needlePath)
          cardId = parsedPath[4];
      }
    } else if (parsedPath.length === 6 && viewTypes.includes(parsedPath[3])) {
      needlePath = parsedPath[4] === 'card';
      if (needlePath)
        cardId = parsedPath[5];
    }
    if (!actiovationInProcess && needlePath) {
      actiovationInProcess = true;
      setTimeout(async () => {
        await appendCard(spaceId!, cardId!);
        actiovationInProcess = false;
      }, 500);
    }
  }

  function checkPathName() {
    const isActive = !!document.querySelectorAll(`#${prefix}`).length;
    if (!prevPathName || prevPathName != window.location.pathname || !isActive) {
      prevPathName = window.location.pathname;
      activate(prevPathName);
    }
  }
  window.setInterval(checkPathName, 1000);
}

export type StartKaitenFileType = {
  startKaiten: typeof startKaiten;
};