import { HTMLMethodsType } from "widget/html/index";
import { MetaColorType } from "widget/styles/styles";
import { HTMLString, PrefixerType, StylesString } from "widget/types";
import { ComponentPropsType } from "./types";

export abstract class ComponentAbstract<TProps extends ComponentPropsType = ComponentPropsType> {
  protected c: PrefixerType;
  protected htmlMethods: HTMLMethodsType;
  constructor({ 
    c,
    htmlMethods
  }: TProps) {
    this.c = c;
    this.htmlMethods = htmlMethods
  }

  protected abstract html(...args: any[]): HTMLString;
  protected abstract init(...args: any[]): void;
  protected abstract styles(...args: any[]): StylesString;
}

type ModalPropsType = ComponentPropsType & {

};

type ModalContentProps = {
  title: HTMLString,
  content: HTMLString,
  footer?: HTMLString,
  customInit?: () => void,
  onClose?: (e: MouseEvent) => void
  width?: string;
};

export class ModalComponent extends ComponentAbstract<ModalPropsType> {

  private open: boolean = false;

  constructor(data: ModalPropsType) {
    super(data);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.styles = this.styles.bind(this);
  }

  private get modalLayoutEl(): HTMLElement | null {
    const { c } = this;
    return document.getElementById(c('modal-layout'));
  };

  private get modalEl(): HTMLElement | null {
    const { c } = this;
    return this.modalLayoutEl?.querySelector(`#${c('modal')}`) || null;
  };

  private get closeBtnEl(): HTMLElement | null {
    const { c } = this;
    return this.modalEl?.querySelector(`#${c('close-modal')}`) || null;
  };

  init(
    {
      title,
      content,
      footer,
      width,
      customInit,
      onClose
    }: ModalContentProps
  ) {
    const { c, handleCloseModal } = this;
    this.initModal(
      this.html(title, content, footer)
    );
    if (this.modalEl && width) this.modalEl.style.width = width;
    customInit && customInit();
    this.closeBtnEl?.addEventListener('mousedown', function(e: MouseEvent) {
      handleCloseModal(e, onClose);
    });
    this.modalLayoutEl?.addEventListener('mousedown', function(e: MouseEvent) {
      handleCloseModal(e, onClose);
    });
    this.modalEl?.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  private handleCloseModal(e: MouseEvent, onClose?: (e: MouseEvent) => void) {
    const { c } = this;
    if ((e.target as Element).closest(`.${c('modal')}`) && !(e.target as Element).closest(`#${c('close-modal')}`)) return;
    this.setOpen(false);

    onClose && onClose(e);
  }

  private initModal(modalHtml: HTMLString)  {
    const { c } = this;
    this.modalLayoutEl?.remove();
    const layout = document.createElement("div");
    layout.classList.add(c('modal-layout'));
    layout.id = c('modal-layout');
    layout.innerHTML = modalHtml;
    document.body.appendChild(layout);
  };

  setOpen(open: boolean) {
    const { c } = this;
    if (!this.modalLayoutEl) return;
    this.open = open;
    if (open) {
      this.modalLayoutEl.classList.add(c('open'));
    } else {
      this.modalLayoutEl.classList.remove(c('open'));
      this.modalLayoutEl.remove();
    }
  };

  html(
    title: HTMLString,
    content: HTMLString,
    footer?: HTMLString
  ): HTMLString {
    const { c, htmlMethods } = this;
    return `
      <div class="${c('modal')}" id="${c('modal')}">
        ${htmlMethods.CloseButtonMUI(c('close-modal'))}
        <div class="${c('modal-title')}">
          ${title}
        </div>
        <div class="${c('modal-content')}">
          ${content}
        </div>
        <div class="${c('modal-footer')}">
          ${footer || ''}
        </div>
      </div>
    `;
  }

  styles(p: string, meta: MetaColorType) {
    return `
    #${p}_modal-layout.${p}_modal-layout {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      align-items: center;
      justify-content: center;
      background: ${meta.modalLayoutColor};
    }

    #${p}_modal-layout.${p}_modal-layout.${p}_open {
      display: flex;
      z-index: 1300;
    }

    #${p}_modal-layout .${p}_modal {
      width: 40vw;
      max-height: 80vh;
      background: ${meta.modalBgColor};
      position: relative;
      padding: 20px;
      border-radius: 6px;
      min-width: 500px;
      max-width: 1160px;
    }

    @media only screen and (max-width: 1000px)  {
      #${p}_modal-layout .${p}_modal {
        overflow: hidden;
        overflow-y: auto;
      }
    }

    #${p}_modal-layout .${p}_modal::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    #${p}_modal-layout .${p}_modal::-webkit-scrollbar-track {
      background: transparent;
    }

    #${p}_modal-layout .${p}_modal::-webkit-scrollbar-thumb {
      background-color: ${meta.fieldsetBorderColor};
      border: 3px solid ${meta.modalBgColor};
      border-radius: 20px;
    }

    #${p}_modal-layout .${p}_modal-title {
      font-size: 16px;
      line-height: 28px;
    }

    #${p}_modal-layout .${p}_modal-content {

    }

    #${p}_modal-layout .${p}_modal-footer {

    }

    #${p}_modal-layout .${p}_close-modal {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    `;
  }
}

export type ModalFileType = {
  ModalComponent: typeof ModalComponent;
};