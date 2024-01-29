/**
 * c(className: string) => ${prefix}_${className}
 */

/**
 * simple html template without logic
 */

import { BranchType, MRType, ProjectType } from "widget/api/index";
import { HTMLString, PrefixerType } from "widget/types";

export const getAll = (c: PrefixerType) => {

  const GitlabSVG = (): HTMLString => {
    return `
    <svg class="${c('gitlab-svg')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 380">
      <defs>
        <style>.cls-1{fill:#e24329;}.cls-2{fill:#fc6d26;}.cls-3{fill:#fca326;}</style>
      </defs>
      <g>
        <path class="cls-1" d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
        <path class="cls-2" d="M282.83,170.73l-.27-.69a88.3,88.3,0,0,0-35.15,15.8L190,229.25c19.55,14.79,36.57,27.64,36.57,27.64l40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
        <path class="cls-3" d="M153.43,256.89l19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91S209.55,244,190,229.25C170.45,244,153.43,256.89,153.43,256.89Z"/>
        <path class="cls-2" d="M132.58,185.84A88.19,88.19,0,0,0,97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82s17-12.85,36.57-27.64Z"/>
      </g>
    </svg>
    `;
  };

  const KaitenSVG = (): HTMLString => {
    return `
    <svg class="${c('kaiten-svg')}" width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M130 260C201.797 260 260 201.797 260 130C260 58.203 201.797 0 130 0C58.203 0 0 58.203 0 130C0 201.797 58.203 260 130 260Z" fill="#F11F24"/>
      <path d="M106.006 37.0134L37.0133 106.006C23.7511 119.268 23.7511 140.77 37.0133 154.032L106.006 223.025C119.268 236.287 140.77 236.287 154.032 223.025L223.025 154.032C236.287 140.77 236.287 119.268 223.025 106.006L154.032 37.0133C140.77 23.7511 119.268 23.7512 106.006 37.0134Z" fill="#78FFC7"/>
      <path d="M130.08 188.96C163.814 188.96 191.16 162.554 191.16 129.98C191.16 97.4062 163.814 71 130.08 71C96.3465 71 69 97.4062 69 129.98C69 162.554 96.3465 188.96 130.08 188.96Z" fill="#7D4CCF"/>
    </svg>
    `;
  };

  const CreateBranchSVG = (): HTMLString => {
    return `
    <svg class="${c('create-branch-svg')}" width="393" height="225" viewBox="0 0 393 225" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 41H212" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <path d="M224 54C230.229 147.942 299.841 172.365 345 175" stroke="black" stroke-width="3"/>
      <circle cx="19" cy="41" r="11.5" fill="currentColor" stroke="black" stroke-width="3"/>
      <circle cx="358" cy="175" r="11.5" fill="currentColor" stroke="black" stroke-width="3"/>
      <circle cx="224" cy="41" r="11.5" fill="currentColor" stroke="black" stroke-width="3"/>
    </svg>
    `;
  };

  const ReverseSVG = (): HTMLString => {
    return `
    <svg class="${c('reverse-svg')}" height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(4 2)">
        <path d="m4.5 8.5-4 4 4 4"/>
        <path d="m12.5 12.5h-12"/>
        <path d="m8.5.5 4 4-4 4"/>
        <path d="m12.5 4.5h-12"/>
      </g>
    </svg>
    `;
  };

  const MRArrowSVG = (): HTMLString => {
    return `
    <svg class="${c('mr-arrow-svg')}" width="1500" height="87" viewBox="0 0 1500 87" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M72 3L1423.5 3" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M75 3C29.1934 6.0375 17.2849 39.9803 16 62" stroke="currentColor" stroke-width="3"/>
      <path d="M1482 62C1478.96 16.1934 1445.02 4.28488 1423 3" stroke="currentColor" stroke-width="3"/>
      <circle cx="16" cy="74" r="11.5" stroke="currentColor" stroke-width="3"/>
      <path d="M1480.94 85.0607C1481.53 85.6464 1482.47 85.6464 1483.06 85.0607L1492.61 75.5147C1493.19 74.9289 1493.19 73.9792 1492.61 73.3934C1492.02 72.8076 1491.07 72.8076 1490.49 73.3934L1482 81.8787L1473.51 73.3934C1472.93 72.8076 1471.98 72.8076 1471.39 73.3934C1470.81 73.9792 1470.81 74.9289 1471.39 75.5147L1480.94 85.0607ZM1480.5 61.5L1480.5 84L1483.5 84L1483.5 61.5L1480.5 61.5Z" fill="currentColor"/>
    </svg>
    `;
  };

  const MRSVG = (): HTMLString => {
    return `
    <svg class="${c('mr-svg')}" width="216" height="216" viewBox="0 0 216 216" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M84.375 57.375C84.3763 52.1786 82.8781 47.0923 80.0601 42.7263C77.2422 38.3604 73.2242 34.9004 68.4884 32.7615C63.7527 30.6227 58.5003 29.8958 53.3617 30.6683C48.223 31.4407 43.4164 33.6795 39.5187 37.1161C35.621 40.5527 32.7978 45.041 31.3879 50.0425C29.978 55.0439 30.0413 60.3459 31.5701 65.3123C33.099 70.2787 36.0286 74.6983 40.0072 78.0409C43.9858 81.3835 48.8444 83.507 54 84.1565V131.843C47.1858 132.702 40.9548 136.125 36.5755 141.416C32.1963 146.707 29.9979 153.468 30.428 160.323C30.8581 167.177 33.8843 173.61 38.8906 178.312C43.8969 183.014 50.5069 185.632 57.375 185.632C64.2432 185.632 70.8532 183.014 75.8595 178.312C80.8657 173.61 83.8919 167.177 84.322 160.323C84.7522 153.468 82.5538 146.707 78.1746 141.416C73.7953 136.125 67.5643 132.702 60.75 131.843V84.1565C67.2707 83.3275 73.2659 80.1513 77.6142 75.222C81.9625 70.2927 84.366 63.9481 84.375 57.375ZM37.125 57.375C37.125 53.3699 38.3127 49.4548 40.5378 46.1247C42.7629 42.7946 45.9255 40.1991 49.6257 38.6664C53.3259 37.1338 57.3975 36.7327 61.3256 37.5141C65.2537 38.2954 68.8619 40.2241 71.694 43.0561C74.526 45.8881 76.4546 49.4963 77.2359 53.4244C78.0173 57.3525 77.6163 61.4241 76.0836 65.1243C74.5509 68.8245 71.9554 71.9872 68.6253 74.2123C65.2952 76.4374 61.3801 77.625 57.375 77.625C52.0063 77.6189 46.8591 75.4835 43.0628 71.6872C39.2665 67.8909 37.1311 62.7438 37.125 57.375ZM77.625 158.625C77.625 162.63 76.4374 166.545 74.2123 169.875C71.9872 173.205 68.8246 175.801 65.1244 177.334C61.4242 178.866 57.3526 179.267 53.4245 178.486C49.4963 177.705 45.8881 175.776 43.0561 172.944C40.2241 170.112 38.2955 166.504 37.5141 162.576C36.7328 158.647 37.1338 154.576 38.6665 150.876C40.1992 147.175 42.7946 144.013 46.1247 141.788C49.4548 139.563 53.37 138.375 57.375 138.375C62.7438 138.381 67.8909 140.516 71.6872 144.313C75.4835 148.109 77.619 153.256 77.625 158.625ZM162.003 131.843L162.001 101.15C162.016 95.3857 160.888 89.6762 158.682 84.3512C156.477 79.0262 153.237 74.1915 149.15 70.1269L122.898 43.875H148.5C149.395 43.875 150.254 43.5194 150.887 42.8865C151.519 42.2535 151.875 41.3951 151.875 40.5C151.875 39.6049 151.519 38.7464 150.887 38.1135C150.254 37.4806 149.395 37.125 148.5 37.125H114.75C114.74 37.125 114.731 37.1278 114.721 37.1279C114.509 37.1293 114.297 37.1507 114.089 37.1917C113.991 37.2112 113.9 37.248 113.805 37.2759C113.688 37.3054 113.572 37.3413 113.458 37.3834C113.352 37.4322 113.249 37.4866 113.149 37.5464C113.058 37.5955 112.964 37.6356 112.878 37.6936C112.695 37.8155 112.524 37.9548 112.368 38.1096L112.364 38.1133C112.207 38.2707 112.066 38.4432 111.943 38.6282C111.888 38.7115 111.849 38.8016 111.802 38.8885C111.67 39.0914 111.577 39.3168 111.526 39.5533C111.498 39.6488 111.462 39.7401 111.442 39.8389C111.398 40.0565 111.375 40.278 111.375 40.5V74.25C111.375 75.1451 111.731 76.0035 112.364 76.6365C112.996 77.2694 113.855 77.625 114.75 77.625C115.645 77.625 116.504 77.2694 117.137 76.6365C117.769 76.0035 118.125 75.1451 118.125 74.25V48.6477L144.378 74.8997C147.836 78.339 150.577 82.43 152.443 86.9358C154.31 91.4416 155.264 96.2728 155.251 101.15L155.253 131.844C148.438 132.702 142.207 136.125 137.828 141.416C133.449 146.707 131.251 153.468 131.681 160.323C132.111 167.177 135.137 173.61 140.144 178.312C145.15 183.014 151.76 185.631 158.628 185.631C165.496 185.631 172.106 183.014 177.112 178.312C182.118 173.61 185.144 167.177 185.575 160.322C186.005 153.468 183.806 146.707 179.427 141.416C175.048 136.125 168.817 132.702 162.003 131.843ZM158.628 178.875C154.622 178.875 150.707 177.687 147.377 175.462C144.047 173.237 141.452 170.075 139.919 166.374C138.386 162.674 137.985 158.603 138.767 154.674C139.548 150.746 141.477 147.138 144.309 144.306C147.141 141.474 150.749 139.545 154.677 138.764C158.605 137.983 162.677 138.384 166.377 139.916C170.077 141.449 173.24 144.045 175.465 147.375C177.69 150.705 178.878 154.62 178.878 158.625C178.871 163.994 176.736 169.141 172.94 172.937C169.143 176.734 163.996 178.869 158.628 178.875Z" fill="currentColor"/>
    </svg>
    `;
  };

  const BranchSVG = (): HTMLString => {
    return `
    <svg class="${c('branch-svg')}" width="220" height="216" viewBox="0 0 220 216" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M90.5171 161.35C88.6528 174.156 77.4438 184 63.8947 184C49.0412 184 37 172.169 37 157.575C37 144.263 47.0191 133.249 60.0526 131.418V85.5824C47.0191 83.7507 37 72.7374 37 59.425C37 44.8309 49.0412 33 63.8947 33C78.7483 33 90.7895 44.8309 90.7895 59.425C90.7895 72.7374 80.7704 83.7507 67.7368 85.5824V131.418C79.5155 133.073 88.8323 142.227 90.5171 153.8H125.368C140.222 153.8 152.263 141.969 152.263 127.375V123.332C139.23 121.501 129.211 110.487 129.211 97.175C129.211 82.5809 141.252 70.75 156.105 70.75C170.959 70.75 183 82.5809 183 97.175C183 110.487 172.981 121.501 159.947 123.332V127.375C159.947 146.139 144.466 161.35 125.368 161.35H90.5171ZM44.6842 157.575C44.6842 167.999 53.2851 176.45 63.8947 176.45C74.5044 176.45 83.1053 167.999 83.1053 157.575C83.1053 147.151 74.5044 138.7 63.8947 138.7C53.2851 138.7 44.6842 147.151 44.6842 157.575ZM44.6842 59.425C44.6842 69.8494 53.2851 78.3 63.8947 78.3C74.5044 78.3 83.1053 69.8494 83.1053 59.425C83.1053 49.0006 74.5044 40.55 63.8947 40.55C53.2851 40.55 44.6842 49.0006 44.6842 59.425ZM156.105 116.05C166.715 116.05 175.316 107.599 175.316 97.175C175.316 86.7506 166.715 78.3 156.105 78.3C145.496 78.3 136.895 86.7506 136.895 97.175C136.895 107.599 145.496 116.05 156.105 116.05Z" fill="currentColor"/>
    </svg>
    `;
  };
  
  const ProgressMUI = (): HTMLString => {
  
    return `
    <div
      class="${c('progress')}"
      role="progressbar"
      style="width: 24px; height: 24px;"
    >
      <svg viewBox="22 22 44 44">
        <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6">
        </circle>
      </svg>
    </div>
    `;
  };
  
  const ButtonMUI = (
    label: HTMLString,
    id: string,
    className: string = ''
  ): HTMLString => {
  
    return `
      <button class="${c('button')} ${className}" tabindex="0" type="button" id="${id}">
        ${ProgressMUI()}
        <span class="${c('button-label')}">
          ${label}
        </span>
      </button>
    `;
  };
  
  const InputMUI = (
    label: string,
    inputParams: Record<string, string> = {},
    datalist: string = ''
  ): HTMLString => {
    const inputParamsStr = Object.entries(inputParams).map(([key, value]) => `${key}="${value}"`).join(" ");
    return `
    <div class="${c('input__container')}">
      <div>
        <input
          ${inputParamsStr}
        >
        ${datalist || '<datalist></datalist>'}
        <fieldset aria-hidden="true" class="${c('fieldset')}">
          <legend class="${c('legend')}">
            <span>
              ${label} ${ProgressMUI()}
            </span>
          </legend>
        </fieldset>
        <label class="${c('label')}"  data-shrink="true" for="${inputParams.id}">
          ${label} ${ProgressMUI()}
        </label>
      </div>
      
    </div>
    `;
  };
  
  const CloseButtonMUI = (className: string): HTMLString => {
  
    return `
    <button class="MuiButtonBase-root MuiIconButton-root ${className}" tabindex="0" type="button" id="${className}">
      <span class="MuiIconButton-label">
        <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>
      </span>
      <span class="MuiTouchRipple-root"></span>
    </button>
    `;
  };

  const getKaitenLink = (link: string, className?: string) => `
    <a
      href="${link}"
      target="_blank"
      title="Перейти в карточку (Kaiten)"
      class="${c('kaiten-link')} ${className || ''}"
    >
    ${KaitenSVG()}
    </a>
  `;
  
  const getProjectsList = (): HTMLString => {
    const datalist = `
      <datalist id="${c('gitlab-projects')}">
      </datalist>
    `;
    const inputParams = {
      list: c('gitlab-projects'),
      id: c('gitlab-project-choice'),
      name: c('gitlab-project-choice')
    };
    
    return `
      <div class="${c('gitlab-project-choice__container')}">
        ${InputMUI('Проект', inputParams, datalist)}
      </div>
    `;
  }
  
  const getBranchesList = (): HTMLString => {
    const datalist = `
      <datalist id="${c('project-branchs')}">
      </datalist>
    `;
    const inputParams = {
      list: c('project-branchs'),
      id: c('project-branch-choice'),
      name: c('project-branch-choice')
    };
    return `
      <div class="${c('project-branch-choice__container')}">
        ${InputMUI('Исходная ветка', inputParams, datalist)}
      </div>
    `;
  }
  
  const getNewBranchName = (cardId: string): HTMLString => {
    const inputParams = {
      value: cardId,
      id: c('new-branch-name'),
      name: c('new-branch-name'),
      type: "text"
    };
    return `
      <div class="${c('new-branch-name__container')}">
        ${InputMUI('Название ветки', inputParams)}
      </div>
    `;
  }
  
  const getNewMRName = (cardId: string): HTMLString => {
    const inputParams = {
      value: cardId,
      id: c('new-mr-name'),
      name: c('new-mr-name'),
      type: "text"
    };
    return `
      <div class="${c('new-mr-name__container')}">
        ${InputMUI('Название Merge Request', inputParams)}
      </div>
    `;
  }
  
  const getCreate = (): HTMLString => {
    return ButtonMUI('Создать', c('createBtn'), c('createBtn'));
  }
  
  const getCreateBranch = (): HTMLString => {
    return ButtonMUI(
      // 'Создать ветку',
      '+',
      c('createBranchBtn'), c('createBranchBtn')
    );
  }
  
  const getCreateMR = (): HTMLString => {
    return ButtonMUI(
      // 'Создать Merge Request',
      '+',
      c('createMR'), c('createMR')
      );
  }
  
  const getErrorMessageCont = (): HTMLString => {
    return `
    <div class="${c('error-message-cont')}"></div>
    `;
  }
  
  const getErrorMessageItem = (message: string): HTMLString => {
    return `
    <p class="${c('error-message-item')}">
      ${message}
    </p>
    `;
  };

  const getFormCard = (): HTMLString => `
    <div class="${c('content')}">
      ${GitlabSVG()}
      <div class="${c('content-branches')} ${c('content-row')}">
        <div class="${c('content-row-info')}">
          ${ProgressMUI()}
          ${BranchSVG()} <span id="${c('branch-info')}">0 веток</span>
        </div>
        ${getCreateBranch()}
      </div>
      <div class="${c('content-mrs')} ${c('content-row')}">
        <div class="${c('content-row-info')}">
          ${ProgressMUI()}
          ${MRSVG()} <span id="${c('mr-info')}">0 merge-запросов</span>
        </div>
        ${getCreateMR()}
      </div>
    </div>
    
    
    ${getErrorMessageCont()}
  `;

  const getBranchList = (
    arr: { projectId: number, branches: BranchType[]}[],
    projects: ProjectType[] 
  ) => `
    <div class="${c('list-item')} ${c('list-item-header')}">
      <span>Хранилище</span>
      <span>Ветка</span>
    </div>
    <ul class="${c('list')}">
      ${arr.map(({ projectId, branches }) => {
        const project = projects.find(item => item.id === projectId);
        return branches.map(branch => {
          return `<li class="${c('list-item')}">
            <a href="${project?.web_url}" target="_blank">${project?.name}</a>
            <a href="${branch.web_url}" target="_blank">${branch.name}</a>
          </li>`;
        }).join("\n");
      }).join("\n")}
    </ul>
  `;

  const getMRList = (
    arr: { projectId: number, MRs: MRType[]}[],
    projects: ProjectType[]  
  ) => `
    <div class="${c('list-item')} ${c('list-item-header')}">
      <span>Хранилище</span>
      <span>Merge Request</span>
      <span class="${c('mr-status-cell')}">Состояние</span>
    </div>
    <ul class="${c('list')}">
      ${arr.map(({ projectId, MRs }) => {
        const project = projects.find(item => item.id === projectId);
        return MRs.map(mr => {
          return `<li class="${c('list-item')}">
            <a href="${project?.web_url}" target="_blank">${project?.name}</a>
            <a href="${mr.web_url}" target="_blank" title="${mr.source_branch} -> ${mr.target_branch}">${mr.title}</a>
            <span class="${c('mr-status-cell')}"> 
              <span class="${c('mr-status')} ${c('mr-status-' + (mr.state || ''))}">${mr.state?.toUpperCase()}</span> 
            </span>
          </li>`;
        }).join("\n");
      }).join("\n")}
    </ul>
  `;

  const getFormMR = (
    cardId: string,
    selectProject: HTMLString,
    selectsBranch: HTMLString,
    selectsUser: HTMLString
  ): HTMLString => `
    <div class="${c('form')}">
      ${selectProject}
      <div class="${c('form-double-row')}" style="margin-top: 13px">
        ${MRArrowSVG()}
        ${selectsBranch}
      </div>
      <div class="${c('form-double-row')}">
        ${selectsUser}
      </div>
      <div class="${c('new-mr-cont')}">
        ${getNewMRName(cardId)}
      </div>
      ${getCreate()}
    </div>
    ${getErrorMessageCont()}
  `;

  const getFormCreateBranch = (
    cardId: string,
    selects: HTMLString,
    selectType: HTMLString
  ): HTMLString => `
    <div class="${c('form')}">
      ${selects}
      <div class="${c('new-branch-cont')}">
        ${selectType}
        ${getNewBranchName(cardId)}
      </div>
      <div class="${c('result-cont')}">
        ${CreateBranchSVG()}
        <div class="${c('ref-branch-title')}">test</div>
        <div class="${c('new-branch-title')}">test</div>
      </div>
      
      ${getCreate()}
    </div>
    ${getErrorMessageCont()}
  `;
  
  const successCreateBranch = (url: string, branchName: string): HTMLString => `
    <p class="${c('create-successed')}">
      Ветка <a href="${url}" target="_blank">${branchName}</a> успешно создана!
    </p>
  `;
  
  const successCreateMR = (url: string, MRName: string): HTMLString => `
    <p class="${c('create-successed')}">
      Merge Request <a href="${url}" target="_blank">${MRName}</a> успешно создан!
    </p>
  `;

  return {
    getProjectsList,
    getBranchesList,
    getNewBranchName,
    getCreate,
    getFormCard,
    getFormMR,
    getFormCreateBranch,  
    getErrorMessageCont,
    getErrorMessageItem,
    successCreateBranch,
    successCreateMR,
    CloseButtonMUI,
    ProgressMUI,
    getKaitenLink,
    ReverseSVG,
    getBranchList,
    getMRList
  }
};

export type HTMLFileType = {
  getAll: typeof getAll
};

export type HTMLMethodsType = ReturnType<typeof getAll>;
