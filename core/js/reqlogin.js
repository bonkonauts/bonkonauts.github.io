window.user = JSON.parse(sessionStorage.getItem('user'));
if(!user || (user && Object.keys(user).length == 0)) window.location.href = '/login';