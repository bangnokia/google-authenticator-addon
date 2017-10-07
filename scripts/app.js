/**
 * the app script
 * author: bangnokia xD
 * 
 * @return {[type]} [description]
 */

(function() {

    var App = function() {

        var block = document.querySelector('.block');
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
        

        this.run = function() {
            this.init();
            bindEvents();
        };

        this.init = function() {
            totp = new jsOTP.totp(expirySeconds);
            renderMainPage();
            renderSettingPage();
        };

        var bindEvents = function() {
            settingIcon.addEventListener('click', function(e) {
                // initSettingPage();
                show(settingPage);
                show(settingPageActions, 'inline-block');

                hide(mainPage);
                hide(settingIcon);
            });

            closeSettingIcon.addEventListener('click', function(e) {
                hide(settingPage);
                hide(settingPageActions);

                show(mainPage);
                show(settingIcon, 'inline-block');
            });

            addSettingIcon.addEventListener('click', addNewAccount);

            saveSettingIcon.addEventListener('click', saveSettings);
        };

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
                i++;
                console.log(i);
                lineTime.style.width = (100 - i * toRemove) + '%';

                if ( i == expirySeconds * framesPerSecond) {
                    clearInterval(loop);
                    renderBlock(data, block);
                }

            }, 1000/framesPerSecond);

            return block;
        }

        var reRenderBlock = function(block, data) {
            var code = block.querySelector('.code');
            var name = block.querySelector('.name');
            var lineTime = block.querySelector('.line-time');

            let timeCode;
            try {
                timeCode = totp.getOtp(data.secret);
            } catch ( ex) {
                timeCode = 'Error';
            }

            code.textContent = timeCode;

            lineTime.style.width = '100%';
        };

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

        var saveSettings = function() {
            console.log('click save');
            var formGroups = document.querySelectorAll('.form-group');
            var data = [];

            var deletingItems = browser.storage.local.clear();

            deletingItems.then(() => {
                console.log(formGroups.length);
                for(var i = 0; i < formGroups.length; i++ ) {
                    var account = formGroups[i].querySelector('.account');
                    var secret = formGroups[i].querySelector('.secret');

                    var obj = {
                        'account': account.value,
                        'secret': secret.value
                    };

                    if (obj.account.trim() != '' && obj.secret.trim() != '') {
                        var item = browser.storage.local.set({
                            [obj.account] : obj
                        });
                        item.then((result) => {
                            console.log(result);
                            // let x = browser.storage.local.get(null);
                            // x.then((result) => {console.log(result)}, onError);
                        }, onError);
                    }
                }
            }, onError);
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