/**
 * the app script
 * author: bangnokia xD
 * 
 * @return {[type]} [description]
 */

(function() {

    var App = function() {

        var container = document.querySelector('.container');
        var mainPage = document.querySelector('.main-page');
        var settingPage = document.querySelector('.setting-page');

        var settingIcon = document.querySelector('.setting-btn');
        var closeSettingIcon = document.querySelector('.setting-btn-close');
        var saveSettingIcon = document.querySelector('.setting-btn-save');
        var addSettingIcon = document.querySelector('.setting-btn-add');
        var settingPageActions = document.querySelector('.setting-page-action');

        var totp;
        var expirySeconds = 30;
        var framesPerSecond = 24;
        

        /**
         * bootstrap method
         * @return method 
         */
        this.run = function() {
            this.init();
            bindEvents();
        };

        this.init = function() {
            totp = new jsOTP.totp(expirySeconds);
            renderMainPage();
            renderSettingPage();
        };

        /**
         * events should be bind here
         * 
         * @return {[type]} [description]
         */
        var bindEvents = function() {

            settingIcon.addEventListener('click', showSettingPage);

            closeSettingIcon.addEventListener('click', showMainPage);

            addSettingIcon.addEventListener('click', addNewAccount);

            saveSettingIcon.addEventListener('click', saveSettings);
        };

        /**
         * display main page
         * 
         * @return {[type]} [description]
         */
        var showMainPage = function() {
                hide(settingPage);
                hide(settingPageActions);

                show(mainPage);
                show(settingIcon, 'inline-block');
        };

        /**
         * display setting page
         * 
         * @return {[type]} [description]
         */
        var showSettingPage = function() {
            show(settingPage);
            show(settingPageActions, 'inline-block');

            hide(mainPage);
            hide(settingIcon);
        };

        /**
         * render main page content
         * 
         * @return {[type]} [description]
         */
        var renderMainPage = function() {
            
            removeAllChild(mainPage);

            let gettingAllAccounts = browser.storage.local.get(null);
            gettingAllAccounts.then((accounts) => {
                for (let key in accounts) {
                    let account = accounts[key];
                    let block = renderBlock(account);
                    mainPage.appendChild(block);
                }
            }, onError);
        };

        var removeAllChild = function(node) {
            while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
            }
        };

        /**
         * render block of main page
         * 
         * @param  {[type]} data  [description]
         * @param  {[type]} block [description]
         * @return {[type]}       [description]
         */
        var renderBlock = function(data, block) {
            if (block) {
                var code = block.querySelector('.code');
                var name = block.querySelector('.name');
                var lineTime = block.querySelector('.line-time');
            } else {
                var block = document.createElement('div');
                var code = document.createElement('div');
                var name = document.createElement('div');
                var lineTime = document.createElement('div');
            }
            

            block.setAttribute('class', 'block');
            code.setAttribute('class', 'code');

            let timeCode;

            try {
                timeCode = totp.getOtp(data.secret);
            } catch ( ex) {
                timeCode = 'Error';
            }

            code.textContent = timeCode;

            name.setAttribute('class', 'name');
            name.textContent = data.account;
            lineTime.setAttribute('class', 'line-time');
            lineTime.style.width = '100%';

            block.appendChild(code);
            block.appendChild(name);
            block.appendChild(lineTime);

            var i = 0;
            var toRemove = 100 / expirySeconds / framesPerSecond;
            var loop = setInterval(function() {
                lineTime.style.width = (100 - i * toRemove) + '%';

                if ( i == expirySeconds * framesPerSecond) {
                    clearInterval(loop);
                    renderBlock(data, block);
                }

            }, 1000/framesPerSecond);

            block.addEventListener('click', copyClipboard);

            return block;
        };

        /**
         * render setting page
         * 
         * @return {[type]} [description]
         */
        var renderSettingPage = function() {

            removeAllChild(settingPage);

            let gettingAllAccounts = browser.storage.local.get(null);

            gettingAllAccounts.then((results) => {
                for (let key in results) {
                    var account = results[key];
                    console.log(account);
                    settingPage.appendChild(initFormGroup(account));
                }
            }, onError);
        }

        var addNewAccount = function() {

            settingPage.appendChild( initFormGroup());
        };

        var initFormGroup = function(data) {
            data = data || {};
            // console.log(data);
            var formGroup = document.createElement('div');
            var account = document.createElement('input');
            var secret = document.createElement('input');
            var deleteButton = document.createElement('button');

            formGroup.setAttribute('class', 'form-group');

            account.setAttribute('class', 'account');
            account.setAttribute('placeholder', 'account');
            account.value = data.account || '';

            secret.setAttribute('class', 'secret');
            secret.setAttribute('placeholder', 'secret');
            secret.value = data.secret || '';

            deleteButton.setAttribute('class', 'btn-delete');
            deleteButton.innerHTML = 'Delete';

            formGroup.appendChild(account);
            formGroup.appendChild(secret);
            formGroup.appendChild(deleteButton);

            deleteButton.addEventListener('click', function() {
                var parent = this.parentNode;
                let key = parent.querySelector('.account').value;
                let deletingItem = browser.storage.local.remove(key);
                deletingItem.then(() => {
                    parent.parentNode.removeChild(parent);
                }, onError);
            });

            return formGroup;
        }

        /**
         * save settings on seting page
         * 
         * @return {[type]} [description]
         */
        var saveSettings = function() {
            console.log('click save');
            var formGroups = document.querySelectorAll('.form-group');
            var data = {};

            var deletingItems = browser.storage.local.clear();

            deletingItems.then(() => {
                for(var i = 0; i < formGroups.length; i++ ) {
                    var account = formGroups[i].querySelector('.account');
                    var secret = formGroups[i].querySelector('.secret');

                    var obj = {
                        'account': account.value,
                        'secret': secret.value
                    };

                    if (obj.account.trim() != '' && obj.secret.trim() != '') {
                        data[obj.account] = obj;
                    }
                }

                item = browser.storage.local.set(data);
                item.then(() => {
                    notice('Success!');
                    renderMainPage();
                    showMainPage();
                }, onError);

            }, onError);
        };

        var copyClipboard = function() {
            let code = this.querySelector('.code');
            let textarea = document.createElement('textarea');
            textarea.setAttribute('class', 'copy-area');
            textarea.value = code.textContent;

            container.appendChild(textarea);

            textarea.select();

            try {
                var text = document.execCommand('copy');
            } catch (ex) {
                notice('Can not copied!');
            } finally {
                container.removeChild(textarea);
            }
        };

        /**
         * alert message after an action
         * 
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
        var notice = function(msg) {
            var alert = document.createElement('div');
            alert.setAttribute('class', 'alert');
            alert.textContent = msg;

            container.appendChild(alert);

            setTimeout(function() {
                container.removeChild(alert);
            }, 500);
        };

        var hide = function(selector) {
            selector.style.display = 'none';
        };

        var show = function(selector, blockType) {
            blockType = blockType || 'block';
            selector.style.display = blockType;
        };

        var onError = function(error) {
            console.log(error);
        };
    };

    var app = new App();

    app.run();

})();