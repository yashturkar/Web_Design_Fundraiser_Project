'use strict';

(function ($) {

    const http = function (args) {
        return new Promise(function (resolve, reject) {
            $.ajax(Object.assign({}, args, {
                url: 'http://localhost:8080/api' + args.endpoint,
                success: function (res) {
                    resolve(res);
                },
                error: function (e) {
                    reject(e);
                }
            }))
        });
    }

    /**
     * Load Data
     */
    window.loadProfile = function () {
        if (!localStorage.getItem('user'))
            return window.location = window.location.href.replace('profile.html', '');
        const user = JSON.parse(localStorage.getItem('user'));
        $.each($('span[data-key]'), (i, spanItem) => {
            $(spanItem).text(user[$(spanItem).data('key')] || '');
        });
    };

    window.logout = function () {
        localStorage.removeItem('user');
        return window.location = window.location.href.replace('profile.html', '');
    }

    $('.login-form')
        .on('submit', function (e) {
            e.preventDefault();
            localStorage.removeItem('user');
            http({
                method: 'post',
                endpoint: '/auth',
                data: {
                    username: e.target.uname.value,
                    password: e.target.psw.value
                }
            }).then(function (params) {
                console.log(params);
                if (params.status) {
                    localStorage.setItem('user', JSON.stringify(params.data));
                    window.location = 'profile.html';
                }
            }).catch(function (e) {
                console.log(e);
            })
        });

    //do same for regeisteration form
    $('.registration-form')
        .on('submit', function (e) {
            e.preventDefault();
            localStorage.removeItem('user');
            http({
                method: 'POST',
                endpoint: '/user',
                data: {
                    firstname: e.target.firstname.value,
                    lastname: e.target.lastname.value,
                    phone: e.target.phonenumber.value,
                    email: e.target.email.value,
                    plan: e.target.plan.value,
                    description: e.target.description.value,
                    username: e.target.username.value,
                    password: e.target.pass.value
                }
            }).then(function (params) {
                if (params.status) {
                    localStorage.setItem('user', JSON.stringify(params.data));
                    window.location = window.location.href.replace('register.html', 'profile.html');
                }
            }).catch(function (e) {
                console.log(e);
            })
        });
    $('.fundraiser-form')
        .on('submit', function (e) {
            e.preventDefault();
            localStorage.removeItem('fundraisers');
            http({
                method: 'POST',
                endpoint: '/fundraisers',
                data: {
                    username: e.target.username.value,
                    title: e.target.title.value,
                    amount: e.target.amount.value,
                    description: e.target.description.value
                }
            }).then(function (params) {
                if (params.status) {
                    localStorage.setItem('fundraisers', JSON.stringify(params.data));
                    window.location = window.location.href.replace('profile.html', 'index.html');
                }
            }).catch(function (e) {
                console.log(e);
            })
        });


})(jQuery || $);
