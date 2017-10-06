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
        

        this.run = function() {
            this.init();
            bindEvents();
        };

        this.init = function() {

        };

        var bindEvents = function() {
            settingIcon.addEventListener('click', function(e) {
                initSettingPage();
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

        var initSettingPage = function() {

            while(settingPage.hasChildNodes()) {
                settingPage.removeChild(settingPage.lastChild);
            }

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