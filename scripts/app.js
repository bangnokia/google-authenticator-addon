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

        var addNewAccount = function() {

            settingPage.appendChild( initFormGroup());
        };

        var initFormGroup = function(data) {
            data = data || {};
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
                this.parentNode.remove(); 
            });

            return formGroup;
        }

        var saveSettings = function() {
            
        };

        var hide = function(selector) {
            selector.style.display = 'none';
        };

        var show = function(selector, blockType) {
            blockType = blockType || 'block';
            selector.style.display = blockType;
        };
    };

    var app = new App();

    app.run();

})();