export class ComponentAbstract {
    constructor({ c, htmlMethods }) {
        this.c = c;
        this.htmlMethods = htmlMethods;
    }
}
export class SelectComponent extends ComponentAbstract {
    constructor(data) {
        super(data);
        this.open = false;
        this.readonly = false;
        this.fixedOptions = false;
        this.options = [];
        this.handleCloseDropdown = this.handleCloseDropdown.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.htmlListItem = this.htmlListItem.bind(this);
        this.html = this.html.bind(this);
        this.styles = this.styles.bind(this);
        this.clearData = this.clearData.bind(this);
        this.setDropdownOpen = this.setDropdownOpen.bind(this);
        this.id = data.id;
        this.name = data.name;
        this.label = data.label;
        this.readonly = data.readonly || false;
        this.placeholder = data.placeholder || '';
        this.options = data.options || [];
        this.fixedOptions = data.fixedOptions || false;
    }
    get className() {
        const { c, id } = this;
        return {
            cont: c(`${id}-cont`),
            input: c(`${id}-input`),
            list: c(`${id}-list`),
            listItem: c(`${id}-list-item`),
        };
    }
    get contEl() {
        const { c, className } = this;
        return document.getElementById(className.cont);
    }
    ;
    get inputEl() {
        const { className } = this;
        return this.contEl?.querySelector(`#${className.input}`) || null;
    }
    ;
    get listEl() {
        const { className } = this;
        return this.contEl?.querySelector(`#${className.list}`) || null;
    }
    ;
    get listItemEls() {
        const { className } = this;
        return this.contEl?.querySelectorAll(`.${className.listItem}`) || null;
    }
    ;
    init({ onClose, onSelect, onInput }) {
        const { options, handleCloseDropdown, setDropdownOpen, handleSelect } = this;
        const $this = this;
        !this.fixedOptions && this.updateSelectOptions([]);
        this.inputEl?.addEventListener('focusout', function (e) {
            const { inputEl } = $this;
            if (inputEl && inputEl.dataset.name !== inputEl.value)
                inputEl.value = "";
            handleCloseDropdown(e, onClose);
        });
        this.inputEl?.addEventListener('focus', function (e) {
            setDropdownOpen(true);
        });
        this.inputEl?.addEventListener('input', function (e) {
            const value = e.target.value;
            onInput && onInput($this, value);
        });
        this.listEl?.addEventListener('mousedown', function (e) {
            handleSelect(e, onSelect);
        });
        const defaultItem = options.find(item => item.default);
        if (defaultItem) {
            this.listItemEls?.forEach((item) => {
                if (item.dataset.id === defaultItem.id) {
                    handleSelect({ target: item }, onSelect);
                }
            });
        }
    }
    handleSelect(e, onSelect) {
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();
        const { options, inputEl, className, c } = this;
        const item = e.target.closest(`.${className.listItem}`);
        if (!item)
            return;
        const option = options.find(opt => String(opt.id) === String(item.dataset.id));
        if (!option)
            return;
        this.clearSelect(true);
        item.classList.add(c('select-list__item-selected'));
        if (!inputEl)
            return;
        inputEl.dataset.id = String(option.id);
        inputEl.dataset.name = option.name;
        inputEl.value = option.name;
        inputEl.blur();
        onSelect && onSelect(String(option.id), String(option.name));
    }
    clearSelect(clearInput = false) {
        const { listItemEls, c, inputEl, clearData } = this;
        listItemEls?.forEach(item => {
            item.classList.remove(c('select-list__item-selected'));
        });
        if (!inputEl || !clearInput)
            return;
        clearData();
        inputEl.value = "";
    }
    clearData() {
        const { inputEl } = this;
        if (!inputEl)
            return;
        inputEl.dataset.id = "";
        inputEl.dataset.name = "";
    }
    handleCloseDropdown(e, onCloseDropdown) {
        this.setDropdownOpen(false);
        onCloseDropdown && onCloseDropdown(e);
    }
    setDropdownOpen(open) {
        const { c, listEl } = this;
        if (!listEl)
            return;
        this.open = open;
        if (open) {
            listEl.classList.add(c('list-open'));
        }
        else {
            listEl.classList.remove(c('list-open'));
        }
    }
    ;
    get optionsContent() {
        const { htmlListItem, options, c } = this;
        return options.length ? options.map(htmlListItem).join("\n") : `<p class="${c('empty-block')}">Нет данных</p>`;
    }
    updateSelectOptions(newOptions) {
        this.options = newOptions;
        const { optionsContent, listEl, htmlMethods } = this;
        if (!listEl)
            return;
        listEl.innerHTML = `
      ${optionsContent}
      ${htmlMethods.ProgressMUI()}  
    `;
    }
    html() {
        const { c, htmlMethods, label, className, optionsContent, placeholder, readonly } = this;
        return `
    <div class="${c('input__container')}" id="${className.cont}">
      <div>
        <input
          id="${className.input}"
          name="${className.input}"
          placeholder="${placeholder}"
          ${readonly ? 'readonly style="cursor: pointer;"' : ""}
          autocomplete="off"
        >
        <fieldset aria-hidden="true" class="${c('fieldset')}">
          <legend class="${c('legend')}">
            <span>
              ${label} ${htmlMethods.ProgressMUI()}
            </span>
          </legend>
        </fieldset>
        <label class="${c('label')}"  data-shrink="true" for="${className.input}">
          ${label} ${htmlMethods.ProgressMUI()}
        </label>
        <div class="${c('select-list')} ${className.list}" id="${className.list}">
          ${optionsContent}
          ${htmlMethods.ProgressMUI()}
        </div>
      </div>
      
    </div>
    `;
    }
    htmlListItem({ id, name }) {
        const { c, className } = this;
        return `
      <div class="${c('select-list__item')} ${className.listItem}" data-id="${id}" data-name="${name}">
        ${name}
      </div>
    `;
    }
    styles(p, meta) {
        return `
      .${p}_input__container {
        position: relative;
      }
      .${p}_select-list {
        overflow: hidden;
        position: absolute;
        max-height: 180px;
        background: ${meta.selectBgColor};
        z-index: 1500;
        top: 48px;
        border: 1px solid ${meta.fieldsetBorderColor};
        box-shadow: 0 0px 5px ${meta.fieldsetBorderColor};
        border-radius: 5px;
        width: 100%;
        overflow-y: auto;
        display: none;
        cursor: pointer;
      }
      .${p}_select-list::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      .${p}_select-list::-webkit-scrollbar-track {
        background: transparent;
      }

      .${p}_select-list::-webkit-scrollbar-thumb {
        background-color: ${meta.fieldsetBorderColor};
        border: 3px solid ${meta.selectBgColor};
        border-radius: 20px;
      }

      .${p}_select-list.${p}_list-open {
        display: block;
      }

      .${p}_select-list .${p}_select-list__item {
        padding: 7px 12px;
        cursor: pointer;
        background-color: transparent;
        transition: background-color ease .3s;
      }
      .${p}_select-list .${p}_select-list__item:not(.${p}_select-list__item-selected):hover {
        background-color: ${meta.focusHoverColor};
      }
      .${p}_select-list .${p}_select-list__item-selected {
        background-color: ${meta.focusSelectedColor};
      }

      .${p}_input__container .${p}_progress.${p}_loading {
        width: 15px !important;
        height: 15px !important;
        margin-left: 4px !important;
      }

      .${p}_select-list .${p}_progress {
        position: absolute;
        top: calc(50% - 7px);
        left: calc(50% - 7px);
      }

      .${p}_empty-block {
        text-align: center;
        color: ${meta.labelColor};
        margin: 22px 0;
      }
    `;
    }
}
