'use strict';

(function($){

    const http = function (args) {
        return new Promise(function(resolve, reject){
            $.ajax(Object.assign({}, args, {
                url: 'http://localhost:8080/api' + args.endpoint,
                success: function(res){
                    resolve(res);
                },
                error: function(e) {
                    reject(e);
                }
            }))
        });
    }

    /**
     * Load Data
     */
    window.loadProfile = function() {
        if (!localStorage.getItem('user'))
            return window.location = window.location.href   .replace('profile.html', '');
        const user = JSON.parse(localStorage.getItem('user'));
        $.each($('span[data-key]'), (i, spanItem )=> {
            $(spanItem).text(user[$(spanItem).data('key')] || '');
        });
    };

    window.logout = function() {
        localStorage.removeItem('user');
        return window.location = window.location.href.replace('profile.html', '');
    }

    $('.login-form')
        .on('submit', function(e){
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
        .on('register', function(e){
            e.preventDefault();
            localStorage.removeItem('user');
            http({
                method: 'get',
                endpoint: '/user',
                data: {
                    firstname: e.target.firstname.value,
                    lastname: e.target.lastname.value,
                    phone: e.target.phone.value,
                    email: e.target.email.value,
                    plan: e.target.plan.value,
                    description: e.target.description.value,
                    username: e.target.uname.value,
                    password: e.target.psw.value
                }
            }).then(function (params) {
                console.log(params);
                if (params.status) {
                    localStorage.setItem('user', JSON.stringify(params.data));
                    window.location = 'register.html';
                }
            }).catch(function (e) {
                console.log(e);
            })
        });


})(jQuery || $);
