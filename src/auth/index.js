//check if user is authenticated
export const isAuthenticated = () => {
    if(typeof window == 'undefined'){
        return false;
    }
    if(localStorage.getItem('adminInfo')){
        return JSON.parse(localStorage.getItem('adminInfo'));
    }else{
        return false;
    }
}