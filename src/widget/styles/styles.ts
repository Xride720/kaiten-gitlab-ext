"use strict";
const KAITEN_THEME_KEY = 'themePalletType';

const metaColor = (theme: 'light' | 'dark') => ({
  fontColor : theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
  labelColor : theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.54)',
  fieldsetBorderColor : theme === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',

  focusColor : theme === 'dark' ? '#ab47dc' : '#9c27b0',
  focusHoverColor : theme === 'dark' ? '#9c27b054' : '#9c27b01a',
  focusSelectedColor : theme === 'dark' ? '#9c27b08f' : '#9c27b06e',
  fieldsetBorderHoverColor : theme === 'dark' ? 'rgb(192, 192, 192)' : 'rgba(0, 0, 0, 0.87)',
  
  errorColor: theme === 'dark' ? '#ff2c2c' : '#b90000',

  selectBgColor: theme === 'dark' ? '#515151' : '#ededed',
  modalBgColor: theme === 'dark' ? '#424242' : '#fff',
  modalLayoutColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',

  successColor: theme === 'dark' ? '#2bdb2b' : '#2bdb2b',

  statusMergedBgColor: theme === 'dark' ? '#32cd321f' : '#32cd321f',
  statusMergedColor: theme === 'dark' ? 'limegreen' : 'limegreen',
  statusOpenedBgColor: theme === 'dark' ? '#3db6ff1f' : '#3db6ff1f',
  statusOpenedColor: theme === 'dark' ? '#3db6ff' : '#3db6ff',
  statusClosedBgColor: theme === 'dark' ? '#ff84001f' : '#ff84001f',
  statusClosedColor: theme === 'dark' ? '#ff8400' : '#ff8400',
  statusLockedBgColor: theme === 'dark' ? '#ff07071f' : '#ff07071f',
  statusLockedColor: theme === 'dark' ? '#ff0707' : '#ff0707',
  
  buttonFontColor: theme === 'dark' ? '#ab47bc' : '#9c27b0',
  buttonBgColor: theme === 'dark' ? 'transparent' : 'transparent',
  buttonBorderColor: theme === 'dark' ? 'rgba(171, 71, 188, 0.5)' : 'rgba(156, 39, 176, 0.5)',
  buttonBgHoverColor: theme === 'dark' ? 'rgba(171, 71, 188, 0.08)' : 'rgba(156, 39, 176, 0.04)',
  buttonBorderHoverColor: theme === 'dark' ? '#ab47bc' : '#9c27b0',
});

export type MetaColorType = ReturnType<typeof metaColor>;

const buttonStyles = (p: string, meta: MetaColorType) => `
  .${p}_button {
    padding: 5px 15px;
    color: ${meta.buttonFontColor};
    border: 1px solid ${meta.buttonBorderColor};

    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    cursor: pointer;
    margin: 0;
    display: inline-flex;
    outline: 0;
    position: relative;
    align-items: center;
    user-select: none;
    vertical-align: middle;
    -moz-appearance: none;
    justify-content: center;
    text-decoration: none;
    background-color: ${meta.buttonBgColor};
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  .${p}_button:hover {
    border: 1px solid ${meta.buttonBorderHoverColor};
    background-color: ${meta.buttonBgHoverColor};
    text-decoration: none;
  }

  .${p}_button-label {
    width: 100%;
    display: inherit;
    align-items: inherit;
    justify-content: inherit;
  }
`;

const progressStyles = (p: string, meta: MetaColorType) => `
  .${p}_progress {
    display: none;
    color: ${meta.focusColor};
    animation: progressContainer 1.4s linear infinite;
    animation-name: progressContainer;
  }

  .${p}_progress.${p}_loading {
    display: inline-block !important;
  }

  .${p}_progress > svg {
    display: block;
  }

  .${p}_progress > svg > circle {
    animation: 1.4s ease-in-out infinite;
    animation-name: progressCircle;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
    stroke: currentColor;
  }

  
  @keyframes progressContainer {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
      
  @keyframes progressCircle {
    0% {
      stroke-dasharray: 0.083em, 16.667em;
      stroke-dashoffset: 0em;
    }
    50% {
      stroke-dasharray: 8.333em, 16.667em;
      stroke-dashoffset: -1.250em;
    }
    100% {
      stroke-dasharray: 8.333em, 16.667em;
      stroke-dashoffset: -10.000em;
    }
  }
`;

const inputStyles = (p: string, meta: MetaColorType) => `
  .${p}_label {
    transform: translate(14px, -6px) scale(0.75);
    z-index: 1;
    transition: color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
    transform-origin: top left;
    top: 0;
    left: 0;
    position: absolute;
    display: block;
    color: ${meta.labelColor};
    padding: 0;
    font-size: 1rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.00938em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .${p}_fieldset {
    top: -5px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0 8px;
    overflow: hidden;
    position: absolute;
    border-style: solid;
    border-width: 1px;
    border-radius: inherit;
    border-color: ${meta.fieldsetBorderColor};
    pointer-events: none;
  }
  .${p}_input__container {
    margin-top: 16px;
    margin-bottom: 8px;
    border: 0;
    padding: 0;
    position: relative;
    min-width: 0;
    vertical-align: top;
  }
  .${p}_input__container > div:first-child {
    position: relative;
    border-radius: 4px;
    width: 100%;
    color: ${meta.fontColor};
    cursor: text;
    font-size: 1rem;
    box-sizing: border-box;
    display: inline-flex;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.1876em;
    letter-spacing: 0.00938em;
  }
  .${p}_input__container .${p}_fieldset {
    transition: border-color ease .3s, color ease .3s;
  } 
  .${p}_input__container input {
    padding: 10.5px 18.5px 10.5px 14px;
    font: inherit;
    color: currentColor;
    width: 100%;
    border: 0;
    height: 1.1876em;
    margin: 0;
    display: block;
    min-width: 0;
    background: none;
    box-sizing: content-box;
    animation-name: mui-auto-fill-cancel;
    letter-spacing: inherit;
    animation-duration: 10ms;
    -webkit-tap-highlight-color: transparent;
  } 
  .${p}_legend {
    width: auto;
    height: 11px;
    display: block;
    padding: 0;
    font-size: 0.75em;
    text-align: left;
    visibility: hidden;
    max-width: 1000px;
    transition: max-width 100ms cubic-bezier(0.0, 0, 0.2, 1) 50ms;
  }

  .${p}_legend > span {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const initStyle = (
  p: string,
  additionalyStyleCallbacks?: ((p: string, meta: MetaColorType) => string)[]
) => {  
  const id = `#${p}`;
  const theme = getKaitenThemeType();
  const meta = metaColor(theme);
  const additionalyStyle = additionalyStyleCallbacks?.map(callback => callback(p, meta)).join("\n") || '';
  const styles = `
    ${id} {
    }

    .${p}_container {
      margin-bottom: 48px;
    }

    .${p}_gitlab-svg {
      top: 0;
      left: -42px;
      bottom: 0;
      margin: auto;
      position: absolute;
      width: 40px;
      height: 40px;
    }

    .${p}_form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
    }

    .${p}_form > * {
      flex: 1;
      width: 100%;
    }

    .${p}_form * {
      opacity: 1;
      transition: opacity ease .3s;
    }

    .${p}_form-disabled {
      cursor: progress;
    }

    .${p}_form.${p}_form-disabled * {
      pointer-events: none !important;
      opacity: .95;
    } 

    .${p}_create-successed {
      color: ${meta.successColor};
      font-size: 16px;
    }

    .${p}_gitlab-project-choice {

    }
    .${p}_gitlab-project-choice__container {

    }

    .${p}_gitlab-projects {

    }

    .${p}_project-branch-choice {

    }
    .${p}_project-branch-choice__container,
    .${p}_gitlab-project-choice__container {
      position: relative;
    }

    .${p}_project-branch-choice__container .${p}_progress.${p}_loading,
    .${p}_gitlab-project-choice__container .${p}_progress.${p}_loading {
      width: 15px !important;
      height: 15px !important;
      margin-left: 4px !important;
    }

    .${p}_project-branchs {

    }

    .${p}_new-branch-name {

    }
    .${p}_new-branch-name__container {

    }

    .${p}_createBtn {
      margin-top: 16px;
      margin-bottom: 8px;
      height: 39.9px;
    }

    .${p}_createBtn .${p}_progress.${p}_loading + span {
      display: none;
    }

    ${inputStyles(p, meta)}
    
    .${p}_form:not(.${p}_form-disabled) .${p}_input__container input:focus::-webkit-calendar-picker-indicator {
      color: ${meta.focusColor};
    } 

    .${p}_form:not(.${p}_form-disabled) .${p}_input__container:hover .${p}_fieldset {
      border-color: ${meta.fieldsetBorderHoverColor};
    } 

    .${p}_form:not(.${p}_form-disabled) .${p}_input__container input:focus + datalist + .${p}_fieldset {
      border-color: ${meta.focusColor};
      border-width: 2px;
    } 

    .${p}_form:not(.${p}_form-disabled) .${p}_input__container input:focus + datalist + .${p}_fieldset + .${p}_label {
      color: ${meta.focusColor};
    } 

    ${progressStyles(p, meta)}

    .${p}_error-message-cont {
      color: ${meta.errorColor};
      font-size: 13px;
    }

    .${p}_error-message-item {
      margin: 0;
      padding: 3px 5px;
      word-break: break-all;
    }

    .${p}_createBranchBtn {
      
    }

    .${p}_new-branch-cont {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .${p}_new-branch-cont > *:nth-child(1) {
      width: 105px;
    }
    .${p}_new-branch-cont > *:nth-child(2) {
      width: 100%;
    }

    .${p}_new-branch-result {
      background: ${meta.selectBgColor};
      padding: 7px 15px;
      max-width: 100%;
      box-sizing: border-box;
      border: 1px solid ${meta.fieldsetBorderColor};
      border-radius: 4px;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .${p}_form-double-row {
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 100%;
      box-sizing: border-box;
      flex-wrap: wrap;
      position: relative;
    }
    .${p}_form-double-row > *:not(svg) {
      flex: .5;
    }
    
    .${p}_mr-arrow-svg {
      position: absolute;
      width: 50%;
      height: 25px;
      top: -15px;
      left: 25%;
      color: ${meta.focusColor};
    }

    @media only screen and (max-width: 1000px)  {
      .${p}_form-double-row {
        gap: 0px;
        margin-top: 0 !important;
      }
      .${p}_form-double-row > * {
        flex: 1;
        min-width: 100%;
      }
      .${p}_mr-arrow-svg  {
        display: none;
      }
      .${p}_reverse-svg {
        position: absolute;
        top: calc(50% - 28px);
        right: calc(50% - 18px);
        margin: 0;
        min-width: 0;
        transform: rotate(90deg);
      }
    }
    .${p}_result-cont {
      position: relative;
      font-size: 16px;
    }
    .${p}_result-cont > div {
      position: absolute;
      left: 185px;
      background: ${meta.selectBgColor};
      padding: 3px 9px;
      max-width: 100%;
      box-sizing: border-box;
      border: 1px solid ${meta.fieldsetBorderColor};
      border-radius: 4px;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .${p}_ref-branch-title {
      top: 2px;
    }
    .${p}_new-branch-title {
      top: 62px;
    }
    .${p}_create-branch-svg {
      width: 200px;
      height: 100px;
      color: ${meta.fieldsetBorderColor};
    }
    .${p}_create-branch-svg > path:nth-child(2),
    .${p}_create-branch-svg > circle:nth-child(4) {
      stroke: ${meta.focusColor};
    }

    .${p}_reverse-svg {
      color: ${meta.fieldsetBorderColor};
      width: 25px;
      height: 25px;
      padding: 3px;
      margin-top: 16px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .${p}_content {
      border: 1px solid ${meta.focusColor};
      border-radius: 4px;
      width: 50%;
      max-width: 300px;
      position: relative;
    }
    .${p}_content-row {
      display: flex;
    }
    .${p}_content-row:not(:last-child) {
      border-bottom: 1px solid ${meta.focusColor};
    }
    .${p}_content-row button {
      width: 36px;
      min-width: 36px;
      padding: 5px;
      font-size: 20px;
      line-height: 10px;
    }
    .${p}_content-branches button {
      border-radius: 0 4px 0 0;
      border-width: 0px 0px 0px 1px !important;
    }
    .${p}_content-mrs button {
      border-radius: 0 0 4px 0;
      border-width: 0px 0px 0px 1px !important;
    }
    .${p}_content-row-info {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px;
      cursor: pointer;
      transition: color ease .3s;
    }
    .${p}_content-row-info .${p}_mr-svg,
    .${p}_content-row-info .${p}_branch-svg {
      width: 25px;
      height: 25px;
      transition: color ease .3s;
    }
    .${p}_content-row-info .${p}_progress {
      width: 20px !important;
      height: 20px !important;
      margin-left: 5px;
    }
    .${p}_content-row-info:hover {
      color: ${meta.focusColor};
    }
    .${p}_content-row-info:hover svg {
      color: ${meta.focusColor};
    }

    .${p}_list {
      list-style: none;
      padding: 0;
      max-height: calc(80vh - 68px);
      overflow: hidden;
      overflow-y: auto;
      margin: 0;
    }
    .${p}_list::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    .${p}_list::-webkit-scrollbar-track {
      background: transparent;
    }

    .${p}_list::-webkit-scrollbar-thumb {
      background-color: ${meta.fieldsetBorderColor};
      border: 3px solid ${meta.modalBgColor};
      border-radius: 20px;
    }
    .${p}_list-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid ${meta.fieldsetBorderColor};
    }
    .${p}_list-item > * {
      flex: .5;
      padding: 7px 12px;
      text-decoration: none;
      transition: background-color ease .3s, color ease .3s;
      cursor: default;
    }
    .${p}_list-item > a:hover {
      text-decoration: none;
      background: ${meta.focusHoverColor};
      color: inherit;
    }
    .${p}_list-item-header {
      color: ${meta.labelColor};
      cursor: default;
    }

    .${p}_mr-status-cell {
      flex: .1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .${p}_mr-status {
      padding: 0px 4px;
      border: 1px solid;
      border-radius: 3px;
      font-size: 12px;
    }
    .${p}_mr-status-opened {
      border-color: ${meta.statusOpenedColor};
      color: ${meta.statusOpenedColor};
      background: ${meta.statusOpenedBgColor};
    }
    .${p}_mr-status-merged {
      border-color: ${meta.statusMergedColor};
      color: ${meta.statusMergedColor};
      background: ${meta.statusMergedBgColor};
    }
    .${p}_mr-status-closed {
      border-color: ${meta.statusClosedColor};
      color: ${meta.statusClosedColor};
      background: ${meta.statusClosedBgColor};
    }
    .${p}_mr-status-locked {
      border-color: ${meta.statusLockedColor};
      color: ${meta.statusLockedColor};
      background: ${meta.statusLockedBgColor};
    }

    ${buttonStyles(p, meta)}

    ${additionalyStyle}
  `;
  injectStyles(p, styles);
};

export type StylesType = {
  initStyle: typeof initStyle
};


function getKaitenThemeType(): 'light' | 'dark' {
  try {
    const str = localStorage.getItem(KAITEN_THEME_KEY);
    const res = str ? JSON.parse(str) : { type: 'auto' };
    if (res.type === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return res.type || 'light';
  } catch (error) {
    return 'light';
  }
}

function injectStyles(prefix: string, stylesStr: string) {
  const oldStyle = document.querySelector(`style#${prefix}_styles`);
  if (oldStyle) {
    oldStyle.remove();
  }
  const style = document.createElement('style');
  style.id = `${prefix}_styles`;
  style.innerHTML = stylesStr;
  document.head.appendChild(style);
}