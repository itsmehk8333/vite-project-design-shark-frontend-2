
export const saveToken = (token: string) => {
    // console.log(token, "token")
    localStorage.setItem("token", token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  export const removeToken = () => {
    localStorage.removeItem("token");
  };
  