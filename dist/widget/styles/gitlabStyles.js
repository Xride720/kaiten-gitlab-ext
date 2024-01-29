"use strict";
const KAITEN_THEME_KEY = 'themePalletType';
const metaColor = () => ({});
export const initStyle = (p, additionalyStyleCallbacks) => {
    const meta = metaColor();
    const additionalyStyle = additionalyStyleCallbacks?.map(callback => callback(p, meta)).join("\n") || '';
    const styles = `
    .${p}_kaiten-link {
      cursor: pointer;
      text-decoration: none !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.3rem 0.2rem 0.2rem 0.3rem;
      margin: 0 5px;
      width: 23px;
      height: 23px;
      border-radius: 4px;
      background-color: transparent;
      transition: background-color ease .3s;
    }
    .${p}_kaiten-link:hover {
      background-color: #87878766;
    }

    .${p}_kaiten-link .${p}_kaiten-svg {
      width: 15px;
      height: 15px;
      transition: width ease .3s, height ease .3s;
    }

    .${p}_kaiten-link:active .${p}_kaiten-svg {
      width: 13px;
      height: 13px;
    }

    .${p}_kaiten-link-big {
      width: 32px;
      height: 32px;
      margin-left: -5px;
      padding: 0.21rem 0.2rem 0.2rem 0.27rem;
    }

    .${p}_kaiten-link-big .${p}_kaiten-svg {
      width: 20px;
      height: 20px;
    }

    .${p}_kaiten-link-big:active .${p}_kaiten-svg {
      width: 17px;
      height: 17px;
    }

    .${p}_kaiten-link-mrlist {
      margin-top: -5px;
    }

    .${p}_kaiten-link-mr {
      margin-right: 0.5rem;
    }

    ${additionalyStyle}

  `;
    injectStyles(p, styles);
};
function injectStyles(prefix, stylesStr) {
    const oldStyle = document.querySelector(`style#${prefix}_styles`);
    if (oldStyle) {
        oldStyle.remove();
    }
    const style = document.createElement('style');
    style.id = `${prefix}_styles`;
    style.innerHTML = stylesStr;
    document.head.appendChild(style);
}
